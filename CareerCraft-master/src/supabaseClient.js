import { createClient } from '@supabase/supabase-js'

// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://hpzfnvdvctnerkgnqgsi.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwemZudmR2Y3RuZXJrZ25xZ3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTMyNTEsImV4cCI6MjA3ODc4OTI1MX0.BciJ-Zud5wn9JqfR7tf-of0C5033N8bp13ksqmpshR4"

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or anon key missing")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

