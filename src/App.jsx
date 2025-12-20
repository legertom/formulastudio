import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import EditorView from './components/EditorView'
import RefactoredDocs from './components/RefactoredDocs'
import TrainingCenter from './components/TrainingCenter'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <Routes>
        <Route path="/" element={<EditorView />} />
        <Route path="/training" element={<TrainingCenter />} />
        <Route path="/docs" element={<RefactoredDocs />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
