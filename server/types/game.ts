import { Card } from './card';
import { Player } from './player';

export type Phase = 
  | 'Beginning'
  | 'Main 1'
  | 'Combat'
  | 'Main 2'
  | 'End';

export interface Target {
  type: 'player' | 'card';
  id: string;
  name: string;
  card?: Card;
}

export interface BattlefieldCard {
  id: string;
  oracleId: string;
  card: Card;
  x: number;
  y: number;
  tapped: boolean;
  counters: Array<{ id: string; count: number }>;
  isShaking?: boolean;
}

export interface GameState {
  roomId: string;
  players: Player[];
  currentPlayer: string | null;
  currentPhase: Phase;
  life: Record<string, number>;
  battlefield: BattlefieldCard[];
  handCounts: Record<string, number>;
}