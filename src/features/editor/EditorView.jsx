import { useState, useMemo } from 'react'
import { tokenize, parse, stringify, prettyStringify } from '../../lib/parser'
import { getExamples } from '../../lib/examples'
import FormulaVisualizer from '../visualizer/FormulaVisualizer'
import QuickReference from '../docs/QuickReference'
import LogicEditor from './LogicEditor'
import SyntaxHighlightedEditor from './SyntaxHighlightedEditor'
import FeedbackWidget from '../../components/FeedbackWidget'
import './Editor.css'
// App.css is imported in App.jsx or main.jsx, so we might not need it here if styles are global, 
// but if there are specific styles for the editor, they might be there. 
// However, the import in App.jsx suggests it might be needed. Let's keep it safe or rely on global.
// Given App.css is usually global, I'll rely on it being imported in App.jsx or main.jsx.

// Mock Data for "Current Value" tooltips
const MOCK_DATA = {
    '0': {
        staff: { title: "SECRETARY" }
    },
    '1': {
        staff: { title: "NURSE" },
        school: { name: "LOCUST ELEMENTARY" }
    },
    '2': {
        school: {
            sis_id: "138",
            name: "Hellyer Elementary"
        }
    },
    '3': {
        staff: { department: "Math" }
    },
    '4': {
        school: { name: "Central High" },
        staff: { job_function: "Instructional" }
    },
    '5': {
        staff: { department: "Business", title: "ACCOUNTANT" }
    },
    'default': {
        staff: { title: "Unknown Title", department: "Unknown Dept", job_function: "Unknown Function" },
        school: { name: "Demo School", sis_id: "000" },
        user: { name: "Demo User", role: "Admin" }
    }
};

