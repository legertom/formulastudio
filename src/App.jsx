import { useState, useMemo, useEffect } from 'react'
import { tokenize, parse, stringify, prettyStringify } from './lib/parser'
import { getExamples } from './lib/examples'
import FormulaVisualizer from './components/FormulaVisualizer'
import DocsLayout from './components/DocsLayout'
import './App.css'

function App() {
  const [formula, setFormula] = useState(`{{if equals staff.title "SECRETARY" "Business" 
  if equals staff.title "SPECIAL ED DIRECTOR" "Business" 
  if equals staff.title "BUSINESS MANAGER" "Business" "Unknown"}}`)
  const [examples, setExamples] = useState([]);
  const [showDocs, setShowDocs] = useState(false);

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

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          FormulaStudio
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" onClick={() => setShowDocs(true)}>Reference</button>
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
            <FormulaVisualizer ast={ast} error={error} />
          </div>
        </div>
      </main>

      {showDocs && <DocsLayout onClose={() => setShowDocs(false)} />}
    </div >
  )
}

export default App
