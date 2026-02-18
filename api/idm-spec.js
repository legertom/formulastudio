import { IDM_SPEC } from '../api-lib/idmSpec.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    return res.status(200).json(IDM_SPEC);
}
