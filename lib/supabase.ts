// lib/supabase.ts

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Client-side supabase (public anon key)
export const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Server-side helper using service role (for webhooks and trusted server operations)
export const supabaseAdmin = createSupabaseClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE || ''
);
