import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoadingState from './components/LoadingState';
import RoadmapView from './components/RoadmapView';
import { generateRoadmap } from './utils/aiService';
import { initialNodes, initialEdges } from './utils/mockData';

export default function App() {
  const [appState, setAppState] = useState('landing'); // 'landing', 'loading', 'roadmap', 'error'
  const [roadmapData, setRoadmapData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStart = async (formData) => {
    setAppState('loading');
    setErrorMsg('');
    
    try {
  const data = await generateRoadmap(formData);
  setRoadmapData(data);
  setAppState('roadmap');
} catch (error) {
  console.warn("Gemini unavailable, using demo roadmap:", error);

  setRoadmapData({
    nodes: initialNodes,
    edges: initialEdges
  });

  setAppState('roadmap');
}
    
  };

  const handleDemo = () => {
    setAppState('loading');
    // Load the mock data after a fake delay to show the loading screen
    setTimeout(() => {
      setRoadmapData({ nodes: initialNodes, edges: initialEdges });
      setAppState('roadmap');
    }, 1500);
  };

  return (
    <div className="app-wrapper">
      {appState === 'landing' && <LandingPage onSubmit={handleStart} onDemo={handleDemo} />}
      
      {appState === 'loading' && <LoadingState />}
      
      {appState === 'error' && (
        <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>
          <h2 style={{ color: '#ef4444' }}>Something went wrong</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>{errorMsg}</p>
          <button className="btn btn-secondary" style={{ marginTop: '24px' }} onClick={() => setAppState('landing')}>
            Try Again
          </button>
        </div>
      )}

      {appState === 'roadmap' && (
        <RoadmapView data={roadmapData} onBack={() => setAppState('landing')} />
      )}
    </div>
  );
}