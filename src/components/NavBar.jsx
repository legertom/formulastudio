import React from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
    const { user, isAdmin, signOut, isSupabaseConfigured } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    };

    return (
        <nav className="main-nav">
            <div className="nav-left">
                <div className="nav-brand">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-logo">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className="brand-name">FormulaStudio</span>
                </div>

                <div className="nav-links">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        Editor
                    </NavLink>
                    <NavLink
                        to="/training"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        Training
                    </NavLink>
                    <NavLink
                        to="/docs"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        Documentation
                    </NavLink>
                    {isAdmin && (
                        <NavLink
                            to="/admin"
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            Admin
                        </NavLink>
                    )}
                </div>
            </div>

            <div className="nav-right">
                {isSupabaseConfigured && (
                    user ? (
                        <div className="auth-nav-group">
                            <NavLink
                                to="/account"
                                className={({ isActive }) => `nav-item auth-nav-signin ${isActive ? 'active' : ''}`}
                            >
                                Account
                            </NavLink>
                            <span className="auth-nav-user" title={user.email}>{user.email}</span>
                            <button type="button" className="auth-nav-btn" onClick={handleSignOut}>
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <NavLink
                            to="/auth"
                            className={({ isActive }) => `nav-item auth-nav-signin ${isActive ? 'active' : ''}`}
                        >
                            Sign In
                        </NavLink>
                    )
                )}
                <ThemeToggle />
            </div>
        </nav>
    );
};

export default NavBar;
