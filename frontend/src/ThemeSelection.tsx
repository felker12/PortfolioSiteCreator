import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './App.css';

type Theme = 'Basic' | 'Dark' | 'Card';

const themes: { value: Theme; label: string; description: string }[] = [
    { value: 'Basic', label: 'Basic', description: 'Clean and minimal, great for most portfolios.' },
    { value: 'Dark', label: 'Dark', description: 'Dark background with light text, ideal for developers.' },
    { value: 'Card', label: 'Card Layout', description: 'Modern card-based layout with subtle shadows and hover effects.' },
];

function ThemeSelection() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const file = state?.file as File;
    const [selectedTheme, setSelectedTheme] = useState<Theme>('Basic');
    const [previewHtml, setPreviewHtml] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    useEffect(() => {
        if (!file) return;
        fetchPreview(selectedTheme);
    }, [selectedTheme, file]);

    // Write HTML directly into iframe to avoid cross-origin issues
    useEffect(() => {
        if (!iframeRef.current || !previewHtml) return;
        const blob = new Blob([previewHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        iframeRef.current.src = url;
        return () => URL.revokeObjectURL(url);
    }, [previewHtml]);

    const fetchPreview = async (theme: Theme) => {
        if (!file) return;
        setPreviewLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('theme', theme);

        try {
            const response = await fetch('/api/preview-doc', {
                method: 'POST',
                body: formData,
            });
            const html = await response.text();
            setPreviewHtml(html);
        } catch (error) {
            console.error('Error fetching preview:', error);
        } finally {
            setPreviewLoading(false);
        }
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="app-title">Choose a Theme</h1>
                <p className="app-subtitle">Select a style for your generated website.</p>
            </header>

            <main className="main-content">
                <section className="about-section">
                    <div className="card" style={{ maxWidth: 1000, margin: '0 auto' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

                            {/* Left - controls */}
                            <div style={{ maxWidth: 400, margin: '0 auto'}}>
                                <h2 style={{ marginBottom: 16 }}>Theme</h2>

                                <label
                                    htmlFor="theme-select"
                                    style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#333' }}
                                >
                                    Select a theme
                                </label>
                                <select
                                    id="theme-select"
                                    value={selectedTheme}
                                    onChange={(e) => setSelectedTheme(e.target.value as Theme)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        fontSize: 15,
                                        borderRadius: 6,
                                        border: '1px solid #ccc',
                                        background: '#fff',
                                        color: '#333',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {themes.map((t) => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>

                                <p style={{ marginTop: 10, fontSize: 14, color: '#666' }}>
                                    {themes.find((t) => t.value === selectedTheme)?.description}
                                </p>

                                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                                    <button
                                        onClick={() => navigate('/file-selection')}
                                        style={{
                                            padding: '10px 20px',
                                            fontSize: 15,
                                            fontWeight: 600,
                                            color: '#444',
                                            background: 'transparent',
                                            border: '1px solid #ccc',
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => navigate('/site-creator', { state: { file, theme: selectedTheme } })}
                                        style={{
                                            padding: '10px 20px',
                                            fontSize: 15,
                                            fontWeight: 600,
                                            color: 'white',
                                            background: '#4a6cf7',
                                            border: 'none',
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Generate Site
                                    </button>
                                </div>
                            </div>

                            {/* Right - preview */}
                            <div style={{ flex: 1, width: 800, height: 600 }}>
                                <h2 style={{ marginBottom: 16 }}>Preview</h2>
                                <div style={{
                                    border: '1px solid #e5e5e5',
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                    position: 'relative',
                                    minHeight: 400,
                                }}>
                                    {previewLoading && (
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'rgba(255,255,255,0.8)',
                                            fontSize: 14,
                                            color: '#666',
                                            zIndex: 1,
                                        }}>
                                            Loading preview...
                                        </div>
                                    )}
                                    <iframe
                                        ref={iframeRef}
                                        style={{
                                            width: '100%',
                                            height: 400,
                                            border: 'none',
                                            display: 'block',
                                        }}
                                        title="Theme Preview"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ThemeSelection;
