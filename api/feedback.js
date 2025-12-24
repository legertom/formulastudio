export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { feedback, screenshot, location } = req.body;
        const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

        if (!DISCORD_WEBHOOK_URL) {
            console.error('Missing DISCORD_WEBHOOK_URL');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // 1. Prepare the payload boundary
        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

        // 2. Decode the Base64 screenshot (remove data:image/png;base64, prefix)
        const base64Data = screenshot.replace(/^data:image\/png;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // 3. Construct the multipart body manually (to avoid adding more dependencies like 'form-data' if possible, though 'form-data' or 'busboy' is safer for complex apps. 
        // For a simple Vercel function, using 'fetch' with FormData from 'undici' (built-in in Node 18+) or constructing manually is common.
        // Let's use the standard fetch API which is available in Node 18+ Vercel environments.

        const formData = new FormData();

        // Add Message Content
        formData.append('content', `**Feedback Report**\n**Location:** ${location}\n**Message:** ${feedback}`);

        // Add File
        // We need to pass a Blob-like object. 
        // In Node environment, we can construct a Blob from the buffer.
        const blob = new Blob([imageBuffer], { type: 'image/png' });
        formData.append('file', blob, 'screenshot.png');

        // 4. Send to Discord
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('Discord API Error:', text);
            throw new Error(`Discord API responded with ${response.status}: ${text}`);
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Feedback Handler Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
