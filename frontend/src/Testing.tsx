import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import './App.css'

function Testing() {
    const { state } = useLocation();
    const [docText, setDocText] = useState<string | null>(null);

    useEffect(() => {
        const file: File = state?.file;
        if (!file || !file.name.endsWith('.docx')) return;

        const formData = new FormData();
        formData.append('file', file);
        fetch('/api/process-doc', {
            method: 'POST',
            body: formData,
        })
            .then(res => res.json())
            .then(data => setDocText(data.text));
    }, [state]);

    return (
        <div className="app-container">
            <main className="main-content">
                <section className="weather-section" aria-labelledby="weather-heading">
                    <div className="card"
                        style={{ maxWidth: 800, margin: '0 auto', maxHeight: 800,
                            overflow: "auto",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word", }}>
                        <div className="section-header">
                            {docText && (
                                <div style={{ padding: 16, border: '1px solid #eee', borderRadius: 6 }}>
                                    <h3 style={{ marginBottom: 12 }}>Document Content</h3>
                                    <pre style={{
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        fontFamily: 'Segoe UI, Roboto, sans-serif',
                                        fontSize: 14,
                                        lineHeight: 1.6,
                                    }}>
                                        {docText}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Testing;