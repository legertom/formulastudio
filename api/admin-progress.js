import { requireAdmin } from '../api-lib/supabaseAdmin.js';

const sortByProgress = (a, b) => {
    if (b.completedSteps !== a.completedSteps) {
        return b.completedSteps - a.completedSteps;
    }
    if (a.email && b.email) {
        return a.email.localeCompare(b.email);
    }
    return 0;
};

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const adminCheck = await requireAdmin(req);
        if (!adminCheck.ok) {
            return res.status(adminCheck.status).json({ error: adminCheck.error });
        }

        const { client } = adminCheck;
        const courseSlug = String(req.query.courseSlug || 'formula-studio-core');

        const [profilesResult, progressResult] = await Promise.all([
            client.from('profiles').select('id,email,role,created_at'),
            client
                .from('step_progress')
                .select('user_id,step_id,completed_at,course_slug')
                .eq('course_slug', courseSlug)
                .order('completed_at', { ascending: false })
        ]);

        if (profilesResult.error) {
            throw profilesResult.error;
        }
        if (progressResult.error) {
            throw progressResult.error;
        }

        const progressByUserId = new Map();

        for (const row of progressResult.data || []) {
            const key = row.user_id;
            const entry = progressByUserId.get(key) || {
                completedSteps: 0,
                lastCompletedStepId: null,
                lastCompletedAt: null
            };

            entry.completedSteps += 1;
            if (!entry.lastCompletedAt || row.completed_at > entry.lastCompletedAt) {
                entry.lastCompletedAt = row.completed_at;
                entry.lastCompletedStepId = row.step_id;
            }

            progressByUserId.set(key, entry);
        }

        const users = (profilesResult.data || []).map((profile) => {
            const progress = progressByUserId.get(profile.id) || {
                completedSteps: 0,
                lastCompletedStepId: null,
                lastCompletedAt: null
            };

            return {
                userId: profile.id,
                email: profile.email,
                role: profile.role,
                createdAt: profile.created_at,
                completedSteps: progress.completedSteps,
                lastCompletedStepId: progress.lastCompletedStepId,
                lastCompletedAt: progress.lastCompletedAt
            };
        });

        users.sort(sortByProgress);

        return res.status(200).json({ users, courseSlug });
    } catch (error) {
        console.error('admin-progress error:', error);
        return res.status(500).json({ error: 'Failed to load progress data.' });
    }
}
