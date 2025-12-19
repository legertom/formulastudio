import React, { useState } from 'react';
import DocsFields from './docs/DocsFields';
import DocsOperations from './docs/DocsOperations';
import DocsComplex from './docs/DocsComplex';
import DocsIntro from './docs/DocsIntro';
import DocsSyntax from './docs/DocsSyntax';

const DocsLayout = ({ onClose }) => {
    const [activeSection, setActiveSection] = useState('intro');

    const renderContent = () => {
        switch (activeSection) {
            case 'intro':
                return <DocsIntro />;
            case 'syntax':
                return <DocsSyntax />;
            case 'fields':
                return <DocsFields />;
            case 'operations':
                return <DocsOperations />;
            case 'complex':
                return <DocsComplex />;
            default:
                return <DocsIntro />;
        }
    };

    return (
        <div className="docs-overlay" onClick={onClose}>
            <div className="docs-modal" onClick={e => e.stopPropagation()}>
                <div className="docs-sidebar">
                    <div className="docs-sidebar-header">
                        <h2>Reference</h2>
                    </div>
                    <nav className="docs-nav">
                        <div className="nav-group-title">Getting Started</div>
                        <button
                            className={`docs-nav-item ${activeSection === 'intro' ? 'active' : ''}`}
                            onClick={() => setActiveSection('intro')}
                        >
                            Introduction
                        </button>
                        <button
                            className={`docs-nav-item ${activeSection === 'syntax' ? 'active' : ''}`}
                            onClick={() => setActiveSection('syntax')}
                        >
                            Syntax Guide
                        </button>

                        <div className="nav-group-title">Reference</div>
                        <button
                            className={`docs-nav-item ${activeSection === 'fields' ? 'active' : ''}`}
                            onClick={() => setActiveSection('fields')}
                        >
                            Supported Fields
                        </button>
                        <button
                            className={`docs-nav-item ${activeSection === 'operations' ? 'active' : ''}`}
                            onClick={() => setActiveSection('operations')}
                        >
                            Common Operations
                        </button>
                        <button
                            className={`docs-nav-item ${activeSection === 'complex' ? 'active' : ''}`}
                            onClick={() => setActiveSection('complex')}
                        >
                            Complex Mods
                        </button>
                    </nav>
                </div>

                <div className="docs-main-area">
                    <div className="docs-main-header">
                        <div className="breadcrumbs">
                            <span>Docs</span> / <span>{activeSection}</span>
                        </div>
                        <button className="btn-close" onClick={onClose}>&times;</button>
                    </div>
                    <div className="docs-scroll-container">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocsLayout;
