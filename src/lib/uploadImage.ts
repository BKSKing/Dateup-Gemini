import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function uploadNoticeImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `notice-images/${fileName}`;

  const { data, error } = await supabase.storage
    .from('notices') // Bucket ka naam
    .upload(filePath, file);

  if (error) throw error;

  // Image ka public URL nikalna
  const { data: urlData } = supabase.storage.from('notices').getPublicUrl(filePath);
  return urlData.publicUrl;
}