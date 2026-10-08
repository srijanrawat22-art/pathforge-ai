import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckCircle2, Circle, Target } from 'lucide-react';

export default function CustomNode({ data }) {
  const isCompleted = data.status === 'completed';
  const isTarget = data.status === 'target';

  return (
    <div style={{
      background: 'rgba(18, 18, 21, 0.95)',
      backdropFilter: 'blur(8px)',
      border: `1px solid ${isTarget ? 'var(--accent-brand)' : isCompleted ? '#22c55e' : 'var(--border-strong)'}`,
      padding: '16px 20px',
      borderRadius: '12px',
      minWidth: '240px',
      color: 'var(--text-primary)',
      boxShadow: isTarget 
        ? '0 0 25px rgba(59, 130, 246, 0.25)' 
        : isCompleted 
        ? '0 0 20px rgba(34, 197, 94, 0.15)' 
        : '0 8px 24px rgba(0,0,0,0.5)',
      transition: 'all 200ms ease'
    }}>
      <Handle type="target" position={Position.Top} style={{ background: '#71717a', border: 'none', width: '8px', height: '8px' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        {isTarget ? <Target size={18} color="var(--accent-brand)" /> :
         isCompleted ? <CheckCircle2 size={18} color="#22c55e" /> :
         <Circle size={18} color="var(--text-muted)" />}
        <strong style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '-0.01em', lineHeight: '1.3' }}>{data.title}</strong>
      </div>
      
      <div style={{ fontSize: '11px', color: isCompleted ? '#22c55e' : 'var(--text-secondary)', paddingLeft: '28px', fontWeight: '500' }}>
        {data.duration}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#71717a', border: 'none', width: '8px', height: '8px' }} />
    </div>
  );
}