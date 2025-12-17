import { useState, useMemo } from 'react'
import { tokenize, parse, stringify } from './lib/parser'
import FormulaVisualizer from './components/FormulaVisualizer'
import './App.css'

function App() {
  const [formula, setFormula] = useState(`{{if equals staff.title "SECRETARY" "Business" 
  if equals staff.title "SPECIAL ED DIRECTOR" "Business" 
  if equals staff.title "BUSINESS MANAGER" "Business" "Unknown"}}`)

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
            <div>
              <span>Raw Logic</span>
              <span style={{ fontSize: '0.8em', opacity: 0.7, marginLeft: '0.5em' }}>IDM Syntax</span>
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
