import { createClient } from "@supabase/supabase-js";

let supabase = null;

export function getSupabase() {
  if (supabase) return supabase;
  supabase = createClient(
    "https://sflruygvehgijvphdtvm.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbHJ1eWd2ZWhnaWp2cGhkdHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MzU4MTEsImV4cCI6MjA5MDIxMTgxMX0.5ZI8OKHkgqTcgrD5ew23kBhDa8jFwFpBi5i2jufJl70"
  );
  return supabase;
}
