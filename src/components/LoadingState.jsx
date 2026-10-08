import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';

const phrases = [
  'Analyzing the target role...',
  'Mapping skill dependencies...',
  'Finding realistic stepping stones...',
  'Building your path...'
];

export default function LoadingState() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % phrases.length), 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-orb" />
      <div className="loading-icon"><BrainCircuit size={28} /></div>
      <div className="loading-spinner" />
      <h2>Reverse-engineering your target...</h2>
      <p>{phrases[index]}</p>
      <div className="ai-note"><Sparkles size={14} /> Personalized career guidance is being assembled.</div>
    </div>
  );
}
