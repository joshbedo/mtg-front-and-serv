import React from 'react';
import { Play } from 'lucide-react';
import { useLobbyStore } from '../../store/lobbyStore';

interface LobbyActionsProps {
  isHost: boolean;
  canStart: boolean;
}

export function LobbyActions({ isHost, canStart }: LobbyActionsProps) {
  const startGame = useLobbyStore(state => state.startGame);

  if (!isHost) return null;

  return (
    <div className="flex justify-end">
      <button
        onClick={startGame}
        disabled={!canStart}
        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg font-medium"
      >
        <Play size={24} />
        Start Game
      </button>
    </div>
  );
}