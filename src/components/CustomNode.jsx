import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckCircle2, Circle, Target } from 'lucide-react';

export default function CustomNode({ data }) {
  const isCompleted = data.status === 'completed';
  const isTarget = data.status === 'target';

  return (
    <div className={`roadmap-node ${isTarget ? 'is-target' : ''} ${isCompleted ? 'is-completed' : ''}`}>
      <Handle type="target" position={Position.Top} className="node-handle" />

      <div className="node-topline">
        <div className={`node-status-icon ${isTarget ? 'target' : isCompleted ? 'done' : ''}`}>
          {isTarget ? <Target size={16} /> : isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
        </div>
        <div className="node-step">{isTarget ? 'DESTINATION' : 'MILESTONE'}</div>
      </div>

      <div className="node-title">{data.title}</div>
      <div className={`node-duration ${isCompleted ? 'done' : ''}`}>{data.duration}</div>

      <Handle type="source" position={Position.Bottom} className="node-handle" />
    </div>
  );
}
