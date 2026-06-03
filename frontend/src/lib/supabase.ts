import { createClient } from '@supabase/supabase-js';

// Browser Supabase client (anon key only — constrained by Row-Level Security).
// Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;
let authAvailable = false;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    authAvailable = true;
  } catch {
    authAvailable = false;
  }
} else if (import.meta.env.DEV) {
  console.warn('Supabase not configured — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export { supabase, authAvailable };
