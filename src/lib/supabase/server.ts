import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase server environment variables');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === supabaseServiceRoleKey) {
    console.warn('⚠️ WARNING: SUPABASE_SERVICE_ROLE_KEY is identical to ANON_KEY. Admin actions will fail with RLS.');
} else {
    console.log('✅ Service Role Key seems distinct from Anon Key.');
}

console.log('🔑 Anon Key Prefix:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 5) + '...');
console.log('🔑 Service Key Prefix:', supabaseServiceRoleKey?.substring(0, 5) + '...');

export default supabaseAdmin;
