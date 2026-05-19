import { createClient, SupabaseClient } from '@supabase/supabase-js'

function makeClient(url: string, key: string): SupabaseClient | null {
  if (!url || !key) return null
  return createClient(url, key)
}

// Client-side (anon key) — used in admin page and client components
// Returns null when env vars are not yet configured
const _supabase = makeClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
)

// We cast to SupabaseClient so callers don't have to null-check everywhere;
// queries will simply return errors if the client is misconfigured.
export const supabase = (_supabase ?? createClient('http://localhost', 'placeholder')) as SupabaseClient

// Server-side (service role key) — bypasses RLS, used in API routes / webhooks
export function createServiceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}
