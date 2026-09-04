import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Database features will not work.');
}

// Force every request (browser and server) to bypass HTTP/Next.js fetch caching so
// site content edits made in the admin panel show up immediately instead of being
// served from a stale cached response.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
        fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }),
    },
});
