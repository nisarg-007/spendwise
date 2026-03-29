// src/supabaseClient.js
// ─────────────────────────────────────────────────────────────
// Reads keys from .env.local (never commit that file to git)
// Supabase Dashboard → Settings → Data API
// ─────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,      // keeps user logged in across refreshes
      autoRefreshToken: true,
    },
  }
);
