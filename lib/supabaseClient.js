// lib/supabaseClient.js
// Lightweight helpers for client and server usage of Supabase.
// Note: Server-side code must use SUPABASE_SERVICE_ROLE_KEY (keep it secret).

const { createClient } = require('@supabase/supabase-js');

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error('Missing NEXT_PUBLIC_SUPABASE_* env vars');
  return createClient(url, anon);
}

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY env var');
  return createClient(url, service);
}

module.exports = { getSupabaseClient, getSupabaseServer };