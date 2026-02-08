import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CURRICULUM } from '../../lib/curriculum';
import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient';
import './AccountPage.css';

const COURSE_SLUG = 'formula-studio-core';

const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString();
};

const AccountPage = () => {
    const { user, profile, loading, isAdmin, signOut, isSupabaseConfigured: authConfigured } = useAuth();
    const [progressSummary, setProgressSummary] = useState({
        completed: 0,
        lastCompletedAt: null
    });
    const [isLoadingProgress, setIsLoadingProgress] = useState(true);
    const [error, setError] = useState('');

    const totalSteps = useMemo(
        () => CURRICULUM.reduce((sum, chapter) => sum + chapter.steps.length, 0),
        []
    );

    useEffect(() => {
        let cancelled = false;

        const loadProgress = async () => {
            if (!user?.id || !authConfigured || !isSupabaseConfigured || !supabase) {
                if (!cancelled) {
                    setIsLoadingProgress(false);
                }
                return;
            }

            setIsLoadingProgress(true);
            setError('');

            try {
                const { data, error: queryError } = await supabase
                    .from('step_progress')
                    .select('step_id,completed_at')
                    .eq('user_id', user.id)
                    .eq('course_slug', COURSE_SLUG);

                if (queryError) {
                    throw queryError;
                }

                let lastCompletedAt = null;
                for (const row of data || []) {
                    if (!lastCompletedAt || row.completed_at > lastCompletedAt) {
                        lastCompletedAt = row.completed_at;
                    }
                }

                if (!cancelled) {
                    setProgressSummary({
                        completed: (data || []).length,
                        lastCompletedAt
                    });
                }
            } catch (loadError) {
                console.error('Failed to load account progress summary:', loadError);
                if (!cancelled) {
                    setError(loadError?.message || 'Unable to load progress summary.');
                }
            } finally {
                if (!cancelled) {
                    setIsLoadingProgress(false);
                }
            }
        };

        void loadProgress();

        return () => {
            cancelled = true;
        };
    }, [authConfigured, user?.id]);

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (signOutError) {
            setError(signOutError?.message || 'Sign out failed.');
        }
    };

    if (loading) {
        return <div className="account-page">Loading account...</div>;
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    const percent = totalSteps > 0 ? Math.round((progressSummary.completed / totalSteps) * 100) : 0;

    return (
        <div className="account-page">
            <div className="account-card">
                <h1>Your Account</h1>
                <p className="account-subtitle">Manage sign-in details and view training progress.</p>

                <div className="account-grid">
                    <div className="account-row">
                        <span className="account-label">Email</span>
                        <span className="account-value">{user.email || '—'}</span>
                    </div>
                    <div className="account-row">
                        <span className="account-label">Role</span>
                        <span className="account-value">{profile?.role || (isAdmin ? 'admin' : 'member')}</span>
                    </div>
                    <div className="account-row">
                        <span className="account-label">Completed Steps</span>
                        <span className="account-value">
                            {isLoadingProgress ? 'Loading...' : `${progressSummary.completed}/${totalSteps} (${percent}%)`}
                        </span>
                    </div>
                    <div className="account-row">
                        <span className="account-label">Last Activity</span>
                        <span className="account-value">
                            {isLoadingProgress ? 'Loading...' : formatDate(progressSummary.lastCompletedAt)}
                        </span>
                    </div>
                </div>

                {error && <p className="account-error">{error}</p>}

                <div className="account-actions">
                    <Link to="/training" className="account-link-btn">
                        Back to Training
                    </Link>
                    {isAdmin && (
                        <Link to="/admin" className="account-link-btn">
                            Open Admin
                        </Link>
                    )}
                    <button type="button" onClick={handleSignOut}>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;

