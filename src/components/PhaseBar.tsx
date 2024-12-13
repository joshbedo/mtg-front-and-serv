import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Phase } from '../types/game';
import { ArrowRight } from 'lucide-react';

export function PhaseBar() {
  const { currentPhase, currentPlayer, phases, setPhase, players } = useGameStore();
  const isCurrentPlayersTurn = currentPlayer === 4;

  // Show waiting message if less than 2 players
  if (players.length < 2) {
    return (
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
        <div className="w-full h-1 bg-gray-800/90 flex items-center justify-center">
          <div className="bg-gray-800 -my-3 px-4 py-2 rounded-md">
            <span className="text-gray-400 text-sm font-medium">
              Waiting for players...
            </span>
          </div>
        </div>
      </div>
    );
  }

  const getPhaseDisplay = (phase: Phase) => {
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
    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
      <div className="w-full h-1 bg-gray-800/90 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-gray-800 -my-3 px-3 py-1 rounded-md">
          <span className="text-white text-sm font-medium">
            Player {currentPlayer}'s turn
          </span>
        </div>
        
        <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2 bg-gray-800/90 -my-3 px-3 py-1 rounded-md">
          {phases.map((phase, index) => (
            <React.Fragment key={phase}>
              <button
                onClick={() => isCurrentPlayersTurn && setPhase(phase)}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  currentPhase === phase
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:text-white'
                } ${
                  isCurrentPlayersTurn
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed opacity-50'
                } transition-all duration-200`}
                disabled={!isCurrentPlayersTurn}
              >
                {getPhaseDisplay(phase)}
              </button>
              {index < phases.length - 1 && (
                <ArrowRight className="text-gray-400" size={12} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}