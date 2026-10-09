import React, { useState, useEffect } from 'react';
import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft, Check, CheckCircle2, Circle, Sparkles, Target, X, Zap } from 'lucide-react';

import CustomNode from './CustomNode';

const nodeTypes = { custom: CustomNode };

export default function RoadmapView({ data, onBack }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (data?.nodes) setNodes(data.nodes);
    if (data?.edges) setEdges(data.edges);
  }, [data]);

  const handleNodeClick = (event, node) => setSelectedNode(node);

  const handleMarkComplete = (nodeId) => {
    setNodes(prevNodes => prevNodes.map(node => {
      if (node.id !== nodeId || node.data.status === 'target') return node;
      const completed = node.data.status !== 'completed';
      return {
        ...node,
        data: {
          ...node.data,
          status: completed ? 'completed' : 'pending',
          
          duration:
  completed
    ? 'Completed'
    : (node.data.originalDuration || '2 weeks')
        }
      };
    }));

    setSelectedNode(prev => {
      if (!prev || prev.id !== nodeId) return prev;
      const completed = prev.data.status !== 'completed';
      return {
        ...prev,
        data: {
          ...prev.data,
          status: completed ? 'completed' : 'pending',
          
          duration:
  completed
    ? 'Completed'
    : (prev.data.originalDuration || '2 weeks')
        }
      };
    });
  };

  const milestones = nodes.filter(n => n.data.status !== 'target');
  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(n => n.data.status === 'completed').length;
  const remainingMilestones = totalMilestones - completedMilestones;
  const progressPercent = totalMilestones ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const criticalPathString = nodes
    .filter(n => n.data.status !== 'completed')
    .map(n => n.data.title)
    .slice(0, 4)
    .join(' → ');

  return (
    <div className="roadmap-shell">
      <div className="roadmap-header glass-panel">
        <div className="roadmap-header-left">
          <button className="icon-btn" onClick={onBack} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="section-label"><Zap size={13} /> Critical path</div>
            <div className="critical-path">{criticalPathString || 'All milestones completed — nice work.'}</div>
          </div>
        </div>

        <div className="progress-block">
          <div className="progress-copy">
            <span>Progress</span>
            <strong>{progressPercent}%</strong>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${progressPercent}%` }} /></div>
          <small>{remainingMilestones} remaining</small>
        </div>
      </div>

      <div className="roadmap-badge"><Sparkles size={14} /> Your path is ready</div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        colorMode="dark"
        minZoom={0.35}
        maxZoom={1.6}
      >
        <Background color="#23232a" gap={20} size={1} />
        <Controls className="flow-controls" />
      </ReactFlow>

      {selectedNode && (
        <aside className="side-panel">
          <div className="side-panel-header">
            <div>
              <div className="section-label"><Circle size={11} /> Milestone details</div>
              <h2>{selectedNode.data.title}</h2>
            </div>
            <button className="icon-btn" onClick={() => setSelectedNode(null)} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className={`status-pill ${selectedNode.data.status === 'completed' ? 'completed' : 'pending'}`}>
            {selectedNode.data.status === 'completed' ? <CheckCircle2 size={14} /> : <Circle size={14} />}
            {selectedNode.data.status === 'completed' ? 'Completed' : 'Pending'}
          </div>

{selectedNode.data.whyItMatters && (
  <div className="detail-card">
    <div className="detail-icon">
      <Sparkles size={15} />
    </div>
    <div>
      <div className="detail-label">Why this matters</div>
      <p>{selectedNode.data.whyItMatters}</p>
    </div>
  </div>
)}

{selectedNode.data.actionPlan && (
  <div className="detail-card">
    <div className="detail-icon">
      <Zap size={15} />
    </div>
    <div>
      <div className="detail-label">Action plan</div>
      <p>{selectedNode.data.actionPlan}</p>
    </div>
  </div>
)}

{selectedNode.data.prerequisites?.length > 0 && (
  <div className="detail-card">
    <div className="detail-icon gold">
      <Target size={15} />
    </div>
    <div>
      <div className="detail-label">Prerequisites</div>
      <p>{selectedNode.data.prerequisites.join(' → ')}</p>
    </div>
  </div>
)}          <div className="detail-card">
            <div className="detail-icon"><Zap size={15} /></div>
            <div>
              <div className="detail-label">Proof of work</div>
              <p>{selectedNode.data.proofOfWork || `Build a portfolio project centered around ${selectedNode.data.title}. Document your decisions and publish it on GitHub.`}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-icon gold"><Target size={15} /></div>
            <div>
              <div className="detail-label">Interview checkpoint</div>
              <p>{selectedNode.data.interviewCheckpoint || `Explain the key trade-offs, architecture choices and edge cases you considered while applying ${selectedNode.data.title}.`}</p>
            </div>
          </div>

          <div className="side-panel-spacer" />

          <button
            className={`btn ${selectedNode.data.status === 'completed' ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => handleMarkComplete(selectedNode.id)}
            disabled={selectedNode.data.status === 'target'}
          >
            {selectedNode.data.status === 'completed' ? <><Circle size={17} /> Mark as Need to Learn</> : <><Check size={17} /> Mark Complete</>}
          </button>
        </aside>
      )}
    </div>
  );
}
