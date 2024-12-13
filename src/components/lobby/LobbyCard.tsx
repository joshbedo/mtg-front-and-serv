import React from 'react';
import { Users } from 'lucide-react';
import { Lobby } from '../../types/lobby';
import { PlayerAvatars } from './PlayerAvatars';
import { useNavigate } from 'react-router-dom';

interface LobbyCardProps {
  lobby: Lobby;
  onJoin: () => void;
}

export function LobbyCard({ lobby, onJoin }: LobbyCardProps) {
  const navigate = useNavigate();
  const hostPlayer = lobby.players?.find(p => p.id === lobby.host);
  const isFull = lobby.players?.length >= 4;

  const handleJoin = async () => {
    try {
      await onJoin();
      navigate(`/game/${lobby.id}`);
    } catch (error) {
      console.error('Failed to join lobby:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-between group hover:bg-gray-750 transition-colors">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{lobby.name}</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center text-gray-400">
            <Users size={16} className="mr-2" />
            <span>{lobby.players?.length || 0} / 4 players</span>
          </div>
          {hostPlayer && (
            <div className="text-gray-400">
              Host: {hostPlayer.name}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <PlayerAvatars players={lobby.players || []} />
        <button
          onClick={handleJoin}
          disabled={isFull}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Join Game
        </button>
      </div>
    </div>
  );
}