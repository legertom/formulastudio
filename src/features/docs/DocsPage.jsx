import React, { useState, useRef, useEffect } from 'react'; // Added useEffect for scrolling later if needed
import { useParams, useNavigate } from 'react-router-dom';
import DocsIntro from './content/DocsIntro';
import FeedbackWidget from '../../components/FeedbackWidget';
import './Docs.css';
import DocsSyntax from './content/DocsSyntax';
import DocsVariables from './content/DocsVariables';
import DocsArguments from './content/DocsArguments';
import DocsBooleans from './content/DocsBooleans';
import DocsLiterals from './content/DocsLiterals';
import DocsFunctions from './content/DocsFunctions';
import DocsArity from './content/DocsArity';
import DocsNesting from './content/DocsNesting';
import DocsFields from './content/DocsFields';
import DocsTextTransform from './content/DocsTextTransform';
import DocsTextExtraction from './content/DocsTextExtraction';
import DocsSearchReplace from './content/DocsSearchReplace';
import DocsMathDates from './content/DocsMathDates';
import DocsLogic from './content/DocsLogic';
import DocsUtilities from './content/DocsUtilities';
import DocsComplex from './content/DocsComplex';
import DocsExamples from './content/DocsExamples';
import DocsForEachOverview from './content/DocsForEachOverview';
import DocsForEachEncoder from './content/DocsForEachEncoder';
import DocsForEachAdvanced from './content/DocsForEachAdvanced';
import DocsTroubleshooting from './content/DocsTroubleshooting';
import {
    TEXT_TRANSFORM_OPS,
    TEXT_EXTRACTION_OPS,
    SEARCH_REPLACE_OPS,
    MATH_DATE_OPS,
    LOGIC_OPS,
    UTILITY_OPS
} from './data';

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
            { id: 'literals', label: 'Literals' },
            { id: 'variables', label: 'Variables' },
            { id: 'arguments', label: 'Arguments' },
            { id: 'functions-concept', label: 'Functions' },
            { id: 'arity', label: 'Arity' },
            { id: 'booleans', label: 'Booleans' },
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
            {
                id: 'examples',
                label: 'Examples & Recipes',
                subItems: [
                    'First Name Template',
                    'Full Name with Space',
                    'ID Generation',
                    'Hyphen Replacement',
                    'Length Conditional',
                    'Secret ID Check',
                    'Graduation Status (Nested If)',
                    'Middle Name Handling',
                    'Middle Name with Fallback',
                    'Full Name with Optional Middle'
                ]
            },
            {
                id: 'complex',
                label: 'Complex Patterns',
                subItems: [
                    'Graduation Year Normalization',
                    'Grade Level Standardization',
                    'Short Grade Labels',
                    'School Name Cleaning'
                ]
            },
        ]
    },
    {
        title: "Help",
        items: [
            { id: 'troubleshooting', label: 'Troubleshooting' },
        ]
    }
];

const DocsPage = () => {
    const { pageId, subId } = useParams();
    const navigate = useNavigate();
    const activeDoc = pageId || 'intro';
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
        navigate(`/docs/${item.id}`);
        // If item has sub-items, expand it
        if (item.subItems) {
            setExpandedItems(prev => ({
                ...prev,
                [item.id]: true
            }));
        }
    };

    // Auto-scroll when subId changes (or on mount if present)
    useEffect(() => {
        // Reset scroll to top when switching main pages (e.g. intro -> syntax)
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }

        if (subId) {
            // Expand the category
            setExpandedItems(prev => ({
                ...prev,
                [pageId]: true
            }));

            // Wait slight tick for render
            setTimeout(() => {
                const element = document.getElementById(subId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [pageId, subId]);

    const scrollToFunction = (funcName) => {
        const element = document.getElementById(funcName);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleFunctionNavigate = (category, funcName) => {
        navigate(`/docs/${category}/${funcName}`);
    };

    const renderContent = () => {
        switch (activeDoc) {
            case 'intro': return <DocsIntro />;
            case 'syntax': return <DocsSyntax />;
            case 'variables': return <DocsVariables />;
            case 'arguments': return <DocsArguments />;
            case 'booleans': return <DocsBooleans />;
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

                    {/* Collapsed Navigation Rail */}
                    {sidebarCollapsed && (
                        <nav className="docs-nav-rail">
                            {NAV_STRUCTURE.map((section, idx) => {
                                // Check if any item in this section is active
                                const isActiveSection = section.items.some(item => item.id === activeDoc);
                                const firstItem = section.items[0];
                                return (
                                    <button
                                        key={idx}
                                        className={`nav-rail-dot ${isActiveSection ? 'active' : ''}`}
                                        onClick={() => handleNavClick(firstItem)}
                                        title={section.title}
                                    >
                                        <span className="nav-rail-tooltip">{section.title}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    )}

                    {/* Full Navigation */}
                    <nav className={`docs-nav-full ${sidebarCollapsed ? 'hidden' : ''}`}>
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
                                                            navigate(`/docs/${item.id}/${funcName}`);
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
            <FeedbackWidget location={`Docs - ${activeDoc}`} />
        </div>
    );
};

export default DocsPage;
