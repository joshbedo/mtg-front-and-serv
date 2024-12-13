import React from 'react';
import { Player } from '../../types/game';

interface PlayerAvatarsProps {
  players: Player[];
}

export function PlayerAvatars({ players }: PlayerAvatarsProps) {
  if (!players?.length) return null;

  return (
    <div className="flex -space-x-2">
      {players.map((player) => (
        <div
          key={player.id}
          className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm border-2 border-gray-800"
          title={player.name}
        >
          {player.name?.[0]?.toUpperCase() || '?'}
        </div>
      ))}
    </div>
  );
}