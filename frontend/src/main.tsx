import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import FileSelection from './FileSelection.tsx'
import Testing from './Testing.tsx'
import SiteCreator from './SiteCreator.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/file-selection" element={<FileSelection />} />
        <Route path="/testing" element={<Testing />} />
        <Route path="/site-creator" element={<SiteCreator />} />
      </Routes>
    </Router>
  </StrictMode>,
)
