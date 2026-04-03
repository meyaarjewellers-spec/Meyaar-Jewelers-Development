import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Add these to your client/.env.local:
// VITE_SUPABASE_URL=your_supabase_url
// VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;
let authAvailable = false;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    authAvailable = true;
    console.log('✅ Supabase initialized successfully');
  } catch (error) {
    console.warn('⚠️ Supabase initialization error:', error);
    authAvailable = false;
  }
} else {
  console.warn('⚠️ Supabase credentials not found in .env.local');
  console.warn('📝 Add these to your .env.local:');
  console.warn('   VITE_SUPABASE_URL=your_url');
  console.warn('   VITE_SUPABASE_ANON_KEY=your_key');
  authAvailable = false;
}

export { supabase, authAvailable };
