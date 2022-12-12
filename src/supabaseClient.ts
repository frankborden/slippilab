import { createClient } from "@supabase/supabase-js";
// @ts-ignore: zoo-ids doesn't ship it's types apparently
import { generateId } from "zoo-ids";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function downloadReplay(
  name: string
): Promise<{ data: Blob | null; error: Error | null }> {
  return await supabase.storage.from("replays").download(`${name}.slp`);
}

export async function uploadReplay(file: File): Promise<{
  id: string;
  data: { path: string } | null;
  error: Error | null;
}> {
  const id = generateId();
  // TODO: check if a duplicate id has been generated
  const { data, error } = await supabase.storage
    .from("replays")
    .upload(`${id}.slp`, file);
  return {
    id,
    data,
    error,
  };
}

export async function loadFromSupabase(
  id: string,
  load: (files: File[]) => Promise<void>
): Promise<void> {
  const { data, error } = await downloadReplay(id);
  if (data != null) {
    const file = new File([data], `${id}.slp`);
    return await load([file]);
  }
  if (error != null) {
    console.error("Error: could not load replay", error);
  }
}
