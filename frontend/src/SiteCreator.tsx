import React, { useState, useEffect } from 'react';

type Section = {
  id: string;
  title: string;
  content: string;
}

type SiteData = {
  title: string;
  subtitle?: string;
  theme: 'light' | 'dark';
  sections: Section[];
}

const defaultSite: SiteData = {
  title: 'My Portfolio',
  subtitle: 'A short subtitle about me',
  theme: 'light',
  sections: [
    { id: 'about', title: 'About', content: 'Write something about yourself.' },
    { id: 'projects', title: 'Projects', content: 'List your projects here.' },
  ],
};

function uid(prefix = '') {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

export default function SiteCreator() {
  const [site, setSite] = useState<SiteData>(() => {
    try {
      const cached = localStorage.getItem('siteCreator.data');
      return cached ? (JSON.parse(cached) as SiteData) : defaultSite;
    } catch {
      return defaultSite;
    }
  });

  useEffect(() => {
    localStorage.setItem('siteCreator.data', JSON.stringify(site));
  }, [site]);

  function updateField<K extends keyof SiteData>(key: K, value: SiteData[K]) {
    setSite(prev => ({ ...prev, [key]: value }));
  }

  function updateSection(id: string, patch: Partial<Section>) {
    setSite(prev => ({
      ...prev,
      sections: prev.sections.map(s => (s.id === id ? { ...s, ...patch } : s)),
    }));
  }

  function addSection() {
    const newSection: Section = { id: uid('sec_'), title: 'New Section', content: 'Content...' };
    setSite(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
  }

  function removeSection(id: string) {
    setSite(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id) }));
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(site, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${site.title.replace(/\s+/g, '_').toLowerCase() || 'site'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    setSite(defaultSite);
    localStorage.removeItem('siteCreator.data');
  }

  const themeStyles =
    site.theme === 'dark'
      ? { background: '#1f2937', color: '#e5e7eb' }
      : { background: '#ffffff', color: '#111827' };

  return (
    <div style={{ display: 'flex', gap: 20, padding: 20, fontFamily: 'Segoe UI, Roboto, sans-serif' }}>
      <div style={{ flex: 1, maxWidth: 540 }}>
        <h2>Site Creator</h2>

        <label style={{ display: 'block', marginBottom: 8 }}>
          Title
          <input
            value={site.title}
            onChange={e => updateField('title', e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 8 }}>
          Subtitle
          <input
            value={site.subtitle || ''}
            onChange={e => updateField('subtitle', e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Theme
          <select
            value={site.theme}
            onChange={e => updateField('theme', e.target.value as SiteData['theme'])}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>

        <div style={{ marginBottom: 12 }}>
          <h3>Sections</h3>
          {site.sections.map((s, idx) => (
            <div
              key={s.id}
              style={{
                border: '1px solid #d1d5db',
                padding: 8,
                marginBottom: 8,
                borderRadius: 4,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{idx + 1}. {s.title}</strong>
                <div>
                  <button onClick={() => removeSection(s.id)} style={{ marginLeft: 8 }}>
                    Remove
                  </button>
                </div>
              </div>

              <label style={{ display: 'block', marginTop: 8 }}>
                Title
                <input
                  value={s.title}
                  onChange={e => updateSection(s.id, { title: e.target.value })}
                  style={{ width: '100%', padding: 6, marginTop: 4 }}
                />
              </label>

              <label style={{ display: 'block', marginTop: 8 }}>
                Content
                <textarea
                  value={s.content}
                  onChange={e => updateSection(s.id, { content: e.target.value })}
                  rows={4}
                  style={{ width: '100%', padding: 6, marginTop: 4 }}
                />
              </label>
            </div>
          ))}

          <div>
            <button onClick={addSection}>Add Section</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={exportJSON}>Export JSON</button>
          <button onClick={reset}>Reset</button>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <h2>Live Preview</h2>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, overflow: 'hidden', ...themeStyles }}>
          <header style={{ padding: 20, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <h1 style={{ margin: 0 }}>{site.title}</h1>
            {site.subtitle && <p style={{ margin: '6px 0 0 0' }}>{site.subtitle}</p>}
          </header>

          <main style={{ padding: 20 }}>
            {site.sections.map(s => (
              <section key={s.id} style={{ marginBottom: 18 }}>
                <h3 style={{ margin: '0 0 6px 0' }}>{s.title}</h3>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{s.content}</p>
              </section>
            ))}
          </main>

          <footer style={{ padding: 12, borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <small>Generated with SiteCreator</small>
          </footer>
        </div>
      </div>
    </div>
  );
}