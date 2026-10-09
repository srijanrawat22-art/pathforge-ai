import React, { useState } from 'react';
import { ArrowRight, Route, Sparkles, Target, Zap } from 'lucide-react';

export default function LandingPage({ onSubmit, onDemo }) {
  const [form, setForm] = useState({
    role: '',
    company: '',
    knownSkills: '',
    education: '',
    currentYear: '',
    hoursPerWeek: '10',
    targetTimeline: 'Flexible'
  });

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const setExample = (role, company) => {
    setForm(prev => ({ ...prev, role, company }));
  };

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
        <div className="nav-pill">
          <Sparkles size={14} /> AI-powered roadmap builder
        </div>
      </header>

      <main className="container landing-content">
        <section className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Reverse-engineer the path, not the guesswork
          </div>

          <h1 className="landing-title">
            Build a career path that{' '}
            <span>actually moves you forward.</span>
          </h1>

          <p className="landing-subtitle">
            Tell PathForge where you want to go and where you stand today.
            Get a personalized sequence of skills, projects and checkpoints.
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
              <div className="form-kicker">Personalize your journey</div>
              <h2>Where are you trying to go?</h2>
            </div>
            <div className="mini-ai-badge"><Sparkles size={14} /> AI</div>
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              onSubmit({
                ...form,
                hoursPerWeek: Number(form.hoursPerWeek)
              });
            }}
          >
            <div className="input-group">
              <label className="input-label">Target Role</label>
              <div className="input-wrap">
                <Target size={17} />
                <input
                  className="input-field"
                  required
                  value={form.role}
                  placeholder="e.g. ML Engineer"
                  onChange={e => updateField('role', e.target.value)}
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
                  placeholder="e.g. Fintech startup, NVIDIA"
                  onChange={e => updateField('company', e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Current Education</label>
              <select
                className="input-field"
                required
                value={form.education}
                onChange={e => updateField('education', e.target.value)}
              >
                <option value="">Select your current education</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
                <option value="Diploma">Diploma</option>
                <option value="Undergraduate / BTech / BE">
                  Undergraduate / BTech / BE
                </option>
                <option value="Graduate">Graduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Working professional">
                  Working professional
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Current Year / Semester</label>
              <input
                className="input-field"
                required
                value={form.currentYear}
                placeholder="e.g. Class 12, BTech 2nd year, Semester 3"
                onChange={e => updateField('currentYear', e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Current Skills</label>
              <div className="input-wrap">
                <Zap size={17} />
                <input
                  className="input-field"
                  value={form.knownSkills}
                  placeholder="e.g. Python, Java, SQL; or None"
                  onChange={e => updateField('knownSkills', e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                Available Study Hours per Week
              </label>
              <input
                className="input-field"
                type="number"
                min="1"
                max="80"
                required
                value={form.hoursPerWeek}
                onChange={e => updateField('hoursPerWeek', e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Target Timeline</label>
              <select
                className="input-field"
                value={form.targetTimeline}
                onChange={e => updateField('targetTimeline', e.target.value)}
              >
                <option value="Flexible">Flexible</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="1 year">1 year</option>
                <option value="2 years">2 years</option>
                <option value="3+ years">3+ years</option>
              </select>
            </div>

            <div className="example-row">
              <span>Quick start:</span>
              <button
                type="button"
                onClick={() => setExample('ML Engineer', 'Fintech Startup')}
              >
                ML Engineer
              </button>
              <button
                type="button"
                onClick={() => setExample('Backend Developer', 'SaaS Startup')}
              >
                Backend Developer
              </button>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-main">
                <Zap size={18} /> Build My Path <ArrowRight size={17} />
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onDemo}
              >
                <Route size={18} /> Try Demo
              </button>
            </div>

            <div className="ai-note">
              <Sparkles size={14} />
              AI-generated guidance. Verify requirements against real job postings.
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