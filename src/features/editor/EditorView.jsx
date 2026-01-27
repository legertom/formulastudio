import { useState, useMemo, useEffect } from 'react'
import { tokenize, parse, stringify, prettyStringify } from '../../lib/parser'
import { getExamples } from '../../lib/examples'
import FormulaVisualizer from '../visualizer/FormulaVisualizer'
import QuickReference from '../docs/QuickReference'
import LogicEditor from './LogicEditor'
import SyntaxHighlightedEditor from './SyntaxHighlightedEditor'
import FeedbackWidget from '../../components/FeedbackWidget'
import sampledata from '../../sampledata.json'
import JsonTreeEditor from '../visualizer/components/JsonTreeEditor'
import './Editor.css'
// App.css is imported in App.jsx or main.jsx, so we might not need it here if styles are global, 
// but if there are specific styles for the editor, they might be there. 
// However, the import in App.jsx suggests it might be needed. Let's keep it safe or rely on global.
// Given App.css is usually global, I'll rely on it being imported in App.jsx or main.jsx.

// Mock Data for "Current Value" tooltips
const MOCK_DATA = {
    '0': {
        staff: { title: "REGISTRAR" }
    },
    '1': {
        staff: { title: "MATRON" },
        school: { name: "Walkerville Elementary" }
    },
    '2': {
        school: {
            sis_id: "138",
            name: "Pippi Pursuit Elementary"
        }
    },
    '3': {
        staff: { department: "Administration" }
    },
    '4': {
        school: { name: "Rydell High" },
        staff: { job_function: "Instructional" }
    },
    '5': {
        staff: { department: "Administration", title: "BURSAR" }
    },
    'default': sampledata
};

