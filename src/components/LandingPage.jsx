import React, { useState } from 'react';
import { Route, Zap, Sparkles } from 'lucide-react';

export default function LandingPage({ onSubmit, onDemo }) {
  const [form, setForm] = useState({ role: '', company: '' });

  return (
    <div className="container">
      <header className="landing-hero">
        <h1 className="landing-title">Reverse-engineer your dream career.</h1>
        <p className="landing-subtitle">Tell PathForge where you want to go. AI maps the exact skills and stepping stones to get there.</p>
      </header>
      
      <main className="landing-form-card">
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
          <div className="input-group">
            <label className="input-label">Target Role</label>
            <input 
              className="input-field" required 
              placeholder="e.g. ML Engineer, Frontend Developer" 
              onChange={e => setForm({...form, role: e.target.value})} 
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">Target Company Type</label>
            <input 
              className="input-field" required 
              placeholder="e.g. Fintech Startup, FAANG" 
              onChange={e => setForm({...form, company: e.target.value})} 
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary"><Zap size={18} /> Build My Path</button>
            <button type="button" className="btn btn-secondary" onClick={onDemo}><Route size={18} /> Try Demo</button>
          </div>
          
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Sparkles size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/>
            AI-generated career guidance
          </div>
        </form>
      </main>
    </div>
  );
}