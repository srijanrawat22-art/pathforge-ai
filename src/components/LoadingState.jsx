import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const phrases = [
  "Analyzing target role...", 
  "Mapping skill dependencies...", 
  "Finding realistic stepping stones...",
  "Building your path..."
];

export default function LoadingState() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % phrases.length), 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Reverse-engineering your target...</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{phrases[index]}</p>
      
      <div style={{ marginTop: '48px', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <Sparkles size={14} />
        AI-generated guidance — verify with real job postings.
      </div>
    </div>
  );
}