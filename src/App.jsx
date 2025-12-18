import { useState, useMemo, useEffect } from 'react'
import { tokenize, parse, stringify } from './lib/parser'
import { getExamples } from './lib/examples'
import FormulaVisualizer from './components/FormulaVisualizer'
import './App.css'

function App() {
  const [formula, setFormula] = useState(`{{if equals staff.title "SECRETARY" "Business" 
  if equals staff.title "SPECIAL ED DIRECTOR" "Business" 
  if equals staff.title "BUSINESS MANAGER" "Business" "Unknown"}}`)
  const [examples, setExamples] = useState([]);

  useEffect(() => {
    setExamples(getExamples());
  }, []);

  const { ast, error } = useMemo(() => {
    try {
      if (!formula.trim()) return { ast: null, error: null };
      const tokens = tokenize(formula);
      const ast = parse(tokens);
      return { ast, error: null };
    } catch (e) {
      return { ast: null, error: e };
    }
  }, [formula]);

  const handleFormat = () => {
    if (ast) {
      setFormula(`{{${stringify(ast)}}}`);
    }
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
        <div className="logo">FormulaStudio</div>
        <button className="btn-primary">New Formula</button>
      </header>

      <main className="workspace">
        {/* Editor Panel */}
        <div className="panel glass-panel">
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
              <span>Raw Logic</span>
              <select className="example-select" onChange={loadExample} defaultValue="">
                <option value="" disabled>Load Example...</option>
                {examples.map(ex => (
                  <option key={ex.name} value={ex.name}>Example {ex.name}</option>
                ))}
              </select>
              <span style={{ fontSize: '0.8em', opacity: 0.7 }}>IDM Syntax</span>
            </div>
            <button
              onClick={handleFormat}
              className="btn-primary"
              style={{ padding: '0.3em 0.8em', fontSize: '0.8em' }}
              disabled={!!error}
            >
              Format
            </button>
          </div>
          <textarea
            className="editor-area"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            spellCheck="false"
            placeholder="Type your IDM formula here..."
          />
        </div>

        {/* Visualizer Panel */}
        <div className="panel glass-panel">
          <div className="panel-header">
            <span>Visualizer</span>
            <span style={{ fontSize: '0.8em', opacity: 0.7 }}>Live Preview</span>
          </div>
          <div className="visualizer-wrapper">
            <FormulaVisualizer ast={ast} error={error} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
