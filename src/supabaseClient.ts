import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function downloadReplay (
  name: string
): Promise<{ data: Blob | null, error: Error | null }> {
  return await supabase.storage.from('replays').download(`${name}.slp`)
}

export async function uploadReplay (file: File): Promise<{
  id: string
  data: { Key: string } | null
  error: Error | null
}> {
  const id = crypto.randomUUID()
  const { data, error } = await supabase.storage
    .from('replays')
    .upload(`${id}.slp`, file)
  return {
    id,
    data,
    error
  }
}
