import { buildIdmInstructionsMarkdown } from '../api-lib/idmInstructions.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const markdown = buildIdmInstructionsMarkdown();
    const shouldDownload = String(req.query?.download || '').toLowerCase();

    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');

    if (shouldDownload === '1' || shouldDownload === 'true' || shouldDownload === 'yes') {
        res.setHeader('Content-Disposition', 'attachment; filename="idm-llm-instructions.md"');
    }

    return res.status(200).send(markdown);
}
