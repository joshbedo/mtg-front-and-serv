import React from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { Lobby } from '../../types/lobby';

interface LobbyHeaderProps {
  lobby: Lobby;
  onLeave: () => void;
}

export function LobbyHeader({ lobby, onLeave }: LobbyHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{lobby.name}</h1>
        <div className="flex items-center text-gray-400">
          <Users size={16} className="mr-2" />
          <span>{lobby.players.length} / {lobby.maxPlayers} players</span>
        </div>
      </div>
      <button
        onClick={onLeave}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
      >
        <ArrowLeft size={20} />
        Leave Lobby
      </button>
    </div>
  );
}