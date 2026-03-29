// src/supabaseClient.js
// ─────────────────────────────────────────────────────────────
// Replace the two values below with your own from:
// Supabase Dashboard → Settings → Data API
// ─────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = 'https://YOUR_PROJECT_REF.supabase.co';   // ← paste yours
const SUPABASE_ANON = 'YOUR_ANON_KEY';                           // ← paste yours

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession: true,        // keeps user logged in across refreshes
    autoRefreshToken: true,
  },
});
