import { Profile } from "../../database.types";
import { AccountFormValues } from "../pages/Account/interfaces";
import { supabase } from "../supabase/supabaseClient";


export async function fetchProfile(profileId: string): Promise<Profile | null> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return profile;
}

export async function updateProfile(values: AccountFormValues, userId: string) {
  const updates = {
    id: userId,
    username: values.username,
    website: values.website,
    avatar_url: values.avatarUrl,
    updated_at: new Date(),
  };

  const { data, error } = await supabase.from("profiles").upsert(updates);
  return { data, error };
}
