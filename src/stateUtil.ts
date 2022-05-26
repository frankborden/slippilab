import { load } from "./state";
import { downloadReplay } from "./supabaseClient";

export async function loadFromSupabase(id: string) {
  const { data, error } = await downloadReplay(id);
  if (data) {
    const file = new File([data], "download.slp");
    load([file], 0);
  }
  if (error) {
    console.error("Error: could not load replay", error);
  }
}
