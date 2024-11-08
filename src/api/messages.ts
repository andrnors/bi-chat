import { supabase } from "../supabase/supabaseClient";


export async function sendMessage(profileId: string, text: string) {
  if (!text) return;
  const { error } = await supabase
    .from("messages")
    .insert([{ profile_id: profileId, text, reaction: null }])
    .single();

  if (error) {
    console.error("Error sending message:", error);
  }
}