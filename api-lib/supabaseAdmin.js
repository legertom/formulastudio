import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const adminEmails = new Set(
    (process.env.ADMIN_EMAILS || 'tom.leger@clever.com')
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
);

let supabaseAdmin = null;

if (supabaseUrl && serviceRoleKey) {
    supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

export const getSupabaseAdmin = () => {
    if (!supabaseAdmin) {
        throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
    }
    return supabaseAdmin;
};

export const getBearerToken = (req) => {
    const header = req.headers.authorization || req.headers.Authorization || '';
    if (!header.startsWith('Bearer ')) {
        return '';
    }
    return header.slice(7);
};

export const requireAdmin = async (req) => {
    const client = getSupabaseAdmin();
    const token = getBearerToken(req);

    if (!token) {
        return { ok: false, status: 401, error: 'Missing Authorization token.' };
    }

    const { data, error } = await client.auth.getUser(token);

    if (error || !data?.user) {
        return { ok: false, status: 401, error: 'Invalid or expired session token.' };
    }

    const user = data.user;
    const email = (user.email || '').toLowerCase();

    if (adminEmails.has(email)) {
        return { ok: true, user, client };
    }

    const { data: profile, error: profileError } = await client
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

    if (!profileError && profile?.role === 'admin') {
        return { ok: true, user, client };
    }

    return { ok: false, status: 403, error: 'Admin access required.' };
};

