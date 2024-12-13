import { useDeckStore } from '../../store/deckStore';
import { useBattlefieldStore } from '../../store/battlefieldStore';
import { useLobbyStore } from '../../store/lobbyStore';
import { socket } from '../../services/socket';
import { gameStorage } from '../../services/gameStorage';

export function useDrawHandlers(onClose: () => void) {
  const currentDeck = useDeckStore((state) => state.currentDeck);
  const { drawHand, drawCard, clearHand, remainingCards } = useBattlefieldStore();
  const { currentUser } = useLobbyStore();

  const handleDrawHand = () => {
    if (!currentDeck?.cards?.length) {
      console.warn('No deck or empty deck');
      return;
    }
    
    if (!currentUser) {
      console.warn('No current user');
      return;
    }

    const roomId = gameStorage.getRoomId();
    if (!roomId) {
      console.warn('No room ID in storage');
      return;
    }

    // Draw hand locally
    drawHand(currentDeck.cards);
    
    // Emit hand update
    socket.emit('game:handUpdate', {
      roomId,
      playerId: currentUser.id,
      count: 7,
      playerName: currentUser.name
    });

    onClose();
  };

  const handleDrawCard = () => {
    if (!remainingCards?.length || !currentUser) return;
    
    const roomId = gameStorage.getRoomId();
    if (!roomId) return;

    drawCard();
    
    socket.emit('game:handUpdate', {
      roomId,
      playerId: currentUser.id,
      count: remainingCards.length - 1,
      playerName: currentUser.name
    });

    onClose();
  };

  const handleClearHand = () => {
    if (!currentUser) return;
    
    const roomId = gameStorage.getRoomId();
    if (!roomId) return;

    clearHand();
    
    socket.emit('game:handUpdate', {
      roomId,
      playerId: currentUser.id,
      count: 0,
      playerName: currentUser.name
    });

    onClose();
  };

  return {
    handleDrawHand,
    handleDrawCard,
    handleClearHand,
    currentDeck,
    remainingCards
  };
}