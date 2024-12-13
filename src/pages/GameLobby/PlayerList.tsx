import React from 'react';
import { Crown, CheckCircle2, User } from 'lucide-react';
import { LobbyPlayer, User as UserType } from '../../types/lobby';
import { useLobbyStore } from '../../store/lobbyStore';

interface PlayerListProps {
  players: LobbyPlayer[];
  currentUser: UserType;
  hostId: string;
}

export function PlayerList({ players, currentUser, hostId }: PlayerListProps) {
  const setReady = useLobbyStore(state => state.setReady);
  const currentPlayer = players.find(p => p.id === currentUser.id);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Players</h2>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => {
          const player = players[i];
          const isHost = player?.id === hostId;
          const isCurrent = player?.id === currentUser.id;

          return (
            <div
              key={i}
              className="flex items-center justify-between bg-gray-700/50 rounded-lg p-4"
            >
              {player ? (
                <>
                  <div className="flex items-center gap-3">
                    {isHost ? (
                      <Crown className="text-yellow-400" size={20} />
                    ) : (
                      <User className="text-gray-400" size={20} />
                    )}
                    <span className="text-white font-medium">
                      {player.name}
                      {isCurrent && " (You)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {player.isReady && (
                      <CheckCircle2 className="text-green-400" size={20} />
                    )}
                    {isCurrent && (
                      <button
                        onClick={() => setReady(!currentPlayer?.isReady)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          currentPlayer?.isReady
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {currentPlayer?.isReady ? 'Ready' : 'Not Ready'}
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-gray-500">Waiting for player...</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}