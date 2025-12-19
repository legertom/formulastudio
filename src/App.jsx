import { useState, useMemo, useEffect } from 'react'
import { tokenize, parse, stringify, prettyStringify } from './lib/parser'
import { getExamples } from './lib/examples'
import FormulaVisualizer from './components/FormulaVisualizer'
import DocsLayout from './components/DocsLayout'
import NavBar from './components/NavBar'
import RefactoredDocs from './components/RefactoredDocs'
import TrainingCenter from './components/TrainingCenter'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('editor'); // 'editor', 'training', 'docs'

  // Editor State
  const [logicMode, setLogicMode] = useState('OU'); // 'OU', 'GROUP'
  const [formula, setFormula] = useState(`{{if equals staff.title "SECRETARY" "Business" 
  if equals staff.title "SPECIAL ED DIRECTOR" "Business" 
  if equals staff.title "BUSINESS MANAGER" "Business" "Unknown"}}`)
  const [examples, setExamples] = useState([]);
  const [showQuickDocs, setShowQuickDocs] = useState(false);

  useEffect(() => {
    setExamples(getExamples());
  }, []);

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

  const handleNew = () => {
    setFormula('{{}}');
  };

  const loadExample = (e) => {
    const selected = examples.find(ex => ex.name === e.target.value);
    if (selected) {
      setFormula(selected.formula);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'training':
        return <TrainingCenter />;
      case 'docs':
        return <RefactoredDocs />;
      case 'editor':
      default:
        return (
          <>
            <header className="app-header">
              <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginRight: 'auto' }}>
                <div className="toggle-group" style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '2px', borderRadius: '6px', border: '1px solid var(--glass-border)' }}>
                  <button
                    className={`btn-toggle ${logicMode === 'OU' ? 'active' : ''}`}
                    onClick={() => setLogicMode('OU')}
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
                    onClick={() => setLogicMode('GROUP')}
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
                      defaultValue=""
                      aria-label="Load Example"
                    >
                      <option value="" disabled>Load Example...</option>
                      {examples.map(ex => (
                        <option key={ex.name} value={ex.name}>Example {ex.name}</option>
                      ))}
                    </select>

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

                <div className="editor-wrapper">
                  <textarea
                    className="editor-area"
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                    spellCheck="false"
                    placeholder="Type your IDM formula here..."
                    aria-label="Formula Editor"
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
                </div>
                <div className="visualizer-wrapper">
                  <FormulaVisualizer ast={ast} error={error} mode={logicMode} />
                </div>
              </div>
            </main>

            {showQuickDocs && <DocsLayout onClose={() => setShowQuickDocs(false)} />}
          </>
        );
    }
  };

  return (
    <div className="app-container">
      <NavBar currentView={currentView} onViewChange={setCurrentView} />
      {renderContent()}
    </div>
  )
}

export default App
