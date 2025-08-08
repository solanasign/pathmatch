import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/custom';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Test connection
supabase
  .from('profiles')
  .select('*')
  .limit(1)
  .then(({ error }) => {
    if (error) {
      console.error('Supabase connection error:', error.message);
    } else {
      console.log('Connected to Supabase successfully');
    }
  });