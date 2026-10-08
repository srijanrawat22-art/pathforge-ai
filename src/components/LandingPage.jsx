import React, { useState } from 'react';
import { ArrowRight, Route, Sparkles, Target, Zap } from 'lucide-react';

export default function LandingPage({ onSubmit, onDemo }) {
  
const [form, setForm] = useState({
  role: '',
  company: '',
  knownSkills: ''
});
  const setExample = (role, company) => setForm({ role, company });
<div className="input-group">
  <label className="input-label">Current Skills</label>

  <div className="input-wrap">
    <Zap size={17} />

    <input
      className="input-field"
      value={form.knownSkills}
      placeholder="e.g. Python, Java, SQL"
      onChange={e =>
        setForm({
          ...form,
          knownSkills: e.target.value
        })
      }
    />
  </div>
</div>
  return (
    <div className="landing-shell">
      <div className="landing-orb landing-orb-one" />
      <div className="landing-orb landing-orb-two" />

      <header className="site-nav container">
        <div className="brand">
          <div className="brand-mark"><Route size={18} /></div>
          <div>
            <div className="brand-name">PathForge AI</div>
            <div className="brand-tag">Career intelligence</div>
          </div>
        </div>
        <div className="nav-pill"><Sparkles size={14} /> AI-powered roadmap builder</div>
      </header>

      <main className="container landing-content">
        <section className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> Reverse-engineer the path, not the guesswork</div>
          <h1 className="landing-title">Build a career path that <span>actually moves you forward.</span></h1>
          <p className="landing-subtitle">
            Tell PathForge where you want to go. Get a focused sequence of skills, projects and checkpoints designed around the role you want.
          </p>

          <div className="hero-proof-row">
            <div className="proof-chip"><Target size={15} /> Role-specific</div>
            <div className="proof-chip"><Route size={15} /> Dependency-aware</div>
            <div className="proof-chip"><Zap size={15} /> Action-focused</div>
          </div>
        </section>

        <section className="landing-form-card">
          <div className="card-glow" />
          <div className="form-heading">
            <div>
              <div className="form-kicker">Start with the destination</div>
              <h2>Where are you trying to go?</h2>
            </div>
            <div className="mini-ai-badge"><Sparkles size={14} /> AI</div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
            <div className="input-group">
              <label className="input-label">Target Role</label>
              <div className="input-wrap">
                <Target size={17} />
                <input
                  className="input-field"
                  required
                  value={form.role}
                  placeholder="e.g. ML Engineer, Product Designer"
                  onChange={e => setForm({ ...form, role: e.target.value })}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Target Company Type</label>
              <div className="input-wrap">
                <Route size={17} />
                <input
                  className="input-field"
                  required
                  value={form.company}
                  placeholder="e.g. Fintech startup, FAANG"
                  onChange={e => setForm({ ...form, company: e.target.value })}
                />
              </div>
            </div>

            <div className="example-row">
              <span>Quick start:</span>
              <button type="button" onClick={() => setExample('ML Engineer', 'Fintech Startup')}>ML Engineer</button>
              <button type="button" onClick={() => setExample('Backend Developer', 'SaaS Startup')}>Backend Developer</button>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-main">
                <Zap size={18} /> Build My Path <ArrowRight size={17} />
              </button>
              <button type="button" className="btn btn-secondary" onClick={onDemo}>
                <Route size={18} /> Try Demo
              </button>
            </div>

            <div className="ai-note">
              <Sparkles size={14} /> AI-generated guidance. Use job postings as the final reality check.
            </div>
          </form>
        </section>
      </main>

      <footer className="landing-footer container">
        <span>PathForge AI</span>
        <span>Turn ambition into a sequence of achievable moves.</span>
      </footer>
    </div>
  );
}
