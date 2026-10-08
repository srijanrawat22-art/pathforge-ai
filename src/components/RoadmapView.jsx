import React, { useState, useEffect } from 'react';
import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CheckCircle2, Zap, Target, ArrowRight } from 'lucide-react';

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

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  // Dynamic Skill State Update & Critical Path Recalculation
  const handleMarkComplete = (nodeId) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              status: node.data.status === 'completed' ? 'pending' : 'completed',
              duration: node.data.status === 'completed' ? '2 weeks' : 'Completed'
            }
          };
        }
        return node;
      })
    );

    // Keep side panel updated
    setSelectedNode((prev) => {
      if (!prev || prev.id !== nodeId) return prev;
      const isNowCompleted = prev.data.status !== 'completed';
      return {
        ...prev,
        data: {
          ...prev.data,
          status: isNowCompleted ? 'completed' : 'pending',
          duration: isNowCompleted ? 'Completed' : '2 weeks'
        }
      };
    });
  };

  // Calculate Metrics
  const totalMilestones = nodes.filter((n) => n.data.status !== 'target').length;
  const completedMilestones = nodes.filter((n) => n.data.status === 'completed').length;
  const remainingMilestones = totalMilestones - completedMilestones;
  const progressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  // Build Critical Path Chain
  const criticalPathString = nodes
    .filter((n) => n.data.status !== 'completed')
    .map((n) => n.data.title)
    .slice(0, 4)
    .join(' → ');

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      
      {/* TOP HEADER BAR: CRITICAL PATH & METRICS */}
      <div style={{
        position: 'absolute', top: 16, left: 16, right: 16, zIndex: 10,
        background: 'rgba(24, 24, 27, 0.85)', backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-lg)',
        padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onBack} style={{ padding: '8px 14px', fontSize: '13px' }}>
            ← Back
          </button>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Critical Path
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} color="#3b82f6" />
              {criticalPathString || "All Milestones Completed!"}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Progress</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#22c55e' }}>
              {progressPercent}% ({remainingMilestones} remaining)
            </div>
          </div>
          
          <div style={{ width: '100px', height: '6px', background: 'var(--bg-base)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: '#22c55e', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      </div>

      {/* REACT FLOW GRAPH CANVAS */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        colorMode="dark"
      >
        <Background color="#3f3f46" gap={16} />
        <Controls style={{ background: 'var(--bg-surface)', fill: 'var(--text-primary)' }} />
      </ReactFlow>

      {/* ACTIONABLE SIDE PANEL */}
      {selectedNode && (
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '360px',
          background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-strong)',
          padding: '24px', zIndex: 20, color: 'var(--text-primary)', boxShadow: '-6px 0 20px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column'
        }}>
          <button 
            onClick={() => setSelectedNode(null)} 
            style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}
          >
            ✕
          </button>
          
          <h3 style={{ marginTop: '0', marginBottom: '8px', fontSize: '1.25rem' }}>{selectedNode.data.title}</h3>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'fit-content', padding: '4px 10px', background: 'var(--bg-base)', borderRadius: '4px', fontSize: '12px', marginBottom: '20px', border: '1px solid var(--border-subtle)' }}>
            Status: <strong style={{ color: selectedNode.data.status === 'completed' ? '#22c55e' : '#eab308' }}>
              {selectedNode.data.status.toUpperCase()}
            </strong>
          </div>
          
          <div style={{ background: 'var(--bg-base)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
            <h4 style={{ marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} color="#3b82f6" /> Actionable Proof-of-Work
            </h4>
            <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-muted)' }}>
              Build a portfolio project centered around <strong>{selectedNode.data.title}</strong>. Document your deployment and trade-offs in a public GitHub repository.
            </p>
          </div>

          <div style={{ background: 'var(--bg-base)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Target size={14} color="#eab308" /> Interview Checkpoint
            </h4>
            <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-muted)' }}>
              "What architecture choices or common edge cases did you navigate when applying {selectedNode.data.title}?"
            </p>
          </div>
          
          <div style={{ flexGrow: 1 }}></div>
          
          <button 
            className={`btn ${selectedNode.data.status === 'completed' ? 'btn-secondary' : 'btn-primary'}`} 
            style={{ width: '100%' }} 
            onClick={() => handleMarkComplete(selectedNode.id)}
          >
            {selectedNode.data.status === 'completed' ? 'Mark as Need to Learn' : 'Already Know This / Mark Complete'}
          </button>
        </div>
      )}
    </div>
  );
}