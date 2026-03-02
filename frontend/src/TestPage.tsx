<script src="http://localhost:8097"></script>
import { useState, useEffect } from 'react'
import './App.css'
import FileUpload from './FileUpload';

function TestPage() {
    return (
        <div className="app-container">
            <main className="main-content">
                <section className="weather-section" aria-labelledby="weather-heading">
                    <div className="card">
                        <div className="section-header">
                            <FileUpload
                                uploadUrl="/api/upload"
                                multiple={false}
                                maxSizeMB={10}
                                showPreview={true}
                            />
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
