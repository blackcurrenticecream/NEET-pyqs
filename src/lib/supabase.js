import { createClient } from '@supabase/supabase-js'

// ── REPLACE THESE WITH YOUR SUPABASE PROJECT VALUES ──────────────────────────
const SUPABASE_URL  = 'https://YOUR_PROJECT_ID.supabase.co'
const SUPABASE_ANON = 'YOUR_ANON_PUBLIC_KEY'
// ─────────────────────────────────────────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

export const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  })

export const signOut = () => supabase.auth.signOut()
