import { useCallback } from 'react';
import { useBattlefieldStore } from '../../store/battlefieldStore';
import { useLobbyStore } from '../../store/lobbyStore';
import { socket } from '../../services/socket';
import { gameStorage } from '../../services/gameStorage';
import { Card } from '../../types/card';

export function usePileActions() {
  const { removeCard, addToGraveyard, addToExile } = useBattlefieldStore();
  const { currentUser } = useLobbyStore();

  const moveCardToPile = useCallback((
    card: Card,
    sourceId: string,
    pileType: 'Graveyard' | 'Exile'
  ) => {
    const roomId = gameStorage.getRoomId();
    if (!roomId || !currentUser) return;

    // Remove from battlefield
    removeCard(sourceId);

    // Add to appropriate pile
    const pileId = crypto.randomUUID();
    if (pileType === 'Graveyard') {
      addToGraveyard({ ...card, pileId });
    } else {
      addToExile({ ...card, pileId });
    }

    // Emit event
    socket.emit(`game:cardTo${pileType}`, {
      roomId,
      card,
      pileId,
      sourceId,
      playerName: currentUser.name
    });
  }, [removeCard, addToGraveyard, addToExile, currentUser]);

  return { moveCardToPile };
}