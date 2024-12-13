import React from 'react';
import { useBattlefieldStore } from '../../store/battlefieldStore';
import { useGameStore } from '../../store/gameStore';
import { useLobbyStore } from '../../store/lobbyStore';
import { PlayerHand } from './PlayerHand';
import { OpponentHand } from './OpponentHand';

export function Hand() {
  const hand = useBattlefieldStore((state) => state.hand);
  const isHandMinimized = useBattlefieldStore((state) => state.isHandMinimized);
  const handCounts = useBattlefieldStore((state) => state.handCounts);
  const { currentUser } = useLobbyStore();
  const { players } = useGameStore();

  // Debug log to verify hand contents
  console.log('Current hand:', hand);
  
  if (!currentUser) return null;

  return (
    <>
      {/* Player's hand */}
      {hand.length > 0 && (
        <PlayerHand 
          hand={hand}
          isMinimized={isHandMinimized}
        />
      )}

      {/* Opponent hands */}
      {players
        .filter(p => p.id !== currentUser.id && handCounts[p.id] > 0)
        .map(player => (
          <OpponentHand 
            key={player.id}
            player={player}
            cardCount={handCounts[player.id] || 0}
          />
        ))}
    </>
  );
}