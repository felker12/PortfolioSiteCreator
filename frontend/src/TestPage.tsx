<script src="http://localhost:8097"></script>
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './App.css'
import FileUpload from './FileUpload';

function TestPage() {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
                                onSubmit={(files) => navigate('/testing', { state: { file: files[0] } })}
                            />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default TestPage