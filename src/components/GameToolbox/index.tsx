import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { GripHorizontal } from 'lucide-react';
import { ToolboxContent } from './ToolboxContent';
import { ToolboxPopup } from './ToolboxPopup';
import { useToolboxStore } from './toolboxStore';
import { tools } from './tools';

interface Position {
  x: number;
  y: number;
}

export function GameToolbox() {
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const { activeToolId, setActiveToolId } = useToolboxStore();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TOOLBOX',
    item: { type: 'TOOLBOX', x: position.x, y: position.y },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [position]);

  const handleDrag = (e: DragEvent) => {
    if (!isDragging || !e.clientX || !e.clientY) return;
    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - 48, e.clientX)),
      y: Math.max(0, Math.min(window.innerHeight - tools.length * 48, e.clientY)),
    });
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('drag', handleDrag);
      return () => window.removeEventListener('drag', handleDrag);
    }
  }, [isDragging]);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          opacity: isDragging ? 0.5 : 1,
          zIndex: 50,
        }}
        className="w-12 bg-gray-800/95 text-white rounded-lg shadow-lg overflow-hidden flex flex-col"
      >
        <div 
          ref={drag}
          className="p-3 border-b border-gray-700 cursor-move flex justify-center"
        >
          <GripHorizontal size={18} className="text-gray-400" />
        </div>
        <ToolboxContent />
      </div>

      {activeToolId && (
        <ToolboxPopup
          toolId={activeToolId}
          onClose={() => setActiveToolId(null)}
        />
      )}
    </>
  );
}