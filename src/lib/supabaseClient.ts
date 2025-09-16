import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kmqwqkoezyudpkzdirso.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttcXdxa29lenl1ZHBremRpcnNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNTAxOTUsImV4cCI6MjA3MzYyNjE5NX0._1uh9yP88k_ShsmMfKx6dHmh8_8bEUztPE75AiCB-hk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
