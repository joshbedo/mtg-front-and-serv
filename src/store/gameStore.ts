import { create } from 'zustand';
import { Phase, Player, GameState, Target } from '../types/game';
import { useChatStore } from './chatStore';
import { Card } from '../types/card';
import { playTurnSound } from '../utils/audioUtils';
import { socket } from '../services/socket';

const PHASES: Phase[] = [
  'Beginning',
  'Main 1',
  'Combat',
  'Main 2',
  'End'
];

interface GameStore {
  roomId: string | null;
  players: Player[];
  currentPlayer: string | null;
  currentPhase: Phase;
  phases: Phase[];
  life: Record<string, number>;
  targeting: {
    sourceId: string | null;
    sourceName: string | null;
    sourceCard: Card | null;
    target: Target | null;
  };
  setGameState: (state: Partial<GameState>) => void;
  nextPhase: () => void;
  setPhase: (phase: Phase) => void;
  updateLife: (playerId: string, newLife: number) => void;
  startTargeting: (sourceId: string, sourceName: string, sourceCard: Card) => void;
  setTarget: (target: Target & { card?: Card }) => void;
  cancelTargeting: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  roomId: null,
  players: [],
  currentPlayer: null,
  currentPhase: 'Beginning',
  phases: PHASES,
  life: {},
  targeting: {
    sourceId: null,
    sourceName: null,
    sourceCard: null,
    target: null
  },

  setGameState: (state) => {
    set((current) => {
      // Initialize life totals for new players
      const newLife = { ...current.life };
      if (state.players) {
        state.players.forEach(player => {
          if (!newLife[player.id]) {
            newLife[player.id] = 20;
          }
        });
      }

      return {
        ...current,
        ...state,
        life: state.life || newLife
      };
    });
  },

  updateLife: (playerId, newLife) => {
    set(state => ({
      life: {
        ...state.life,
        [playerId]: newLife
      }
    }));
  },

  // ... rest of the store implementation
}));

// Socket event listeners
socket.on('game:state', (state: GameState) => {
  useGameStore.getState().setGameState(state);
});

socket.on('game:lifeChanged', ({ playerId, life }) => {
  useGameStore.getState().updateLife(playerId, life);
});