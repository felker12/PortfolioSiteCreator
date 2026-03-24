import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import FileUpload from './FileUpload';

function FileSelection() {
    const [docText, setDocText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fileSelected, setFileSelected] = useState(false);

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

    const navigate = useNavigate();

    const handleNavigate = (files: File[]) => {
        navigate('/theme-selection', { state: { file: files[0] } });
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="app-title">Upload Your Document</h1>
                <p className="app-subtitle">Turn your Word document into a website in just a few seconds.</p>
            </header>

            <main className="main-content">
                <section className="about-section">

                    {/* Instructions — only show before a file is selected */}
                    {!fileSelected && (
                        <div className="card" style={{ marginBottom: 24 }}>
                            <h2 style={{ marginBottom: 12 }}>Before you upload</h2>
                            <p style={{ color: '#555', marginBottom: 16 }}>
                                To get the best results, structure your Word document using the built-in heading styles.
                                Each heading will become its own page on your generated website.
                            </p>
                            <ol style={{ paddingLeft: 20, lineHeight: 2, color: '#444' }}>
                                <li>Open your Word document</li>
                                <li>Apply <strong>Any Heading</strong> style to each section title</li>
                                <li>Write your content as normal paragraphs beneath each heading</li>
                                <li>Save the file as <strong>.docx</strong></li>
                                <li>Upload it below and click <strong>Process Document</strong></li>
                            </ol>
                        </div>
                    )}

                    {/* File Upload */}
                    <div className="card" style={{ maxWidth: 1000, margin: '0 auto' }}>
                        <div className="section-header">
                            <FileUpload
                                accept=".docx"
                                multiple={false}
                                maxSizeMB={10}
                                showPreview={false}
                                onFilesSelected={(files) => {
                                    if (files.length > 0) {
                                        setFileSelected(true);
                                        handleProcessFile(files);
                                    } else {
                                        setFileSelected(false);
                                        setDocText(null);
                                    }
                                }}
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

export default FileSelection;
