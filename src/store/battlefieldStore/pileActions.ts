import { StateCreator } from 'zustand';
import { BattlefieldState, BattlefieldActions } from './types';
import { socket } from '../../services/socket';
import { gameStorage } from '../../services/gameStorage';

export const createPileActions: StateCreator<
  BattlefieldState & BattlefieldActions,
  [],
  [],
  Pick<BattlefieldActions, 'addToGraveyard' | 'addToExile' | 'setSelectedPile'>
> = (set) => ({
  addToGraveyard: (card, sourceId) => {
    const pileId = crypto.randomUUID();
    const roomId = gameStorage.getRoomId();
    
    set((state) => ({
      graveyard: [...state.graveyard, { ...card, pileId }]
    }));

    if (roomId) {
      socket.emit('game:cardToGraveyard', {
        roomId,
        card,
        pileId,
        sourceId
      });
    }
  },

  addToExile: (card, sourceId) => {
    const pileId = crypto.randomUUID();
    const roomId = gameStorage.getRoomId();
    
    set((state) => ({
      exile: [...state.exile, { ...card, pileId }]
    }));

    if (roomId) {
      socket.emit('game:cardExiled', {
        roomId,
        card,
        pileId,
        sourceId
      });
    }
  },

  setSelectedPile: (pile) => set({ selectedPile: pile }),
});