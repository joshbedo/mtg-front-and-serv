import { Card } from './card';
import { Phase, Player } from './game';

export interface User {
  id: string;
  name: string;
  isReady: boolean;
}

export interface LobbyPlayer extends User {
  position: Player;
}

export interface GameState {
  currentPhase: Phase;
  currentPlayer: Player;
  battlefield: BattlefieldCard[];
  life: Record<number, number>;
}

export interface BattlefieldCard {
  id: string;
  card: Card;
  x: number;
  y: number;
  tapped: boolean;
  ownerId: string;
}

export interface Lobby {
  id: string;
  name: string;
  host: string;
  players: LobbyPlayer[];
  maxPlayers: number;
  isStarted: boolean;
  gameState?: GameState;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}