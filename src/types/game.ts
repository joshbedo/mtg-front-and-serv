export type Position = 'top' | 'right' | 'bottom' | 'left';

export type Phase = 
  | 'Beginning'
  | 'Main 1'
  | 'Combat'
  | 'Main 2'
  | 'End';

export interface Player {
  id: string;
  name: string;
  position: Position | null;
  isReady: boolean;
}

export interface GameState {
  roomId: string;
  players: Player[];
  currentPlayer: string | null;
  currentPhase: Phase;
  battlefield: BattlefieldCard[];
}

export interface BattlefieldCard {
  id: string;
  ownerId: string;
  card: Card;
  position: {
    x: number;
    y: number;
  };
  tapped: boolean;
}

export interface Target {
  type: 'player' | 'card';
  id: string;
  name: string;
}