import { Card, DeckCard } from '../../types/card';

export interface BattlefieldCard {
  id: string;
  oracleId: string; // Add oracle ID for uniqueness tracking
  card: Card;
  x: number;
  y: number;
  tapped: boolean;
  counters: Array<{ id: string; count: number }>;
  isShaking?: boolean;
}

export interface BattlefieldState {
  cards: BattlefieldCard[];
  hand: DeckCard[];
  graveyard: Array<Card & { pileId: string }>;
  exile: Array<Card & { pileId: string }>;
  selectedPile: 'graveyard' | 'exile' | null;
  remainingCards: DeckCard[];
  isHandMinimized: boolean;
  handCounts: Record<string, number>;
}

export interface BattlefieldActions {
  addCard: (card: Card, x: number, y: number, tapped?: boolean) => string;
  moveCard: (id: string, x: number, y: number) => void;
  toggleTapped: (id: string) => void;
  removeCard: (id: string) => void;
  removeFromHand: (handId: string) => void;
  addToGraveyard: (card: Card, sourceId?: string) => void;
  addToExile: (card: Card, sourceId?: string) => void;
  setSelectedPile: (pile: 'graveyard' | 'exile' | null) => void;
  drawHand: (deck: DeckCard[]) => void;
  drawCard: () => void;
  clearHand: () => void;
  setHandMinimized: (minimized: boolean) => void;
}