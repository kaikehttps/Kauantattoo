// Supabase configuration
// Temporarily disabled - configure your Supabase credentials in .env.local first
// import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key'

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabase = null // Temporarily disabled

// Storage bucket name
export const STORAGE_BUCKET = 'tattoo-images'

// Database table names
export const TABLES = {
  TATTOOS: 'tattoos',
  CATEGORIES: 'categories'
}