import { create } from 'zustand';
import { BattlefieldState, BattlefieldActions } from './types';
import { createCardActions } from './cardActions';
import { createHandActions } from './handActions';
import { createPileActions } from './pileActions';

const initialState: BattlefieldState = {
  cards: [],
  hand: [],
  graveyard: [],
  exile: [],
  selectedPile: null,
  remainingCards: [],
  isHandMinimized: false,
  handCounts: {}
};

export const useBattlefieldStore = create<BattlefieldState & BattlefieldActions>((set, get) => ({
  ...initialState,
  ...createCardActions(set, get),
  ...createHandActions(set, get),
  ...createPileActions(set, get)
}));