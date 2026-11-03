/**
 * Arcadia Supabase Client Configuration
 * Connects directly to Supabase PostgreSQL / PostgREST endpoints & Realtime.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('[YOUR-PROJECT-REF]')
  );
};

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const getSupabaseConfig = (): SupabaseConfig => ({
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
});

/**
 * Direct REST query helper for Supabase PostgREST endpoints
 */
export async function supabaseRestQuery<T = any>(
  table: string,
  options: {
    select?: string;
    filters?: Record<string, string>;
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: any;
  } = {}
): Promise<T> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured yet. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  const { select = '*', filters = {}, method = 'GET', body } = options;
  const params = new URLSearchParams({ select, ...filters });
  const url = `${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`;

  const res = await fetch(url, {
    method,
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Supabase REST query failed on table ${table}`);
  }

  return res.json();
}

