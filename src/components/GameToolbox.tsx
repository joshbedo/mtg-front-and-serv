import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { 
  GripHorizontal, 
  Dice1, 
  Plus, 
  Settings,
  Sword,
  Shield,
  Heart,
  Eye,
  RotateCcw,
  Search,
  Trash2
} from 'lucide-react';
import { DiceRoll } from './DiceRoll';
import { TokenCreator } from './TokenCreator';

interface Position {
  x: number;
  y: number;
}

interface Tool {
  id: string;
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

export function GameToolbox() {
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 }); // Updated initial position
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const tools: Tool[] = [
    { 
      id: 'dice', 
      icon: <Dice1 size={20} />, 
      label: 'Roll Dice',
      action: () => setActiveToolId('dice')
    },
    { 
      id: 'token', 
      icon: <Plus size={20} />, 
      label: 'Create Token',
      action: () => setActiveToolId('token')
    },
    { 
      id: 'counter', 
      icon: <Shield size={20} />, 
      label: 'Add Counter',
      action: () => setActiveToolId('counter')
    },
    { 
      id: 'life', 
      icon: <Heart size={20} />, 
      label: 'Life Total',
      action: () => setActiveToolId('life')
    },
    { 
      id: 'view', 
      icon: <Eye size={20} />, 
      label: 'View Library',
      action: () => setActiveToolId('view')
    },
    { 
      id: 'untap', 
      icon: <RotateCcw size={20} />, 
      label: 'Untap All',
      action: () => setActiveToolId('untap')
    },
    { 
      id: 'search', 
      icon: <Search size={20} />, 
      label: 'Search Library',
      action: () => setActiveToolId('search')
    },
    { 
      id: 'clear', 
      icon: <Trash2 size={20} />, 
      label: 'Clear Battlefield',
      action: () => setActiveToolId('clear')
    }
  ];

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
          zIndex: 50, // Ensure it's above the battlefield but below modals
        }}
        className="w-12 bg-gray-800/95 text-white rounded-lg shadow-lg overflow-hidden flex flex-col"
      >
        <div 
          ref={drag}
          className="p-3 border-b border-gray-700 cursor-move flex justify-center"
        >
          <GripHorizontal size={18} className="text-gray-400" />
        </div>

        <div className="flex flex-col">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={tool.action}
              onMouseEnter={() => setShowTooltip(tool.label)}
              onMouseLeave={() => setShowTooltip(null)}
              className={`p-3 hover:bg-gray-700 relative group transition-colors ${
                activeToolId === tool.id ? 'bg-gray-700' : ''
              }`}
            >
              <div className="text-gray-300 group-hover:text-white">
                {tool.icon}
              </div>
              {showTooltip === tool.label && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-[60]">
                  {tool.label}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {activeToolId && (
        <div 
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800/95 p-4 rounded-lg shadow-lg z-[100]"
          style={{ minWidth: '300px' }}
        >
          {activeToolId === 'dice' && <DiceRoll />}
          {activeToolId === 'token' && <TokenCreator />}
          <button 
            onClick={() => setActiveToolId(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}