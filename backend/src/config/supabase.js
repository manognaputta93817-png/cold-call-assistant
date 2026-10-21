import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.warn(
        '⚠️  SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. Database operations will fail.'
    )
}

export const supabase = createClient(supabaseUrl || 'http://localhost', supabaseKey || 'placeholder', {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
})
