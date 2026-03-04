import { useState } from 'react'
import './App.css'
import FileUpload from './FileUpload';

function TestPage() {
    const [docText, setDocText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleProcessFile = async (files: File[]) => {
        const file = files[0];
        if (!file || !file.name.endsWith('.docx')) return;

        setIsLoading(true);
        setDocText(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/process-doc', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setDocText(data.text);
        } catch (error) {
            console.error("Error processing document:", error);
            setDocText("Error: Could not process the document.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigate = () => {
        // TODO: Replace with your navigation logic, e.g. navigate('/next-page')
        console.log("Navigating to next page...");
    };

    return (
        <div className="app-container">
            <main className="main-content">
                <section className="weather-section" aria-labelledby="weather-heading">
                    <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
                        <div className="section-header">
                            <FileUpload
                                accept=".docx"
                                multiple={false}
                                maxSizeMB={10}
                                showPreview={false}
                                // Auto-process when a file is selected
                                onFilesSelected={(files) => {
                                    if (files.length > 0) {
                                        handleProcessFile(files);
                                    } else {
                                        setDocText(null);
                                    }
                                }}
                                // Process button now navigates to another page
                                onSubmit={handleNavigate}
                            />
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>
                                Processing document...
                            </div>
                        )}

                        {/* Document Content Display */}
                        {docText && (
                            <div style={{
                                marginTop: 20,
                                padding: 16,
                                borderTop: '1px solid #eee',
                                backgroundColor: '#f9f9f9',
                                borderRadius: '0 0 8px 8px'
                            }}>
                                <h3 style={{ marginBottom: 12, fontSize: 16, color: '#333' }}>Document Content</h3>
                                <pre style={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    fontFamily: 'Segoe UI, Roboto, sans-serif',
                                    fontSize: 14,
                                    lineHeight: 1.6,
                                    color: '#444',
                                    maxHeight: '500px',
                                    overflowY: 'auto'
                                }}>
                                    {docText}
                                </pre>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default TestPage;
