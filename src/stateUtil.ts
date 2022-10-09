import { downloadReplay } from "~/supabaseClient";

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
