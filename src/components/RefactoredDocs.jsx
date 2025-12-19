import React, { useState, useRef } from 'react';
import DocsIntro from './docs/DocsIntro';
import DocsSyntax from './docs/DocsSyntax';
import DocsVariables from './docs/DocsVariables';
import DocsLiterals from './docs/DocsLiterals';
import DocsFunctions from './docs/DocsFunctions';
import DocsArity from './docs/DocsArity';
import DocsNesting from './docs/DocsNesting';
import DocsFields from './docs/DocsFields';
import DocsTextTransform from './docs/DocsTextTransform';
import DocsTextExtraction from './docs/DocsTextExtraction';
import DocsSearchReplace from './docs/DocsSearchReplace';
import DocsMathDates from './docs/DocsMathDates';
import DocsLogic from './docs/DocsLogic';
import DocsUtilities from './docs/DocsUtilities';
import DocsComplex from './docs/DocsComplex';
import DocsExamples from './docs/DocsExamples';
import DocsForEachOverview from './docs/DocsForEachOverview';
import DocsForEachEncoder from './docs/DocsForEachEncoder';
import DocsForEachAdvanced from './docs/DocsForEachAdvanced';
import DocsTroubleshooting from './docs/DocsTroubleshooting';
import {
    TEXT_TRANSFORM_OPS,
    TEXT_EXTRACTION_OPS,
    SEARCH_REPLACE_OPS,
    MATH_DATE_OPS,
    LOGIC_OPS,
    UTILITY_OPS
} from './docs/functionData';

// Navigation structure with sub-items for function categories
const NAV_STRUCTURE = [
    {
        title: "Getting Started",
        items: [
            { id: 'intro', label: 'Introduction' },
            { id: 'syntax', label: 'Syntax Overview' },
        ]
    },
    {
        title: "Core Concepts",
        items: [
            { id: 'variables', label: 'Variables' },
            { id: 'literals', label: 'Literals' },
            { id: 'functions-concept', label: 'Functions' },
            { id: 'arity', label: 'Arity' },
            { id: 'nesting', label: 'Nesting Logic' },
        ]
    },
    {
        title: "Functions",
        items: [
            { id: 'text-transform', label: 'Text Transformation', subItems: TEXT_TRANSFORM_OPS.map(op => op.name) },
            { id: 'text-extraction', label: 'Text Extraction', subItems: TEXT_EXTRACTION_OPS.map(op => op.name) },
            { id: 'search-replace', label: 'Search & Replace', subItems: SEARCH_REPLACE_OPS.map(op => op.name) },
            { id: 'math-dates', label: 'Math & Dates', subItems: MATH_DATE_OPS.map(op => op.name) },
            { id: 'logic', label: 'Logic & Comparison', subItems: LOGIC_OPS.map(op => op.name) },
            { id: 'utilities', label: 'Utilities', subItems: UTILITY_OPS.map(op => op.name) },
        ]
    },
    {
        title: "forEach",
        items: [
            { id: 'foreach-overview', label: 'Overview & Syntax' },
            { id: 'foreach-encoder', label: 'URL Encoder Tool' },
            { id: 'foreach-advanced', label: 'Nested Functions' },
        ]
    },
    {
        title: "Reference",
        items: [
            { id: 'fields', label: 'Supported Fields' },
        ]
    },
    {
        title: "Learn",
        items: [
            { id: 'examples', label: 'Examples & Recipes' },
            { id: 'complex', label: 'Complex Patterns' },
        ]
    },
    {
        title: "Help",
        items: [
            { id: 'troubleshooting', label: 'Troubleshooting' },
        ]
    }
];

