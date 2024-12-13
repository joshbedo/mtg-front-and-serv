import React from 'react';
import { useGameStore } from '../store/gameStore';

export function PhaseIndicator() {
  const { currentPhase, currentPlayer } = useGameStore();
  
  const getPhaseDisplay = (phase: string) => {
    switch (phase) {
      case 'Main 1':
        return 'First Main';
      case 'Main 2':
        return 'Second Main';
      default:
        return phase;
    }
  };
  
  return (
    <div className="fixed top-20 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
      <div className="text-sm font-medium">Player {currentPlayer}'s Turn</div>
      <div className="text-lg font-bold">{getPhaseDisplay(currentPhase)}</div>
    </div>
  );
}