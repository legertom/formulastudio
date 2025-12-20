import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav className="main-nav">
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
                    Full Docs
                </NavLink>
            </div>
        </nav>
    );
};

export default NavBar;
