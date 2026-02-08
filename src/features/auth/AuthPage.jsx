import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthPage.css';

const AuthPage = () => {
    const {
        user,
        loading,
        authError,
        isSupabaseConfigured,
        signInWithGoogle,
        signInWithMagicLink
    } = useAuth();

    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    if (loading) {
        return (
            <div className="auth-page">
                <div className="auth-card">Loading auth...</div>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/training" replace />;
    }

    if (!isSupabaseConfigured) {
        return (
            <div className="auth-page">
                <div className="auth-card">
                    <h1>Authentication Unavailable</h1>
                    <p>Supabase environment variables are not configured yet.</p>
                </div>
            </div>
        );
    }

    const handleMagicLink = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');
        setIsSubmitting(true);

        try {
            await signInWithMagicLink(email);
            setMessage('Check your email for a sign-in link.');
            setEmail('');
        } catch (submitError) {
            setError(submitError?.message || 'Unable to send magic link.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogle = async () => {
        setMessage('');
        setError('');
        setIsSubmitting(true);
        try {
            await signInWithGoogle();
        } catch (googleError) {
            setError(googleError?.message || 'Google sign-in failed.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Sign In</h1>
                <p className="auth-copy">
                    Start training as a guest, then sign in anytime to save progress across devices.
                </p>

                <button
                    type="button"
                    className="auth-google-btn"
                    onClick={handleGoogle}
                    disabled={isSubmitting}
                >
                    Continue with Google
                </button>

                <div className="auth-divider">or</div>

                <form onSubmit={handleMagicLink} className="auth-form">
                    <label htmlFor="email">Work Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@clever.com"
                        autoComplete="email"
                        required
                    />
                    <button type="submit" disabled={isSubmitting}>
                        Send Magic Link
                    </button>
                </form>

                {(error || authError) && (
                    <p className="auth-error">{error || authError}</p>
                )}

                {message && <p className="auth-success">{message}</p>}
            </div>
        </div>
    );
};

export default AuthPage;

