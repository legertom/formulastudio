import { Routes, Route, Navigate } from 'react-router-dom'
import EditorView from './features/editor/EditorView'
import DocsPage from './features/docs/DocsPage'
import TrainingCenter from './features/training/TrainingCenter'
import NavBar from './components/NavBar'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<EditorView />} />
          <Route path="/training" element={<TrainingCenter />} />
          <Route path="/docs" element={<Navigate to="/docs/intro" replace />} />
          <Route path="/docs/:pageId" element={<DocsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
