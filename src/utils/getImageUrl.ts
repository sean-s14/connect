import { supabase } from "@/config/supabaseClient";

/**
 * Returns the image supabase url if the image is not a url
 */
export default function getImageUrl(image: string) {
  if (image && !image.startsWith("http")) {
    const { data } = supabase.storage
      .from("profile-images")
      .getPublicUrl(image);
    return data.publicUrl;
  }
  return image;
}
