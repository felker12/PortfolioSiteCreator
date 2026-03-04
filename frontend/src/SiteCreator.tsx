import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './App.css'



export default function SiteCreator() {
    const location = useLocation();
    const file = location.state?.file as File | undefined;


    return (
        <div className="app-container">
            <header className="app-header">
                <h2>Site Creator for: {file?.name}</h2>
                <Link to="/file-selection">File Selection Page</Link>
            </header>

            <main className="main-content" style={{ alignItems: 'flex-start', paddingTop: '1rem' }} >
                <section className="weather-section" aria-labelledby="weather-heading">
                    <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
                        <h3>Site Creator Content</h3>
                    </div>
                </section>
            </main>

            <footer style={{ padding: 12, borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <small>Generated with SiteCreator</small>
            </footer>
        </div>
    );
}