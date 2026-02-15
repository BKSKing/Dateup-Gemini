import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Agar variables nahi hain (build time par), toh dummy values ya null handle karein
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase env variables are missing in supabase.ts");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co", 
  supabaseAnonKey || "placeholder-key"
);