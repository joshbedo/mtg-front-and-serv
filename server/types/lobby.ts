import { Player } from './player';
import { GameState } from './game';

export interface Lobby {
  id: string;
  name: string;
  host: string;
  players: Player[];
  maxPlayers: number;
  isStarted: boolean;
  lastActivity: number;
  gameState?: GameState;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
  type?: 'chat' | 'system' | 'game';
}