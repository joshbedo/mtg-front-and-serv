import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface LifeTotalProps {
  life: number;
  onLifeChange: (delta: number) => void;
}

export function LifeTotal({ life, onLifeChange }: LifeTotalProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-800/80 rounded-full px-3 py-1.5 text-sm font-medium shadow-lg">
      <button
        onClick={() => onLifeChange(-1)}
        className="text-red-400 hover:text-red-300 transition-colors p-1"
        type="button"
      >
        <Minus size={14} />
      </button>
      <span className="text-white min-w-[2rem] text-center font-bold">
        {life}
      </span>
      <button
        onClick={() => onLifeChange(1)}
        className="text-green-400 hover:text-green-300 transition-colors p-1"
        type="button"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}