const RefactoredDocs = () => {
    const [activeDoc, setActiveDoc] = useState('intro');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [expandedItems, setExpandedItems] = useState({});
    const contentRef = useRef(null);

    const toggleExpand = (itemId) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleNavClick = (item) => {
        setActiveDoc(item.id);
        // If item has sub-items, expand it
        if (item.subItems) {
            setExpandedItems(prev => ({
                ...prev,
                [item.id]: true
            }));
        }
    };

    const scrollToFunction = (funcName) => {
        const element = document.getElementById(funcName);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleFunctionNavigate = (category, funcName) => {
        setActiveDoc(category);
        // Expand the category in sidebar
        setExpandedItems(prev => ({
            ...prev,
            [category]: true
        }));
        // Wait for render then scroll
        setTimeout(() => scrollToFunction(funcName), 100);
    };

    const renderContent = () => {
        switch (activeDoc) {
            case 'intro': return <DocsIntro />;
            case 'syntax': return <DocsSyntax />;
            case 'variables': return <DocsVariables />;
            case 'literals': return <DocsLiterals />;
            case 'functions-concept': return <DocsFunctions onNavigate={handleFunctionNavigate} />;
            case 'arity': return <DocsArity />;
            case 'nesting': return <DocsNesting />;
            case 'text-transform': return <DocsTextTransform />;
            case 'text-extraction': return <DocsTextExtraction />;
            case 'search-replace': return <DocsSearchReplace />;
            case 'math-dates': return <DocsMathDates />;
            case 'logic': return <DocsLogic />;
            case 'utilities': return <DocsUtilities />;
            case 'foreach-overview': return <DocsForEachOverview />;
            case 'foreach-encoder': return <DocsForEachEncoder />;
            case 'foreach-advanced': return <DocsForEachAdvanced />;
            case 'fields': return <DocsFields />;
            case 'complex': return <DocsComplex />;
            case 'examples': return <DocsExamples />;
            case 'troubleshooting': return <DocsTroubleshooting />;
            default: return <DocsIntro />;
        }
    };

    const getActiveLabel = () => {
        for (const section of NAV_STRUCTURE) {
            for (const item of section.items) {
                if (item.id === activeDoc) return item.label;
            }
        }
        return 'Documentation';
    };

    return (
        <div className="docs-workspace">
            {/* Sidebar */}
            <aside className={`docs-sidebar-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="docs-sidebar-inner">
                    <div className="docs-sidebar-header">
                        <h2>Documentation</h2>
                        <button
                            className="btn-collapse-sidebar"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {sidebarCollapsed ? '→' : '←'}
                        </button>
                    </div>

                    <nav className="docs-nav-full">
                        {NAV_STRUCTURE.map((section, idx) => (
                            <div key={idx} className="docs-nav-section">
                                <div className="docs-nav-section-title">{section.title}</div>
                                {section.items.map(item => (
                                    <div key={item.id}>
                                        <button
                                            className={`docs-nav-btn ${activeDoc === item.id ? 'active' : ''}`}
                                            onClick={() => handleNavClick(item)}
                                        >
                                            <span className="nav-label">{item.label}</span>
                                            {item.subItems && (
                                                <span
                                                    className="nav-expand-icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleExpand(item.id);
                                                    }}
                                                >
                                                    {expandedItems[item.id] ? '▼' : '▶'}
                                                </span>
                                            )}
                                        </button>

                                        {/* Sub-items (functions) */}
                                        {item.subItems && expandedItems[item.id] && (
                                            <div className="docs-sub-nav">
                                                {item.subItems.map(funcName => (
                                                    <button
                                                        key={funcName}
                                                        className="docs-sub-nav-item"
                                                        onClick={() => {
                                                            if (activeDoc !== item.id) {
                                                                setActiveDoc(item.id);
                                                                // Wait for render then scroll
                                                                setTimeout(() => scrollToFunction(funcName), 100);
                                                            } else {
                                                                scrollToFunction(funcName);
                                                            }
                                                        }}
                                                    >
                                                        {funcName}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="docs-main-content">
                <div className="docs-breadcrumbs">
                    <span className="breadcrumb-item">Docs</span>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-item active">{getActiveLabel()}</span>
                </div>

                <div className="docs-content-scroll" ref={contentRef}>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default RefactoredDocs;
