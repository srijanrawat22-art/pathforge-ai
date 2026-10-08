import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckCircle2, Circle, Target } from 'lucide-react';

export default function CustomNode({ data }) {
  const isCompleted = data.status === 'completed';
  const isTarget = data.status === 'target';

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: `1px solid ${isTarget ? 'var(--accent-brand)' : isCompleted ? '#22c55e' : 'var(--border-strong)'}`,
      padding: '16px',
      borderRadius: 'var(--radius-md)',
      minWidth: '220px',
      color: 'var(--text-primary)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    }}>
      <Handle type="target" position={Position.Top} style={{ background: '#71717a', border: 'none' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        {isTarget ? <Target size={18} color="var(--accent-brand)" /> :
         isCompleted ? <CheckCircle2 size={18} color="#22c55e" /> :
         <Circle size={18} color="var(--text-muted)" />}
        <strong style={{ fontSize: '14px', lineHeight: '1.2' }}>{data.title}</strong>
      </div>
      
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        {data.duration}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#71717a', border: 'none' }} />
    </div>
  );
}