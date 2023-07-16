import { supabase } from "@/config/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export async function uploadImage(file: File): Promise<string> {
  const fileExtension = file.name.split(".").pop();
  const filename = `${uuidv4()}.${fileExtension}`;

  const { data, error } = await supabase.storage
    .from("profile-images")
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return data.path;
}
