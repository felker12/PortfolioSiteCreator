import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import FileSelection from './FileSelection.tsx'
import SiteCreator from './SiteCreator.tsx'
import ThemeSelection from './ThemeSelection.tsx'

createRoot(document.getElementById('root')!).render(
    <Router>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/file-selection" element={<FileSelection />} />
            <Route path="/site-creator" element={<SiteCreator />} />
            <Route path="/theme-selection" element={<ThemeSelection />} />
        </Routes>
    </Router>
)
