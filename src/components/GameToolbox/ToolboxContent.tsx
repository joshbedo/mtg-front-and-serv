import React, { useState } from 'react';
import { useToolboxStore } from './toolboxStore';
import { tools } from './tools';

export function ToolboxContent() {
  const { activeToolId, setActiveToolId } = useToolboxStore();
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setActiveToolId(tool.id)}
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
  );
}