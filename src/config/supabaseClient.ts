import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ANON_KEY;

if (!supabaseUrl)
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_PROJECT_URL");
if (!supabaseKey)
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_PROJECT_ANON_KEY");

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});
