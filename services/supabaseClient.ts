
import { createClient } from '@supabase/supabase-js';

// Assume these are set in a .env file for a real project
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn("Supabase URL or Anon Key is not set. Supabase client will not be initialized.");
}

export { supabase };
