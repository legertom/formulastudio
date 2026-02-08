import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient';

const normalizeErrorText = (value) => {
    if (!value) return '';
    return decodeURIComponent(value).replace(/\+/g, ' ');
};

const readHashParams = () => {
    const fragment = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash;
    return new URLSearchParams(fragment);
};

const AuthCallbackPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const completeSignIn = async () => {
            if (!isSupabaseConfigured || !supabase) {
                navigate('/training', { replace: true });
                return;
            }

            try {
                const url = new URL(window.location.href);
                const code = url.searchParams.get('code');
                const hashParams = readHashParams();
                const oauthError =
                    url.searchParams.get('error_description') ||
                    url.searchParams.get('error') ||
                    hashParams.get('error_description') ||
                    hashParams.get('error');

                if (oauthError) {
                    throw new Error(normalizeErrorText(oauthError));
                }

                if (code) {
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
                        code
                    );
                    if (exchangeError) {
                        throw exchangeError;
                    }
                }

                const {
                    data: { session }
                } = await supabase.auth.getSession();
                let nextSession = session;

                if (!nextSession) {
                    const accessToken = hashParams.get('access_token');
                    const refreshToken = hashParams.get('refresh_token');

                    if (accessToken && refreshToken) {
                        const { data: sessionData, error: setSessionError } =
                            await supabase.auth.setSession({
                                access_token: accessToken,
                                refresh_token: refreshToken
                            });

                        if (setSessionError) {
                            throw setSessionError;
                        }

                        nextSession = sessionData?.session || null;
                    }
                }

                if (!cancelled) {
                    navigate(nextSession ? '/training' : '/auth', { replace: true });
                }
            } catch (callbackError) {
                console.error('Auth callback failed:', callbackError);
                if (!cancelled) {
                    setError(callbackError?.message || 'Unable to finish sign-in.');
                }
            }
        };

        void completeSignIn();

        return () => {
            cancelled = true;
        };
    }, [navigate]);

    if (error) {
        return (
            <div style={{ padding: '2rem' }}>
                <h2>Sign-in Failed</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Signing you in...</h2>
        </div>
    );
};

export default AuthCallbackPage;
