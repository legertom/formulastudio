import { getSupabaseAdmin } from '../api-lib/supabaseAdmin.js';

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const rawEmail = String(req.query.email || '');
    const email = rawEmail.trim().toLowerCase();

    if (!isValidEmail(email)) {
        return res.status(400).json({ allowed: false, error: 'Invalid email.' });
    }

    if (email.endsWith('@clever.com')) {
        return res.status(200).json({ allowed: true });
    }

    try {
        const supabaseAdmin = getSupabaseAdmin();
        const { data, error } = await supabaseAdmin
            .from('signup_allowlist')
            .select('email')
            .eq('email', email)
            .maybeSingle();

        if (error) {
            // If table is missing, default to strict denial.
            if (error.code === '42P01') {
                return res.status(200).json({ allowed: false });
            }

            throw error;
        }

        return res.status(200).json({ allowed: Boolean(data) });
    } catch (error) {
        console.error('auth-email-allowed error:', error);
        return res.status(500).json({ allowed: false, error: 'Unable to validate email.' });
    }
}
