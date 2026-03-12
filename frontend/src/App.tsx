import { Link } from 'react-router-dom'
import aspireLogo from '/Aspire.png'
import './App.css'

function App() {
    return (
        <div className="app-container">
            <header className="app-header">
                <a
                    href="https://aspire.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Aspire website (opens in new tab)"
                    className="logo-link"
                >
                    <img src={aspireLogo} className="logo" alt="Aspire logo" />
                </a>
                <h1 className="app-title">Word to Website</h1>
                <p className="app-subtitle">Transform your Word document into a fully structured website in seconds.</p>
            </header>

            <main className="main-content">
                <section className="about-section">
                    <div className="card" style={{ width: 800 }}>
                        <h2>How it works</h2>
                        <p>
                            Upload a Word document structured with headings and paragraphs. Each heading becomes its own page,
                            and your content is automatically organised into a clean, professional website ready to share.
                        </p>
                        <ul style={{ marginTop: 16, marginBottom: 16, paddingLeft: 20, lineHeight: 1.8, color: '#444' }}>
                            <li>Structure your Word doc with headings for each section</li>
                            <li>Upload your <strong>.docx</strong> file</li>
                            <li>Download your generated website</li>
                        </ul>
                        <div className="actions">
                            <Link to="/file-selection">
                                <button style={{
                                    padding: '12px 32px',
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: 'white',
                                    background: '#4a6cf7',
                                    border: 'none',
                                    borderRadius: 8,
                                    cursor: 'pointer',
                                }}>
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="app-footer">
                <nav aria-label="Footer navigation">
                    <a href="https://aspire.dev" target="_blank" rel="noopener noreferrer">
                        Learn more about Aspire
                    </a>
                </nav>
            </footer>
        </div >
    )
}

export default App