import { requireAdmin } from '../api-lib/supabaseAdmin.js';

const VALID_ROLES = new Set(['admin', 'member']);

const normalizeRole = (value) => String(value || '').trim().toLowerCase();

const isUuid = (value) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        String(value || '')
    );

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const adminCheck = await requireAdmin(req);
        if (!adminCheck.ok) {
            return res.status(adminCheck.status).json({ error: adminCheck.error });
        }

        const { client, user: actingUser } = adminCheck;
        const userId = String(req.body?.userId || '').trim();
        const role = normalizeRole(req.body?.role);

        if (!isUuid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID.' });
        }

        if (!VALID_ROLES.has(role)) {
            return res.status(400).json({ error: 'Invalid role.' });
        }

        if (userId === actingUser.id && role !== 'admin') {
            return res.status(400).json({ error: 'You cannot remove your own admin role.' });
        }

        const { data, error } = await client
            .from('profiles')
            .update({ role })
            .eq('id', userId)
            .select('id,email,role')
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            return res.status(404).json({ error: 'User profile not found.' });
        }

        return res.status(200).json({ success: true, user: data });
    } catch (error) {
        console.error('admin-user-role error:', error);
        return res.status(500).json({ error: 'Failed to update user role.' });
    }
}
