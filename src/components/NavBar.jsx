import React from 'react';

const NavBar = ({ currentView, onViewChange }) => {
    return (
        <nav className="main-nav">
            <div className="nav-brand">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-logo">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="brand-name">FormulaStudio</span>
            </div>

            <div className="nav-links">
                <button
                    className={`nav-item ${currentView === 'editor' ? 'active' : ''}`}
                    onClick={() => onViewChange('editor')}
                >
                    Editor
                </button>
                <button
                    className={`nav-item ${currentView === 'training' ? 'active' : ''}`}
                    onClick={() => onViewChange('training')}
                >
                    Training
                </button>
                <button
                    className={`nav-item ${currentView === 'docs' ? 'active' : ''}`}
                    onClick={() => onViewChange('docs')}
                >
                    Full Docs
                </button>
            </div>
        </nav>
    );
};

export default NavBar;
