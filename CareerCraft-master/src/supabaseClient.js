import { createClient } from '@supabase/supabase-js'

// 🔴 Put your real values here:
const supabaseUrl = "https://hpzfnvdvctnerkgnqgsi.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwemZudmR2Y3RuZXJrZ25xZ3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTMyNTEsImV4cCI6MjA3ODc4OTI1MX0.BciJ-Zud5wn9JqfR7tf-of0C5033N8bp13ksqmpshR4"

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or anon key missing")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
