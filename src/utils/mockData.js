export const initialNodes = [
  { 
    id: '1', 
    position: { x: 250, y: 0 }, 
    data: { title: 'Python & Basic SQL', status: 'completed', duration: 'Already Known' }, 
    type: 'custom' 
  },
  { 
    id: '2', 
    position: { x: 250, y: 120 }, 
    data: { title: 'Machine Learning Mathematics', status: 'pending', duration: '3 weeks' }, 
    type: 'custom' 
  },
  { 
    id: '3', 
    position: { x: 250, y: 240 }, 
    data: { title: 'Model Deployment (FastAPI)', status: 'pending', duration: '2 weeks' }, 
    type: 'custom' 
  },
  { 
    id: '4', 
    position: { x: 250, y: 360 }, 
    data: { title: 'ML Engineer at Fintech Startup', status: 'target', duration: 'Target Goal' }, 
    type: 'custom' 
  }
];

export const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true }
];