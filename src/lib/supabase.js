import { createClient } from '@supabase/supabase-js'

// ── REPLACE THESE WITH YOUR SUPABASE PROJECT VALUES ──────────────────────────
const SUPABASE_URL = 'https://npiyvnlgkkbgogshwqhl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5waXl2bmxna2tiZ29nc2h3cWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2Mzc3ODIsImV4cCI6MjA4OTIxMzc4Mn0.alEeiRtjbL4sFMQ2dOyMIX47HHU5Jry4tCM4sKX_KsE'
// ─────────────────────────────────────────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

export const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  })

export const signOut = () => supabase.auth.signOut()
