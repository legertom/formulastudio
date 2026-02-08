import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient';

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

                if (code) {
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
                        window.location.href
                    );
                    if (exchangeError) {
                        throw exchangeError;
                    }
                }

                if (!cancelled) {
                    navigate('/training', { replace: true });
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

