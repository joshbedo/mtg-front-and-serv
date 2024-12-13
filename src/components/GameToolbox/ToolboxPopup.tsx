import React from 'react';
import { DiceRoll } from '../DiceRoll';
import { TokenCreator } from '../TokenCreator';

interface ToolboxPopupProps {
  toolId: string;
  onClose: () => void;
}

export function ToolboxPopup({ toolId, onClose }: ToolboxPopupProps) {
  return (
    <div 
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800/95 p-4 rounded-lg shadow-lg z-[100]"
      style={{ minWidth: '300px' }}
    >
      {toolId === 'dice' && <DiceRoll />}
      {toolId === 'token' && <TokenCreator />}
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}