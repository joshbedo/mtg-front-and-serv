import { create } from 'zustand';
import { Card, DeckCard } from '../types/card';
import { useChatStore } from './chatStore';
import { playDrawSound, playCardPlaySound } from '../utils/audioUtils';
import { useLobbyStore } from './lobbyStore';
import { socket } from '../services/socket';
import { gameStorage } from '../services/gameStorage';

interface BattlefieldState {
  cards: Array<{
    id: string;
    card: Card;
    x: number;
    y: number;
    tapped: boolean;
    counters: Array<{ id: string; count: number }>;
    isShaking?: boolean;
  }>;
  hand: DeckCard[];
  graveyard: Array<Card & { pileId: string }>;
  exile: Array<Card & { pileId: string }>;
  selectedPile: 'graveyard' | 'exile' | null;
  remainingCards: DeckCard[];
  isHandMinimized: boolean;
  handCounts: Record<string, number>;
}

export const useBattlefieldStore = create<BattlefieldState & {
  drawHand: (deck: DeckCard[]) => void;
  drawCard: () => void;
  clearHand: () => void;
  setHandMinimized: (minimized: boolean) => void;
  addCard: (card: Card, x: number, y: number, tapped?: boolean) => string;
  moveCard: (id: string, x: number, y: number) => void;
  toggleTapped: (id: string) => void;
  removeCard: (id: string) => void;
  removeFromHand: (handId: string) => void;
  addToGraveyard: (card: Card & { pileId: string }) => void;
  addToExile: (card: Card & { pileId: string }) => void;
  setSelectedPile: (pile: 'graveyard' | 'exile' | null) => void;
  initializeCounter: (cardId: string, count: number) => void;
  addCounter: (cardId: string, counterId: string) => void;
  removeCounter: (cardId: string, counterId: string) => void;
  shakeCard: (cardId: string) => void;
}>((set, get) => ({
  cards: [],
  hand: [],
  graveyard: [],
  exile: [],
  selectedPile: null,
  remainingCards: [],
  isHandMinimized: false,
  handCounts: {},

  drawHand: (deck) => {
    if (!deck?.length) return;

    const fullDeck = deck.flatMap(card => 
      Array(card.quantity).fill(0).map(() => ({
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
  },

  setHandMinimized: (minimized) => set({ isHandMinimized: minimized }),

  addCard: (card, x, y, tapped = false) => {
    const cardId = crypto.randomUUID();
    playCardPlaySound();
    
    set((state) => ({
      cards: [...state.cards, { 
        id: cardId, 
        card, 
        x, 
        y, 
        tapped, 
        counters: [] 
      }],
    }));

    return cardId;
  },

  moveCard: (id, x, y) => set((state) => ({
    cards: state.cards.map((c) => (c.id === id ? { ...c, x, y } : c)),
  })),

  toggleTapped: (id) => set((state) => ({
    cards: state.cards.map((c) => (c.id === id ? { ...c, tapped: !c.tapped } : c)),
  })),

  removeCard: (id) => set((state) => ({
    cards: state.cards.filter((c) => c.id !== id),
  })),

  removeFromHand: (handId) => set((state) => ({
    hand: state.hand.filter((c) => c.id !== handId),
  })),

  addToGraveyard: (card) => set((state) => ({
    graveyard: [...state.graveyard, card]
  })),

  addToExile: (card) => set((state) => ({
    exile: [...state.exile, card]
  })),

  setSelectedPile: (pile) => set({ selectedPile: pile }),

  initializeCounter: (cardId, count) => set((state) => ({
    cards: state.cards.map((c) => 
      c.id === cardId 
        ? { ...c, counters: [{ id: crypto.randomUUID(), count }] }
        : c
    ),
  })),

  addCounter: (cardId, counterId) => set((state) => ({
    cards: state.cards.map((c) => 
      c.id === cardId 
        ? {
            ...c,
            counters: c.counters.map((counter) =>
              counter.id === counterId
                ? { ...counter, count: counter.count + 1 }
                : counter
            ),
          }
        : c
    ),
  })),

  removeCounter: (cardId, counterId) => set((state) => ({
    cards: state.cards.map((c) => 
      c.id === cardId 
        ? {
            ...c,
            counters: c.counters.map((counter) =>
              counter.id === counterId && counter.count > 0
                ? { ...counter, count: counter.count - 1 }
                : counter
            ).filter((counter) => counter.count > 0),
          }
        : c
    ),
  })),

  shakeCard: (cardId) => {
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === cardId ? { ...c, isShaking: true } : c
      ),
    }));

    setTimeout(() => {
      set((state) => ({
        cards: state.cards.map((c) =>
          c.id === cardId ? { ...c, isShaking: false } : c
        ),
      }));
    }, 820); // Match shake animation duration
  },
}));