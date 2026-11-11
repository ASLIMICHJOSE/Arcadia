/**
 * Arcadia Supabase Client Configuration
 * PostgREST queries from the browser are strictly limited to explicit public read-only views/tables.
 * Private auth & player progression tables are locked behind RLS and accessed only via the NestJS backend.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const ALLOWED_PUBLIC_TABLES = new Set<string>([
  'public_leaderboard',
  'public_games',
  'public_tournaments',
]);

export const isSupabaseConfigured = () => {
  return Boolean(
    SUPABASE_URL &&
      SUPABASE_ANON_KEY &&
      !SUPABASE_URL.includes('[YOUR-PROJECT-REF]') &&
      !SUPABASE_ANON_KEY.includes('[YOUR-SUPABASE-ANON-KEY]'),
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
 * Restricted read-only REST query helper for public Supabase PostgREST views.
 */
export async function supabaseRestQuery<T = unknown>(
  table: string,
  options: {
    select?: string;
    filters?: Record<string, string>;
  } = {},
): Promise<T> {
  if (!ALLOWED_PUBLIC_TABLES.has(table)) {
    throw new Error(
      `Direct browser PostgREST access to "${table}" is blocked by Arcadia security policy. Use the authenticated backend /api endpoints instead.`,
    );
  }

  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured yet. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }

  const { select = '*', filters = {} } = options;
  const params = new URLSearchParams({ select, ...filters });
  const url = `${SUPABASE_URL}/rest/v1/${encodeURIComponent(table)}?${params.toString()}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Supabase REST query failed on view ${table}`);
  }

  return res.json();
}
