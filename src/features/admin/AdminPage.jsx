import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CURRICULUM } from '../../lib/curriculum';
import './AdminPage.css';

const COURSE_SLUG = 'formula-studio-core';

const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString();
};

const normalizeEmail = (value) => value.trim().toLowerCase();
const parseJsonSafe = (value) => {
    if (!value) return null;
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
};
const getResponseError = async (response, fallbackMessage) => {
    const raw = await response.text();
    const parsed = parseJsonSafe(raw);
    return parsed?.error || parsed?.message || raw || fallbackMessage;
};

const AdminPage = () => {
    const { session, user, isAdmin, loading, isSupabaseConfigured } = useAuth();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [allowlist, setAllowlist] = useState([]);
    const [newAllowEmail, setNewAllowEmail] = useState('');
    const [isSavingAllowlist, setIsSavingAllowlist] = useState(false);
    const [savingRoleUserId, setSavingRoleUserId] = useState('');

    const totalSteps = useMemo(
        () => CURRICULUM.reduce((sum, chapter) => sum + chapter.steps.length, 0),
        []
    );

    const authHeaders = useMemo(() => {
        const token = session?.access_token;
        if (!token) return {};
        return {
            Authorization: `Bearer ${token}`
        };
    }, [session?.access_token]);

    const loadAdminData = useCallback(async () => {
        if (!session?.access_token) {
            setIsLoadingData(false);
            return;
        }

        setIsLoadingData(true);
        setError('');

        try {
            const [progressResponse, allowlistResponse] = await Promise.all([
                fetch(`/api/admin-progress?courseSlug=${encodeURIComponent(COURSE_SLUG)}`, { headers: authHeaders }),
                fetch('/api/admin-allowlist', { headers: authHeaders })
            ]);

            if (!progressResponse.ok) {
                throw new Error(await getResponseError(progressResponse, 'Failed to load progress data.'));
            }
            if (!allowlistResponse.ok) {
                throw new Error(await getResponseError(allowlistResponse, 'Failed to load allowlist.'));
            }

            const progressPayload = await progressResponse.json();
            const allowlistPayload = await allowlistResponse.json();

            setUsers(progressPayload.users || []);
            setAllowlist(allowlistPayload.allowlist || []);
        } catch (loadError) {
            console.error('Failed to load admin data:', loadError);
            setError(loadError?.message || 'Failed to load admin data.');
        } finally {
            setIsLoadingData(false);
        }
    }, [authHeaders, session?.access_token]);

    useEffect(() => {
        void loadAdminData();
    }, [loadAdminData]);

    const handleAllowlistAdd = async (event) => {
        event.preventDefault();

        const email = normalizeEmail(newAllowEmail);
        if (!email) return;

        setIsSavingAllowlist(true);
        setError('');

        try {
            const response = await fetch('/api/admin-allowlist', {
                method: 'POST',
                headers: {
                    ...authHeaders,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error(await getResponseError(response, 'Failed to add allowlisted email.'));
            }

            setNewAllowEmail('');
            await loadAdminData();
        } catch (addError) {
            console.error('Failed to add allowlisted email:', addError);
            setError(addError?.message || 'Failed to add allowlisted email.');
        } finally {
            setIsSavingAllowlist(false);
        }
    };

    const handleAllowlistRemove = async (email) => {
        setIsSavingAllowlist(true);
        setError('');

        try {
            const response = await fetch(`/api/admin-allowlist?email=${encodeURIComponent(email)}`, {
                method: 'DELETE',
                headers: authHeaders
            });

            if (!response.ok) {
                throw new Error(await getResponseError(response, 'Failed to remove allowlisted email.'));
            }

            await loadAdminData();
        } catch (removeError) {
            console.error('Failed to remove allowlisted email:', removeError);
            setError(removeError?.message || 'Failed to remove allowlisted email.');
        } finally {
            setIsSavingAllowlist(false);
        }
    };

    const handleRoleChange = async (entry, nextRole) => {
        if (!entry?.userId || !nextRole) return;

        setSavingRoleUserId(entry.userId);
        setError('');

        try {
            const response = await fetch('/api/admin-user-role', {
                method: 'POST',
                headers: {
                    ...authHeaders,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: entry.userId,
                    role: nextRole
                })
            });

            if (!response.ok) {
                throw new Error(await getResponseError(response, 'Failed to update user role.'));
            }

            setUsers((previous) =>
                previous.map((row) =>
                    row.userId === entry.userId
                        ? {
                            ...row,
                            role: nextRole
                        }
                        : row
                )
            );
        } catch (roleError) {
            console.error('Failed to update user role:', roleError);
            setError(roleError?.message || 'Failed to update user role.');
        } finally {
            setSavingRoleUserId('');
        }
    };

    if (loading) {
        return <div className="admin-page">Loading admin access...</div>;
    }

    if (!isSupabaseConfigured) {
        return (
            <div className="admin-page">
                <div className="admin-panel">Supabase is not configured.</div>
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/training" replace />;
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Training Admin</h1>
                <button type="button" onClick={() => void loadAdminData()} disabled={isLoadingData}>
                    Refresh
                </button>
            </div>

            {error && <div className="admin-error">{error}</div>}

            <section className="admin-panel">
                <h2>Allowlisted Emails</h2>
                <p>Use this for non-@clever.com accounts that should be allowed to sign up.</p>

                <form onSubmit={handleAllowlistAdd} className="admin-inline-form">
                    <input
                        type="email"
                        value={newAllowEmail}
                        onChange={(event) => setNewAllowEmail(event.target.value)}
                        placeholder="person@example.com"
                        required
                    />
                    <button type="submit" disabled={isSavingAllowlist}>
                        Add
                    </button>
                </form>

                <div className="admin-chip-list">
                    {allowlist.length === 0 && <span className="admin-muted">No manual allowlist entries.</span>}
                    {allowlist.map((entry) => (
                        <div key={entry.email} className="admin-chip">
                            <span>{entry.email}</span>
                            <button
                                type="button"
                                onClick={() => void handleAllowlistRemove(entry.email)}
                                disabled={isSavingAllowlist}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="admin-panel">
                <h2>User Progress</h2>
                <p>
                    {users.length} users tracked. Total curriculum steps: {totalSteps}.
                </p>

                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Completed</th>
                                <th>Progress</th>
                                <th>Last Step</th>
                                <th>Last Activity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((entry) => {
                                const completed = entry.completedSteps || 0;
                                const percent = totalSteps > 0 ? Math.round((completed / totalSteps) * 100) : 0;
                                const isCurrentUser = entry.userId === user?.id;
                                const isUpdatingRole = savingRoleUserId === entry.userId;
                                const isAdminRole = entry.role === 'admin';
                                const targetRole = isAdminRole ? 'member' : 'admin';
                                const actionLabel = isAdminRole ? 'Make member' : 'Make admin';

                                return (
                                    <tr key={entry.userId}>
                                        <td>{entry.email || 'Unknown'}</td>
                                        <td>{entry.role || 'member'}</td>
                                        <td>
                                            {completed}/{totalSteps}
                                        </td>
                                        <td>{percent}%</td>
                                        <td>{entry.lastCompletedStepId || '—'}</td>
                                        <td>{formatDate(entry.lastCompletedAt)}</td>
                                        <td>
                                            <div className="admin-role-actions">
                                                <button
                                                    type="button"
                                                    className="admin-role-btn"
                                                    onClick={() => void handleRoleChange(entry, targetRole)}
                                                    disabled={isUpdatingRole || isCurrentUser}
                                                    title={
                                                        isCurrentUser
                                                            ? 'You cannot change your own role here.'
                                                            : undefined
                                                    }
                                                >
                                                    {isUpdatingRole ? 'Saving...' : actionLabel}
                                                </button>
                                                {isCurrentUser && (
                                                    <span className="admin-muted admin-you-label">You</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="admin-muted">
                                        No user records yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AdminPage;
