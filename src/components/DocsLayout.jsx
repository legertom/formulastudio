import React, { useState } from 'react';
import DocsFields from './docs/DocsFields';
import DocsOperations from './docs/DocsOperations';
import DocsComplex from './docs/DocsComplex';

const DocsLayout = ({ onClose }) => {
    const [activeSection, setActiveSection] = useState('fields');

    const renderContent = () => {
        switch (activeSection) {
            case 'fields':
                return <DocsFields />;
            case 'operations':
                return <DocsOperations />;
            case 'complex':
                return <DocsComplex />;
            default:
                return <DocsFields />;
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
