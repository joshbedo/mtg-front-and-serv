import { StateCreator } from 'zustand';
import { BattlefieldState, BattlefieldActions } from './types';
import { playCardPlaySound } from '../../utils/audioUtils';
import { socket } from '../../services/socket';
import { gameStorage } from '../../services/gameStorage';
import { useLobbyStore } from '../lobbyStore';

export const createCardActions: StateCreator<
  BattlefieldState & BattlefieldActions,
  [],
  [],
  Pick<BattlefieldActions, 'addCard' | 'moveCard' | 'toggleTapped' | 'removeCard'>
> = (set, get) => ({
  addCard: (card, x, y, tapped = false) => {
    // Check if card already exists by oracle ID
    const existingCard = get().cards.find(c => c.oracleId === card.oracle_id);
    if (existingCard) {
      // If card exists, just move it
      get().moveCard(existingCard.id, x, y);
      return existingCard.id;
    }

    const cardId = crypto.randomUUID();
    const { currentUser } = useLobbyStore.getState();
    const roomId = gameStorage.getRoomId();

    playCardPlaySound();
    
    set((state) => ({
      cards: [...state.cards, { 
        id: cardId,
        oracleId: card.oracle_id || cardId, // Use oracle ID if available, fallback to generated ID
        card, 
        x, 
        y, 
        tapped, 
        counters: [] 
      }],
    }));

    if (roomId && currentUser) {
      socket.emit('game:cardPlayed', {
        roomId,
        card,
        position: { x, y },
        tapped,
        cardId,
        playerName: currentUser.name
      });
    }

    return cardId;
  },

  moveCard: (id, x, y) => {
    const roomId = gameStorage.getRoomId();
    
    set((state) => ({
      cards: state.cards.map((c) => (c.id === id ? { ...c, x, y } : c)),
    }));

    if (roomId) {
      socket.emit('game:cardMoved', {
        roomId,
        cardId: id,
        position: { x, y }
      });
    }
  },

  toggleTapped: (id) => {
    const roomId = gameStorage.getRoomId();
    const { currentUser } = useLobbyStore.getState();
    
    set((state) => {
      const card = state.cards.find(c => c.id === id);
      const updatedCards = state.cards.map((c) => 
        c.id === id ? { ...c, tapped: !c.tapped } : c
      );

      if (roomId && currentUser && card) {
        socket.emit('game:cardTapped', {
          roomId,
          cardId: id,
          tapped: !card.tapped,
          playerName: currentUser.name
        });
      }

      return { cards: updatedCards };
    });
  },

  removeCard: (id) => {
    const roomId = gameStorage.getRoomId();
    
    set((state) => ({
      cards: state.cards.filter((c) => c.id !== id),
    }));

    if (roomId) {
      socket.emit('game:cardRemoved', {
        roomId,
        cardId: id
      });
    }
  },
});