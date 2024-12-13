import { useCallback } from 'react';
import { useBattlefieldStore } from '../store/battlefieldStore';
import { socket } from '../services/socket';
import { gameStorage } from '../services/gameStorage';
import { DragItem } from '../types/drag';

export function useBattlefieldDrop() {
  const { addCard, removeFromHand, moveCard, cards } = useBattlefieldStore();

  return useCallback((item: DragItem, position: { x: number, y: number }) => {
    const roomId = gameStorage.getRoomId();

    if (item.isOnBattlefield && item.battlefieldId) {
      // Just move the existing card
      moveCard(item.battlefieldId, position.x, position.y);
      
      if (roomId) {
        socket.emit('game:cardMoved', {
          roomId,
          cardId: item.battlefieldId,
          position
        });
      }
    } else if (item.isInHand && item.handId) {
      // Check if card already exists on battlefield by oracle ID
      const existingCard = cards.find(c => c.oracleId === item.oracle_id);
      
      if (!existingCard) {
        // Only add if card doesn't exist
        const cardId = addCard(item, position.x, position.y, false);
        removeFromHand(item.handId);

        if (roomId) {
          socket.emit('game:cardPlayed', {
            roomId,
            card: item,
            position,
            tapped: false,
            cardId,
            playerName: 'Player'
          });
        }
      } else {
        // If card exists, just move it
        moveCard(existingCard.id, position.x, position.y);
        
        if (roomId) {
          socket.emit('game:cardMoved', {
            roomId,
            cardId: existingCard.id,
            position
          });
        }
      }
    }
  }, [addCard, removeFromHand, moveCard, cards]);
}