import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client (do NOT expose service role key to browser)
export function serverSupabase() {
  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  })
}

export async function uploadToBucket(params: {
  bucket: string
  path: string
  file: File
  contentType?: string
}): Promise<string> {
  const { bucket, path, file, contentType } = params
  const supabase = serverSupabase()
  const arrayBuffer = await file.arrayBuffer()
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, arrayBuffer, { contentType: contentType ?? file.type, upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
