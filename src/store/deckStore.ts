import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DeckCard } from '../types/card';
import { useChatStore } from './chatStore';

interface Deck {
  id: string;
  name: string;
  cards: DeckCard[];
}

interface DeckStore {
  decks: Deck[];
  currentDeck: Deck | null;
  addDeck: (name: string) => void;
  deleteDeck: (id: string) => void;
  setCurrentDeck: (deckId: string) => void;
  addCard: (card: DeckCard) => void;
  removeCard: (cardId: string) => void;
  updateQuantity: (cardId: string, quantity: number) => void;
}

export const useDeckStore = create<DeckStore>()(
  persist(
    (set, get) => ({
      decks: [],
      currentDeck: null,
      addDeck: (name) => {
        useChatStore.getState().addMessage(`Player 4 created a new deck: ${name}`);
        set((state) => ({
          decks: [
            ...state.decks,
            { id: crypto.randomUUID(), name, cards: [] },
          ],
        }));
      },
      deleteDeck: (id) => {
        const deck = get().decks.find(d => d.id === id);
        if (deck) {
          useChatStore.getState().addMessage(`Player 4 deleted deck: ${deck.name}`);
        }
        set((state) => ({
          decks: state.decks.filter(deck => deck.id !== id),
          currentDeck: state.currentDeck?.id === id ? null : state.currentDeck
        }));
      },
      setCurrentDeck: (deckId) => {
        const deck = get().decks.find((d) => d.id === deckId);
        if (deck) {
          const cardCount = deck.cards.reduce((sum, card) => sum + card.quantity, 0);
          useChatStore.getState().addMessage(`Player 4 selected deck: ${deck.name} (${cardCount} cards)`);
        }
        set((state) => ({
          currentDeck: state.decks.find((deck) => deck.id === deckId) || null,
        }));
      },
      addCard: (card) =>
        set((state) => {
          if (!state.currentDeck) return state;
          const existingCard = state.currentDeck.cards.find((c) => c.id === card.id);
          const updatedCards = existingCard
            ? state.currentDeck.cards.map((c) =>
                c.id === card.id ? { ...c, quantity: c.quantity + 1 } : c
              )
            : [...state.currentDeck.cards, { ...card, quantity: 1 }];
          
          useChatStore.getState().addMessage(`Player 4 added ${card.name} to deck ${state.currentDeck.name}`);
          
          const updatedDeck = { ...state.currentDeck, cards: updatedCards };
          return {
            currentDeck: updatedDeck,
            decks: state.decks.map((d) =>
              d.id === updatedDeck.id ? updatedDeck : d
            ),
          };
        }),
      removeCard: (cardId) =>
        set((state) => {
          if (!state.currentDeck) return state;
          const card = state.currentDeck.cards.find((c) => c.id === cardId);
          if (card) {
            useChatStore.getState().addMessage(`Player 4 removed ${card.name} from deck ${state.currentDeck.name}`);
          }
          const updatedCards = state.currentDeck.cards.filter((c) => c.id !== cardId);
          const updatedDeck = { ...state.currentDeck, cards: updatedCards };
          return {
            currentDeck: updatedDeck,
            decks: state.decks.map((d) =>
              d.id === updatedDeck.id ? updatedDeck : d
            ),
          };
        }),
      updateQuantity: (cardId, quantity) =>
        set((state) => {
          if (!state.currentDeck) return state;
          const card = state.currentDeck.cards.find((c) => c.id === cardId);
          if (card) {
            useChatStore.getState().addMessage(`Player 4 updated quantity of ${card.name} to ${quantity} in deck ${state.currentDeck.name}`);
          }
          const updatedCards = state.currentDeck.cards.map((card) =>
            card.id === cardId ? { ...card, quantity } : card
          );
          const updatedDeck = { ...state.currentDeck, cards: updatedCards };
          return {
            currentDeck: updatedDeck,
            decks: state.decks.map((d) =>
              d.id === updatedDeck.id ? updatedDeck : d
            ),
          };
        }),
    }),
    {
      name: 'mtg-decks',
    }
  )
);