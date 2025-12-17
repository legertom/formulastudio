import { useState } from 'react'
import './App.css'

function App() {
  const [formula, setFormula] = useState(`{{if equals staff.title "SECRETARY" "Business" "Unknown"}}`)

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
            <span>Raw Logic</span>
            <span style={{fontSize: '0.8em', opacity: 0.7}}>IDM Syntax</span>
          </div>
          <textarea 
            className="editor-area"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            spellCheck="false"
          />
        </div>

        {/* Visualizer Panel (Placeholder) */}
        <div className="panel glass-panel">
          <div className="panel-header">
            <span>Visualizer</span>
            <span style={{fontSize: '0.8em', opacity: 0.7}}>Live Preview</span>
          </div>
          <div style={{
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--text-muted)',
            border: '2px dashed var(--glass-border)',
            borderRadius: '8px'
          }}>
            Parser not yet implemented
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
