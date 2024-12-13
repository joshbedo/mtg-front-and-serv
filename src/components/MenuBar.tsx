import React from 'react';
import { DiceRoll } from './DiceRoll';

export function MenuBar() {
  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-800/95 shadow-lg z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-4">
          <DiceRoll />
        </div>
      </div>
    </div>
  );
}