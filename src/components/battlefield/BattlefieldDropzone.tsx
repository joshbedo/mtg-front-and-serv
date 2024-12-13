import React from 'react';
import { useDrop } from 'react-dnd';
import { useBattlefieldDrop } from '../../hooks/useBattlefieldDrop';
import { DragItem } from '../../types/drag';

interface BattlefieldDropzoneProps {
  children: React.ReactNode;
  onDrop: (item: DragItem, position: { x: number, y: number }) => void;
}

export function BattlefieldDropzone({ children, onDrop }: BattlefieldDropzoneProps) {
  const handleDrop = useBattlefieldDrop();
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: DragItem, monitor) => {
      if (!ref.current) return;
      debugger;
      
      const offset = monitor.getClientOffset();
      if (!offset) return;

      const rect = ref.current.getBoundingClientRect();
      const position = {
        x: offset.x - rect.left - 30,
        y: offset.y - rect.top - 41.75
      };

      handleDrop(item, position);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }), [handleDrop]);

  return (
    <div 
      ref={(node) => {
        ref.current = node;
        drop(node);
      }}
      className={`relative ${isOver ? 'bg-blue-500/10' : ''}`}
    >
      {children}
    </div>
  );
}