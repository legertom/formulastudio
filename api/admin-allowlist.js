import { requireAdmin } from '../api-lib/supabaseAdmin.js';

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

export default async function handler(req, res) {
    try {
        const adminCheck = await requireAdmin(req);
        if (!adminCheck.ok) {
            return res.status(adminCheck.status).json({ error: adminCheck.error });
        }

        const { client } = adminCheck;

        if (req.method === 'GET') {
            const { data, error } = await client
                .from('signup_allowlist')
                .select('email,created_at')
                .order('email', { ascending: true });

            if (error) {
                throw error;
            }

            return res.status(200).json({ allowlist: data || [] });
        }

        if (req.method === 'POST') {
            const email = normalizeEmail(req.body?.email);
            if (!isValidEmail(email)) {
                return res.status(400).json({ error: 'Invalid email.' });
            }

            const { error } = await client
                .from('signup_allowlist')
                .upsert([{ email }], { onConflict: 'email' });

            if (error) {
                throw error;
            }

            return res.status(200).json({ success: true });
        }

        if (req.method === 'DELETE') {
            const email = normalizeEmail(req.query?.email);
            if (!isValidEmail(email)) {
                return res.status(400).json({ error: 'Invalid email.' });
            }

            const { error } = await client
                .from('signup_allowlist')
                .delete()
                .eq('email', email);

            if (error) {
                throw error;
            }

            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('admin-allowlist error:', error);
        return res.status(500).json({ error: 'Failed to manage allowlist.' });
    }
}
