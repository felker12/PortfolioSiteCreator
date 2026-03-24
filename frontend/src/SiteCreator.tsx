import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './App.css'

export default function SiteCreator() {
    const location = useLocation();
    const file = location.state?.file as File;
    const [folderName, setFolderName] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);
    const theme = location.state?.theme as string ?? 'Basic';

    const handleOrganizeFile = async (file: File) => {
        if (!file || !file.name.endsWith('.docx')) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('theme', theme);

        try {
            const response = await fetch('/api/organize-doc', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            const name = data.folderPath.split(/[\\/]/).pop();
            setFolderName(name);
            setIsReady(true);
        } catch (error) {
            console.error("Error organizing document:", error);
        }
    };

    useEffect(() => {
        if (file) handleOrganizeFile(file);
    }, []);

    return (
        <div className="app-container">
            <header className="app-header">
                <h2>Site Creator for: {file?.name}</h2>
                <Link to="/file-selection">File Selection Page</Link>
            </header>

            <main className="main-content" style={{ alignItems: 'flex-start', paddingTop: '1rem' }}>
                <section className="weather-section" aria-labelledby="weather-heading">
                    <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
                        <h3 style={{ marginBottom: 16 }}>Site Creator Content for: {file?.name}</h3>

                        {!isReady && (
                            <div style={{ color: '#666' }}>Generating your website...</div>
                        )}

                        {isReady && folderName && (
                            <div style={{ marginTop: 16 }}>
                                <p style={{ marginBottom: 12, color: '#444' }}>
                                    Your website has been generated successfully.
                                </p>
                                <a
                                    href={`/api/download-site/${folderName}`}
                                    download
                                    style={{
                                        display: 'inline-block',
                                        padding: '12px 32px',
                                        fontSize: 16,
                                        fontWeight: 600,
                                        color: 'white',
                                        background: '#4a6cf7',
                                        border: 'none',
                                        borderRadius: 8,
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Download Website
                                </a>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <footer style={{ padding: 12, borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <small>Generated with SiteCreator</small>
            </footer>
        </div>
    );
}
