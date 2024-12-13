import { StateCreator } from 'zustand';
import { BattlefieldState, BattlefieldActions } from './types';
import { playDrawSound } from '../../utils/audioUtils';
import { socket } from '../../services/socket';
import { gameStorage } from '../../services/gameStorage';
import { useLobbyStore } from '../lobbyStore';

export const createHandActions: StateCreator<
  BattlefieldState & BattlefieldActions,
  [],
  [],
  Pick<BattlefieldActions, 'drawHand' | 'drawCard' | 'clearHand' | 'removeFromHand' | 'setHandMinimized'>
> = (set, get) => ({
  drawHand: (deck) => {
    if (!deck?.length) return;

    const fullDeck = deck.flatMap(card => 
      Array(card.quantity || 1).fill(0).map(() => ({
        ...card,
        id: crypto.randomUUID()
      }))
    );
    
    const shuffledDeck = [...fullDeck].sort(() => Math.random() - 0.5);
    const hand = shuffledDeck.slice(0, 7);
    const remainingCards = shuffledDeck.slice(7);
    
    const { currentUser } = useLobbyStore.getState();
    if (!currentUser) return;

    set({
      hand,
      remainingCards,
      handCounts: {
        ...get().handCounts,
        [currentUser.id]: 7
      }
    });
    
    const roomId = gameStorage.getRoomId();
    if (roomId) {
      socket.emit('game:handUpdate', {
        roomId,
        playerId: currentUser.id,
        count: 7,
        playerName: currentUser.name
      });
    }
    
    playDrawSound();
  },

  drawCard: () => {
    const { remainingCards, hand } = get();
    if (!remainingCards?.length) return;
    
    const [drawnCard, ...remaining] = remainingCards;
    const { currentUser } = useLobbyStore.getState();
    if (!currentUser) return;
    
    set({
      hand: [...hand, drawnCard],
      remainingCards: remaining,
      handCounts: {
        ...get().handCounts,
        [currentUser.id]: (get().handCounts[currentUser.id] || 0) + 1
      }
    });

    const roomId = gameStorage.getRoomId();
    if (roomId) {
      socket.emit('game:handUpdate', {
        roomId,
        playerId: currentUser.id,
        count: hand.length + 1,
        playerName: currentUser.name
      });
    }
    
    playDrawSound();
  },

  clearHand: () => {
    const { currentUser } = useLobbyStore.getState();
    if (!currentUser) return;
    
    set({
      hand: [],
      remainingCards: [],
      handCounts: {
        ...get().handCounts,
        [currentUser.id]: 0
      }
    });

    const roomId = gameStorage.getRoomId();
    if (roomId) {
      socket.emit('game:handUpdate', {
        roomId,
        playerId: currentUser.id,
        count: 0,
        playerName: currentUser.name
      });
    }
  },

  removeFromHand: (handId) => {
    set((state) => ({
      hand: state.hand.filter((c) => c.id !== handId),
    }));
  },

  setHandMinimized: (minimized) => set({ isHandMinimized: minimized }),
});