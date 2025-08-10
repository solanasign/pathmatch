import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .upload(path, file);

  if (error) throw error;
  return data;
};

export const getFileUrl = (bucket: string, path: string) => {
  return supabase
    .storage
    .from(bucket)
    .getPublicUrl(path).data.publicUrl;
};