function EditorView() {
    // Load examples immediately
    const examples = useMemo(() => getExamples(), []);

    // Initialize with Example 0
    // Editor State
    // Default to Explorer mode with empty formula
    const [logicMode, setLogicMode] = useState('EXPLORER');
    const [formula, setFormula] = useState('{{}}');
    const [selectedExample, setSelectedExample] = useState('');
    const [showQuickDocs, setShowQuickDocs] = useState(false);
    const [highlightRange, setHighlightRange] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSyntax, setShowSyntax] = useState(true);
    const [showTestData, setShowTestData] = useState(true);

    // Panel visibility toggles
    const [showEditorPanel, setShowEditorPanel] = useState(true);
    const [showOutputPanel, setShowOutputPanel] = useState(true);

    // Test data state for the standalone Data panel
    const [testData, setTestData] = useState(sampledata);

    // Hide Data panel by default in OU Logic and Group Logic modes
    useEffect(() => {
        if (logicMode === 'OU' || logicMode === 'GROUP') {
            setShowTestData(false);
        } else if (logicMode === 'EXPLORER') {
            setShowTestData(true);
        }
    }, [logicMode]);

    // Calculate visible panel count for grid layout
    // Now showTestData is a TRUE separate panel
    const visiblePanels = [showEditorPanel, showTestData, showOutputPanel].filter(Boolean).length;

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

    const handleDownloadJSON = () => {
        const dataStr = JSON.stringify(testData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'test_data.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleUploadJSON = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target.result);
                setTestData(json);
                // Reset select if needed, or just let it stay
            } catch (err) {
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = '';
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

                {/* Panel Toggle Buttons */}
                <div className="panel-toggles" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>Panels:</span>
                    <button
                        className={`panel-toggle-btn ${showEditorPanel ? 'active' : ''}`}
                        onClick={() => setShowEditorPanel(!showEditorPanel)}
                        style={{
                            padding: '4px 10px',
                            borderRadius: '4px',
                            background: showEditorPanel ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                            color: showEditorPanel ? 'white' : 'var(--text-muted)',
                            border: '1px solid var(--glass-border)',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Editor
                    </button>
                    <button
                        className={`panel-toggle-btn ${showTestData ? 'active' : ''}`}
                        onClick={() => setShowTestData(!showTestData)}
                        style={{
                            padding: '4px 10px',
                            borderRadius: '4px',
                            background: showTestData ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                            color: showTestData ? 'white' : 'var(--text-muted)',
                            border: '1px solid var(--glass-border)',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Data
                    </button>
                    <button
                        className={`panel-toggle-btn ${showOutputPanel ? 'active' : ''}`}
                        onClick={() => setShowOutputPanel(!showOutputPanel)}
                        style={{
                            padding: '4px 10px',
                            borderRadius: '4px',
                            background: showOutputPanel ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                            color: showOutputPanel ? 'white' : 'var(--text-muted)',
                            border: '1px solid var(--glass-border)',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Output
                    </button>
                </div>

                <div className="header-actions" style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
                    <button className="btn-secondary" onClick={() => setShowQuickDocs(true)}>Quick Reference</button>
                    <button className="btn-primary" onClick={handleNew}>New Formula</button>
                </div>
            </header>

            <main className="workspace" style={{ gridTemplateColumns: `repeat(${visiblePanels}, 1fr)` }}>
                {/* Editor Panel */}
                {showEditorPanel && <div className="panel">
                    <div className="panel-header" style={{ flexWrap: 'wrap', gap: '0.5rem', padding: '0.75rem 1rem', justifyContent: 'space-between' }}>
                        <div className="panel-title" style={{ flexShrink: 0 }}>
                            <span>Editor</span>
                        </div>

                        <div className="panel-controls" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap' }}>
                            <label htmlFor="example-loader" className="sr-only">Load Example</label>
                            <select
                                id="example-loader"
                                className="example-select"
                                style={{ maxWidth: '120px', flexShrink: 1 }}
                                onChange={loadExample}
                                value={selectedExample}
                                aria-label="Load Example"
                            >
                                <option value="" disabled>Load Example...</option>
                                {examples
                                    .filter(ex => ex.type === logicMode)
                                    .map(ex => (
                                        <option key={ex.name} value={ex.name}>{ex.name}</option>
                                    ))}
                            </select>

                            <label className="toggle-label" data-tooltip="Toggle Syntax Highlighting" data-tooltip-pos="bottom" style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', cursor: 'pointer', gap: '4px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                <input
                                    type="checkbox"
                                    checked={showSyntax}
                                    onChange={(e) => setShowSyntax(e.target.checked)}
                                    style={{ cursor: 'pointer' }}
                                />
                                Highlight
                            </label>

                            <div className="data-actions-group" style={{ flexShrink: 0 }}>
                                <button
                                    onClick={handleCompress}
                                    className="btn-icon"
                                    data-tooltip="Compress logic"
                                    data-tooltip-pos="bottom"
                                    disabled={!!error || !ast}
                                    style={{ padding: '4px 6px' }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 14h6v6" />
                                        <path d="M20 10h-6V4" />
                                        <path d="M14 10l7-7" />
                                        <path d="M10 14l-7 7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleFormat}
                                    className="btn-icon"
                                    data-tooltip="Format logic"
                                    data-tooltip-pos="bottom"
                                    disabled={!!error || !ast}
                                    style={{ padding: '4px 6px' }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                        <line x1="8" y1="9" x2="16" y2="9" />
                                        <line x1="8" y1="13" x2="14" y2="13" />
                                    </svg>
                                </button>
                            </div>
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
                </div>}

                {/* Data Panel - Now its own separate panel */}
                {showTestData && (
                    <div className="panel">
                        <div className="panel-header">
                            <div className="panel-title" style={{ flexShrink: 0 }}>
                                <span>Test Data</span>
                            </div>
                            <div className="panel-controls" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <div className="data-actions-group">
                                    <button
                                        onClick={handleDownloadJSON}
                                        className="btn-icon"
                                        data-tooltip="Export JSON"
                                        data-tooltip-pos="bottom"
                                        style={{ padding: '4px 6px' }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                    </button>
                                    <label
                                        className="btn-icon"
                                        style={{ cursor: 'pointer', padding: '4px 6px' }}
                                        data-tooltip="Import JSON"
                                        data-tooltip-pos="bottom"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                        <input
                                            type="file"
                                            accept=".json"
                                            onChange={handleUploadJSON}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>
                                <button
                                    onClick={() => setTestData(sampledata)}
                                    className="btn-tertiary"
                                    data-tooltip="Reset sample data"
                                    data-tooltip-pos="bottom"
                                    style={{ padding: '4px 8px' }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                        <path d="M3 3v5h5" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="data-panel-wrapper" style={{ padding: '1rem', overflow: 'auto', flex: 1 }}>
                            <JsonTreeEditor
                                data={testData}
                                onChange={setTestData}
                            />
                        </div>
                    </div>
                )}

                {/* Output/Visualizer Panel */}
                {showOutputPanel &&
                    <div className="panel">
                        <div className="panel-header">
                            <div className="panel-title">
                                <span>Visualizer</span>
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
                            <FormulaVisualizer ast={ast} error={error} mode={logicMode} onHoverNode={setHighlightRange} searchTerm={searchTerm} showTestData={false} testData={testData} />
                        </div>
                    </div>}
            </main>

            {showQuickDocs && <QuickReference onClose={() => setShowQuickDocs(false)} />}
            <FeedbackWidget location="Editor" />
        </>
    );
}

export default EditorView;
