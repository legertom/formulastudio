import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import EditorView from './features/editor/EditorView'
import DocsPage from './features/docs/DocsPage'
import TrainingCenter from './features/training/TrainingCenter'
import TrainingIntro from './features/training/TrainingIntro'
import AuthPage from './features/auth/AuthPage'
import AuthCallbackPage from './features/auth/AuthCallbackPage'
import AdminPage from './features/admin/AdminPage'
import AccountPage from './features/account/AccountPage'
import AboutPage from './features/about/AboutPage'
import NavBar from './components/NavBar'
import ScrollToTop from './components/ScrollToTop'
import './App.css'

const hasAuthCallbackParams = (search, hash) => {
  const params = new URLSearchParams(search || '')
  if (
    params.has('code') ||
    params.has('error') ||
    params.has('error_description')
  ) {
    return true
  }

  const fragment = String(hash || '')
  return (
    fragment.includes('access_token=') ||
    fragment.includes('refresh_token=') ||
    fragment.includes('error=')
  )
}

function RootEntryRedirect() {
  const location = useLocation()
  if (hasAuthCallbackParams(location.search, location.hash)) {
    return (
      <Navigate
        to={`/auth/callback${location.search || ''}${location.hash || ''}`}
        replace
      />
    )
  }

  return <Navigate to="/explorer" replace />
}

function App() {
  return (
    <div className="app-container">
      <ScrollToTop />
      <NavBar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<RootEntryRedirect />} />
          <Route path="/explorer" element={<EditorView mode="EXPLORER" />} />
          <Route path="/ou" element={<EditorView mode="OU" />} />
          <Route path="/group" element={<EditorView mode="GROUP" />} />
          <Route path="/training" element={<TrainingIntro />} />
          <Route path="/training/:chapterIndex/:stepIndex" element={<TrainingCenter />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/docs" element={<Navigate to="/docs/intro" replace />} />
          <Route path="/docs/:pageId" element={<DocsPage />} />
          <Route path="/docs/:pageId/:subId" element={<DocsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
