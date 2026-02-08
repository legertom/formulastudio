import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const DEFAULT_ADMIN_EMAILS = ['tom.leger@clever.com'];

const AuthContext = createContext(null);

const parseAdminEmails = () => {
    const fromEnv = (import.meta.env.VITE_ADMIN_EMAILS || '')
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);

    return new Set([...DEFAULT_ADMIN_EMAILS, ...fromEnv]);
};

const isMissingProfilesTable = (error) => error?.code === '42P01';

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState('');

    const adminEmails = useMemo(() => parseAdminEmails(), []);

    const ensureProfile = useCallback(async (nextUser) => {
        if (!supabase || !nextUser) return null;

        const normalizedEmail = (nextUser.email || '').trim().toLowerCase();

        const { data: existingProfile, error: selectError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', nextUser.id)
            .maybeSingle();

        if (selectError) {
            if (isMissingProfilesTable(selectError)) {
                return {
                    id: nextUser.id,
                    email: normalizedEmail,
                    role: adminEmails.has(normalizedEmail) ? 'admin' : 'member'
                };
            }
            throw selectError;
        }

        if (existingProfile) {
            return existingProfile;
        }

        const seedRole = adminEmails.has(normalizedEmail) ? 'admin' : 'member';
        const { data: insertedProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
                id: nextUser.id,
                email: normalizedEmail,
                role: seedRole
            })
            .select('*')
            .single();

        if (insertError) {
            if (isMissingProfilesTable(insertError)) {
                return {
                    id: nextUser.id,
                    email: normalizedEmail,
                    role: seedRole
                };
            }

            // Retry read in case a trigger inserted the row first.
            if (insertError.code === '23505') {
                const { data: racedProfile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', nextUser.id)
                    .maybeSingle();
                return racedProfile || null;
            }
            throw insertError;
        }

        return insertedProfile;
    }, [adminEmails]);

    const hydrateSession = useCallback(async (nextSession) => {
        setSession(nextSession || null);
        const nextUser = nextSession?.user || null;
        setUser(nextUser);

        if (!nextUser) {
            setProfile(null);
            return;
        }

        const ensuredProfile = await ensureProfile(nextUser);
        setProfile(ensuredProfile);
    }, [ensureProfile]);

    useEffect(() => {
        if (!isSupabaseConfigured || !supabase) {
            setLoading(false);
            return;
        }

        let cancelled = false;

        const initialize = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase.auth.getSession();
                if (error) {
                    throw error;
                }
                if (!cancelled) {
                    await hydrateSession(data.session);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                if (!cancelled) {
                    setAuthError(error?.message || 'Failed to initialize auth.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            void hydrateSession(nextSession).catch((error) => {
                console.error('Auth state change error:', error);
                setAuthError(error?.message || 'Failed to update auth session.');
            });
        });

        void initialize();

        return () => {
            cancelled = true;
            subscription?.unsubscribe();
        };
    }, [hydrateSession]);

    const signInWithGoogle = async () => {
        if (!supabase) throw new Error('Supabase is not configured.');

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    prompt: 'select_account'
                }
            }
        });

        if (error) {
            throw error;
        }
    };

    const checkEmailAllowed = async (email) => {
        const response = await fetch(`/api/auth-email-allowed?email=${encodeURIComponent(email)}`);
        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || 'Unable to validate email access.');
        }

        const payload = await response.json();
        return Boolean(payload.allowed);
    };

    const signInWithMagicLink = async (email) => {
        if (!supabase) throw new Error('Supabase is not configured.');

        const normalizedEmail = email.trim().toLowerCase();
        const allowed = await checkEmailAllowed(normalizedEmail);

        if (!allowed) {
            throw new Error('Only @clever.com or approved emails can create accounts.');
        }

        const { error } = await supabase.auth.signInWithOtp({
            email: normalizedEmail,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`
            }
        });

        if (error) {
            throw error;
        }
    };

    const signOut = async () => {
        if (!supabase) return;
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw error;
        }
    };

    const isAdmin = Boolean(
        (user?.email && adminEmails.has(user.email.toLowerCase())) || profile?.role === 'admin'
    );

    const value = {
        session,
        user,
        profile,
        loading,
        authError,
        isAdmin,
        isSupabaseConfigured,
        signInWithGoogle,
        signInWithMagicLink,
        signOut
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider.');
    }
    return context;
};
