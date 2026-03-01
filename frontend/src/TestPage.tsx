import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios';
import FileUpload from './FileUpload';

const FileUpload2: React.FC = () => {
    // State to store the selected file
    const [file, setFile] = useState<File | null>(null);

    /**
     * Handles the file selection change event.
     * @param e The change event from the input element.
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Access the selected files from the event target
        const selectedFile = e.target.files ? e.target.files[0] : null;

        if (selectedFile) {
            setFile(selectedFile);
            console.log('File selected:', selectedFile.name);
        }
    };

    /**
     * Handles the actual upload process (e.g., sending to a server).
     */
    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        // In a real application, you would use an API call (e.g., with fetch or axios)
        // to send the file to your backend server here.
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Example: Replace with your actual API endpoint
            // const response = await fetch('/api/upload', {
            //   method: 'POST',
            //   body: formData,
            // });
            // const data = await response.json();
            console.log('Uploading file:', file.name);
            alert('File upload simulated! Check console for details.');
            setFile(null); // Clear the selection after "upload"
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed.');
        }
    };

    return (
        <div>
            <h3>Upload File</h3>
            {/* The file input element */}
            <input
                type="file"
                onChange={handleFileChange}
            />

            {/* Display selected file info and an upload button */}
            {file && (
                <div>
                    <p>Selected file: {file.name}</p>
                    <button onClick={handleUpload}>
                        Upload File
                    </button>
                </div>
            )}
        </div>
    );
};

function TestPage() {
    return (
        <div className="app-container">
            <main className="main-content">
                <section className="weather-section" aria-labelledby="weather-heading">
                    <div className="card">
                        <div className="section-header">
                            <FileUpload />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="app-footer">
                <nav aria-label="Footer navigation">
                    <a href="https://aspire.dev" target="_blank" rel="noopener noreferrer">
                        Learn more about Aspire<span className="visually-hidden"> (opens in new tab)</span>
                    </a>
                    <a
                        href="https://github.com/dotnet/aspire"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="github-link"
                        aria-label="View Aspire on GitHub (opens in new tab)"
                    >
                        <img src="/github.svg" alt="" width="24" height="24" aria-hidden="true" />
                        <span className="visually-hidden">GitHub</span>
                    </a>
                </nav>
            </footer>
        </div>
    )
}

export default TestPage
