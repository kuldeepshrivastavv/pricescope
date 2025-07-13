import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase project URL and anon/public key
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-public-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
