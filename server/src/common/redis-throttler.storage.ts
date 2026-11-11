import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import * as net from 'net';
import * as tls from 'tls';
import { URL } from 'url';

interface LocalBucket {
  hits: number;
  expiresAt: number;
}

interface PendingCommand {
  resolve: (value: unknown) => void;
  reject: (err: Error) => void;
}

/**
 * Distributed Redis RESP Throttler Storage for horizontal scaling behind load balancers.
 * Uses a zero-dependency serialized RESP socket when REDIS_URL is configured,
 * and falls back gracefully to a bounded in-memory TTL store when unavailable or unconfigured.
 */
@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage, OnModuleDestroy {
  private readonly logger = new Logger(RedisThrottlerStorage.name);
  private readonly redisUrl: string | undefined;
  private readonly memoryStore = new Map<string, LocalBucket>();
  private readonly maxMemoryKeys = 10000;
  private readonly sweepInterval: NodeJS.Timeout;

  private socket: net.Socket | tls.TLSSocket | null = null;
  private connected = false;
  private connecting = false;
  private buffer = Buffer.alloc(0);
  private queue: PendingCommand[] = [];
  private commandChain: Promise<unknown> = Promise.resolve();

  private static readonly RATE_LIMIT_LUA =
    'local c = redis.call("INCR", KEYS[1]); ' +
    'if tonumber(c) == 1 then redis.call("PEXPIRE", KEYS[1], ARGV[1]); end; ' +
    'local pttl = redis.call("PTTL", KEYS[1]); ' +
    'return {c, pttl};';

  constructor(redisUrl?: string) {
    this.redisUrl = redisUrl?.trim() || undefined;
    if (this.redisUrl) {
      this.connect().catch((err) => {
        this.logger.warn(
          `Redis throttler unavailable at startup (${(err as Error).message}); using bounded local fallback until connected.`,
        );
      });
    }

    this.sweepInterval = setInterval(() => this.pruneExpiredMemory(), 60_000);
    if (typeof this.sweepInterval.unref === 'function') {
      this.sweepInterval.unref();
    }
  }

  get isRedisEnabled(): boolean {
    return Boolean(this.redisUrl);
  }

  get isRedisConnected(): boolean {
    return this.connected;
  }

  async onModuleDestroy(): Promise<void> {
    clearInterval(this.sweepInterval);
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
    this.connected = false;
    this.flushQueueWithError(new Error('RedisThrottlerStorage shutting down'));
  }

  async increment(
    key: string,
    ttlMs: number,
  ): Promise<{ totalHits: number; timeToExpire: number }> {
    const safeTtlMs = Math.max(1000, ttlMs);

    if (this.redisUrl) {
      try {
        const res = (await this.execCommand([
          'EVAL',
          RedisThrottlerStorage.RATE_LIMIT_LUA,
          '1',
          `arcadia:rl:${key}`,
          String(safeTtlMs),
        ])) as [number, number];

        const totalHits = Number(res?.[0] ?? 1);
        const pttlMs = Number(res?.[1] ?? safeTtlMs);
        return {
          totalHits,
          timeToExpire: Math.max(1, Math.ceil((pttlMs > 0 ? pttlMs : safeTtlMs) / 1000)),
        };
      } catch (err) {
        this.logger.warn(
          `Redis rate-limit error (${(err as Error).message}); falling back to bounded local store.`,
        );
      }
    }

    return this.incrementLocal(key, safeTtlMs);
  }

  async ping(): Promise<boolean> {
    if (!this.redisUrl) return true;
    try {
      const pong = await this.execCommand(['PING']);
      return pong === 'PONG';
    } catch {
      return false;
    }
  }

  private incrementLocal(
    key: string,
    ttlMs: number,
  ): { totalHits: number; timeToExpire: number } {
    const now = Date.now();
    const existing = this.memoryStore.get(key);

    if (!existing || existing.expiresAt <= now) {
      if (this.memoryStore.size >= this.maxMemoryKeys) {
        this.pruneExpiredMemory();
        if (this.memoryStore.size >= this.maxMemoryKeys) {
          const oldestKey = this.memoryStore.keys().next().value;
          if (oldestKey) this.memoryStore.delete(oldestKey);
        }
      }
      const expiresAt = now + ttlMs;
      this.memoryStore.set(key, { hits: 1, expiresAt });
      return { totalHits: 1, timeToExpire: Math.max(1, Math.ceil(ttlMs / 1000)) };
    }

    existing.hits += 1;
    const remainingMs = Math.max(1000, existing.expiresAt - now);
    return { totalHits: existing.hits, timeToExpire: Math.ceil(remainingMs / 1000) };
  }

  private pruneExpiredMemory(): void {
    const now = Date.now();
    for (const [k, v] of this.memoryStore.entries()) {
      if (v.expiresAt <= now) {
        this.memoryStore.delete(k);
      }
    }
  }

  private execCommand(args: string[]): Promise<unknown> {
    const run = async () => {
      await this.ensureConnected();
      return this.sendSerialized(args);
    };

    const next = this.commandChain.then(run, run);
    this.commandChain = next.catch(() => undefined);
    return next;
  }

  private async ensureConnected(): Promise<void> {
    if (this.connected && this.socket && !this.socket.destroyed) return;
    await this.connect();
  }

  private connect(): Promise<void> {
    if (!this.redisUrl) {
      return Promise.reject(new Error('REDIS_URL not configured'));
    }
    if (this.connecting) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (this.connected) resolve();
          else reject(new Error('Redis connection timeout'));
        }, 1500);
      });
    }

    this.connecting = true;
    return new Promise((resolve, reject) => {
      let parsed: URL;
      try {
        parsed = new URL(this.redisUrl!);
      } catch {
        this.connecting = false;
        reject(new Error('Invalid REDIS_URL format'));
        return;
      }

      const isTls = parsed.protocol === 'rediss:';
      const port = parsed.port ? parseInt(parsed.port, 10) : 6379;
      const host = parsed.hostname || '127.0.0.1';
      const password = parsed.password ? decodeURIComponent(parsed.password) : undefined;
      const username = parsed.username ? decodeURIComponent(parsed.username) : undefined;
      const dbStr = parsed.pathname?.replace('/', '');

      let settled = false;
      const failOnce = (err: Error) => {
        if (settled) return;
        settled = true;
        reject(err);
      };

      const onConnect = async () => {
        this.connected = true;
        this.connecting = false;
        try {
          if (password) {
            await this.sendSerialized(
              username && username !== 'default'
                ? ['AUTH', username, password]
                : ['AUTH', password],
            );
          }
          if (dbStr && /^\d+$/.test(dbStr) && dbStr !== '0') {
            await this.sendSerialized(['SELECT', dbStr]);
          }
          if (!settled) {
            settled = true;
            resolve();
          }
        } catch (authErr) {
          this.socket?.destroy();
          this.connected = false;
          failOnce(authErr as Error);
        }
      };

      const sock = isTls
        ? tls.connect({ host, port, servername: host })
        : net.createConnection({ host, port });

      this.socket = sock;
      sock.setTimeout(5000);
      sock.once('connect', () => {
        void onConnect();
      });
      sock.on('data', (chunk: Buffer) => this.handleData(chunk));
      sock.on('timeout', () => {
        sock.destroy(new Error('Redis socket idle/response timeout'));
      });
      sock.on('error', (err) => {
        this.connected = false;
        this.connecting = false;
        this.flushQueueWithError(err);
        failOnce(err);
      });
      sock.on('close', () => {
        this.connected = false;
        this.connecting = false;
        const closeErr = new Error('Redis connection closed');
        this.flushQueueWithError(closeErr);
        failOnce(closeErr);
      });
    });
  }

  private sendSerialized(args: string[]): Promise<unknown> {
    if (!this.socket || this.socket.destroyed) {
      return Promise.reject(new Error('Redis socket is not open'));
    }

    const encoded = this.encodeRespCommand(args);
    return new Promise((resolve, reject) => {
      let finished = false;
      const timer = setTimeout(() => {
        if (finished) return;
        finished = true;
        // Destroy socket on command timeout so RESP response queue can never drift out of order
        this.socket?.destroy(new Error('Redis command timeout'));
        reject(new Error('Redis command timeout'));
      }, 2000);

      this.queue.push({
        resolve: (val) => {
          if (finished) return;
          finished = true;
          clearTimeout(timer);
          resolve(val);
        },
        reject: (err) => {
          if (finished) return;
          finished = true;
          clearTimeout(timer);
          reject(err);
        },
      });

      this.socket!.write(encoded);
    });
  }

  private encodeRespCommand(args: string[]): Buffer {
    const parts: Buffer[] = [Buffer.from(`*${args.length}\r\n`, 'utf8')];
    for (const arg of args) {
      const payload = Buffer.from(arg, 'utf8');
      parts.push(Buffer.from(`$${payload.length}\r\n`, 'utf8'), payload, Buffer.from('\r\n', 'utf8'));
    }
    return Buffer.concat(parts);
  }

  private handleData(chunk: Buffer): void {
    this.buffer = Buffer.concat([this.buffer, chunk]);

    while (this.queue.length > 0 && this.buffer.length > 0) {
      const parsed = this.tryParseResp(0);
      if (!parsed) break;

      this.buffer = this.buffer.subarray(parsed.nextOffset);
      const pending = this.queue.shift()!;
      if (parsed.error) {
        pending.reject(new Error(parsed.error));
      } else {
        pending.resolve(parsed.value);
      }
    }
  }

  private tryParseResp(offset: number): { value?: unknown; error?: string; nextOffset: number } | null {
    if (offset >= this.buffer.length) return null;

    const lineEnd = this.buffer.indexOf('\r\n', offset);
    if (lineEnd === -1) return null;

    const prefix = String.fromCharCode(this.buffer[offset]);
    const line = this.buffer.subarray(offset + 1, lineEnd).toString('utf8');
    const nextOffset = lineEnd + 2;

    switch (prefix) {
      case '+':
        return { value: line, nextOffset };
      case '-':
        return { error: line, nextOffset };
      case ':':
        return { value: parseInt(line, 10), nextOffset };
      case '$': {
        const len = parseInt(line, 10);
        if (len === -1) return { value: null, nextOffset };
        if (this.buffer.length < nextOffset + len + 2) return null;
        const val = this.buffer.subarray(nextOffset, nextOffset + len).toString('utf8');
        return { value: val, nextOffset: nextOffset + len + 2 };
      }
      case '*': {
        const count = parseInt(line, 10);
        if (count === -1) return { value: null, nextOffset };
        const items: unknown[] = [];
        let cursor = nextOffset;
        for (let i = 0; i < count; i++) {
          const item = this.tryParseResp(cursor);
          if (!item) return null;
          if (item.error) return { error: item.error, nextOffset: item.nextOffset };
          items.push(item.value);
          cursor = item.nextOffset;
        }
        return { value: items, nextOffset: cursor };
      }
      default:
        return { error: `Unexpected RESP prefix: ${prefix}`, nextOffset };
    }
  }

  private flushQueueWithError(err: Error): void {
    while (this.queue.length > 0) {
      this.queue.shift()!.reject(err);
    }
    this.buffer = Buffer.alloc(0);
  }
}
