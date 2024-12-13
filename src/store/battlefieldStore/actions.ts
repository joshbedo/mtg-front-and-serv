import { StateCreator } from 'zustand';
import { BattlefieldState, BattlefieldActions } from './types';
import { playDrawSound, playCardPlaySound } from '../../utils/audioUtils';
import { useLobbyStore } from '../lobbyStore';
import { socket } from '../../services/socket';

export const createBattlefieldActions: StateCreator<
  BattlefieldState & BattlefieldActions,
  [],
  [],
  BattlefieldActions
> = (set, get) => ({
  drawHand: (deck) => {
    if (!deck?.length) return;

    // Create full deck array with proper quantities
    const fullDeck = deck.flatMap(card => 
      Array(card.quantity || 1).fill(0).map(() => ({
        ...card,
        id: crypto.randomUUID()
      }))
    );
    
    // Shuffle and draw initial hand
    const shuffledDeck = [...fullDeck].sort(() => Math.random() - 0.5);
    const hand = shuffledDeck.slice(0, 7);
    const remainingCards = shuffledDeck.slice(7);

    // Update local state
    set({
      hand,
      remainingCards,
      handCounts: {
        ...get().handCounts,
        [useLobbyStore.getState().currentUser?.id || '']: 7
      }
    });
    
    playDrawSound();
  },

  // ... rest of the actions remain the same
});