function EditorView() {
    // Load examples immediately
    const examples = useMemo(() => getExamples(), []);

    // Initialize with Example 0
    const defaultExample = examples.find(ex => ex.name === '0');

    // Editor State
    const [logicMode, setLogicMode] = useState(defaultExample ? defaultExample.type : 'OU'); // 'OU', 'GROUP'
    const [formula, setFormula] = useState(defaultExample ? defaultExample.formula : `{{if equals staff.title "SECRETARY" "Business" 
  if equals staff.title "SPECIAL ED DIRECTOR" "Business" 
  if equals staff.title "BUSINESS MANAGER" "Business" "Unknown"}}`)
    const [selectedExample, setSelectedExample] = useState(defaultExample ? '0' : '');
    const [showQuickDocs, setShowQuickDocs] = useState(false);
    const [highlightRange, setHighlightRange] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSyntax, setShowSyntax] = useState(false);

    // Get current data context for tooltips
    const dataContext = useMemo(() => {
        return MOCK_DATA[selectedExample] || MOCK_DATA['default'];
    }, [selectedExample]);

    const { ast, error, stats } = useMemo(() => {
        try {
            if (!formula.trim()) return { ast: null, error: null, stats: { chars: 0, lines: 0 } };
            const tokens = tokenize(formula);
            const ast = parse(tokens);
            return {
                ast,
                error: null,
                stats: {
                    chars: formula.length,
                    lines: formula.split('\n').length
                }
            };
        } catch (e) {
            return {
                ast: null,
                error: e,
                stats: {
                    chars: formula.length,
                    lines: formula.split('\n').length
                }
            };
        }
    }, [formula]);

    const handleFormat = () => {
        if (ast) {
            const formatted = prettyStringify(ast);
            setFormula(`{{${formatted}}}`);
        }
    };

    const handleCompress = () => {
        if (ast) {
            const compressed = stringify(ast);
            setFormula(`{{${compressed}}}`);
        }
    };

    const handleNew = () => {
        setFormula('{{}}');
        setSelectedExample('');
    };

    const loadExample = (e) => {
        const name = e.target.value;
        const selected = examples.find(ex => ex.name === name);
        if (selected) {
            setFormula(selected.formula);
            setSelectedExample(name);
            setLogicMode(selected.type);
        }
    };

    // Clear formula when switching modes
    const handleModeSwitch = (mode) => {
        if (mode === logicMode) return;
        setLogicMode(mode);
        setFormula('{{}}');
        setSelectedExample('');
    };

    return (
        <>
            <header className="app-header">
                <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginRight: 'auto' }}>
                    <div className="toggle-group" style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '2px', borderRadius: '6px', border: '1px solid var(--glass-border)' }}>
                        <button
                            className={`btn-toggle ${logicMode === 'EXPLORER' ? 'active' : ''}`}
                            onClick={() => handleModeSwitch('EXPLORER')}
                            style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '4px',
                                background: logicMode === 'EXPLORER' ? 'var(--accent-primary)' : 'transparent',
                                color: logicMode === 'EXPLORER' ? 'white' : 'var(--text-secondary)',
                                border: 'none',
                                fontSize: '0.85rem',
                                cursor: 'pointer'
                            }}
                        >
                            Explorer
                        </button>
                        <button
                            className={`btn-toggle ${logicMode === 'OU' ? 'active' : ''}`}
                            onClick={() => handleModeSwitch('OU')}
                            style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '4px',
                                background: logicMode === 'OU' ? 'var(--accent-primary)' : 'transparent',
                                color: logicMode === 'OU' ? 'white' : 'var(--text-secondary)',
                                border: 'none',
                                fontSize: '0.85rem',
                                cursor: 'pointer'
                            }}
                        >
                            OU Logic
                        </button>
                        <button
                            className={`btn-toggle ${logicMode === 'GROUP' ? 'active' : ''}`}
                            onClick={() => handleModeSwitch('GROUP')}
                            style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '4px',
                                background: logicMode === 'GROUP' ? 'var(--accent-primary)' : 'transparent',
                                color: logicMode === 'GROUP' ? 'white' : 'var(--text-secondary)',
                                border: 'none',
                                fontSize: '0.85rem',
                                cursor: 'pointer'
                            }}
                        >
                            Group Logic
                        </button>
                    </div>
                </div>

                <div className="header-actions" style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
                    <button className="btn-secondary" onClick={() => setShowQuickDocs(true)}>Quick Reference</button>
                    <button className="btn-primary" onClick={handleNew}>New Formula</button>
                </div>
            </header>

            <main className="workspace">
                {/* Editor Panel */}
                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-title">
                            <span>Raw Logic</span>
                            <span style={{ fontSize: '0.8em', opacity: 0.5, fontWeight: 'normal' }}>IDM Syntax</span>
                        </div>

                        <div className="panel-controls">
                            <label htmlFor="example-loader" className="sr-only">Load Example</label>
                            <select
                                id="example-loader"
                                className="example-select"
                                onChange={loadExample}
                                value={selectedExample}
                                aria-label="Load Example"
                            >
                                <option value="" disabled>Load Example...</option>
                                {examples
                                    .filter(ex => ex.type === logicMode)
                                    .map(ex => (
                                        <option key={ex.name} value={ex.name}>Example {ex.name}</option>
                                    ))}
                            </select>

                            <label className="toggle-label" style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', marginRight: '1rem', cursor: 'pointer', gap: '6px' }}>
                                <input
                                    type="checkbox"
                                    checked={showSyntax}
                                    onChange={(e) => setShowSyntax(e.target.checked)}
                                    style={{ cursor: 'pointer' }}
                                />
                                Syntax Highlight
                            </label>

                            <button
                                onClick={handleCompress}
                                className="btn-secondary"
                                style={{ padding: '0.35em 0.8em', fontSize: '0.85em', marginRight: '0.5rem' }}
                                disabled={!!error || !ast}
                            >
                                Compress
                            </button>
                            <button
                                onClick={handleFormat}
                                className="btn-primary"
                                style={{ padding: '0.35em 0.8em', fontSize: '0.85em' }}
                                disabled={!!error || !ast}
                            >
                                Format
                            </button>
                        </div>
                    </div>

                    <div className="editor-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                        <SyntaxHighlightedEditor
                            value={formula}
                            onChange={(e) => {
                                setFormula(e.target.value);
                                if (selectedExample) setSelectedExample('');
                            }}
                            placeholder="Type your IDM formula here..."
                            highlightRange={highlightRange}
                            enableSyntax={showSyntax}
                            dataContext={dataContext}
                            exampleName={selectedExample || 'default'}
                            className="main-editor-syntax"
                        />
                        <div style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            borderTop: '1px solid var(--glass-border)',
                            background: 'var(--bg-tertiary)',
                            display: 'flex',
                            gap: '1rem'
                        }}>
                            <span>{stats?.chars || 0} chars</span>
                            <span>{stats?.lines || 0} lines</span>
                        </div>
                    </div>
                </div>

                {/* Visualizer Panel */}
                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-title">
                            <span>Visualizer</span>
                            <span style={{ fontSize: '0.8em', opacity: 0.5, fontWeight: 'normal' }}>Live Preview</span>
                        </div>
                        <div className="panel-controls" style={{ marginLeft: 'auto' }}>
                            <div className="search-box" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '8px', opacity: 0.5 }}>
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '4px',
                                        padding: '4px 8px 4px 28px',
                                        fontSize: '0.85rem',
                                        color: 'var(--text-primary)',
                                        width: '140px',
                                        outline: 'none',
                                        transition: 'width 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.width = '200px'}
                                    onBlur={(e) => e.target.style.width = '140px'}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="visualizer-wrapper">
                        <FormulaVisualizer ast={ast} error={error} mode={logicMode} onHoverNode={setHighlightRange} searchTerm={searchTerm} />
                    </div>
                </div>
            </main>

            {showQuickDocs && <QuickReference onClose={() => setShowQuickDocs(false)} />}
            <FeedbackWidget location="Editor" />
        </>
    );
}

export default EditorView;
