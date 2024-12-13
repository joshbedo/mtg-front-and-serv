import { Card } from './card';
import { Phase, Target } from './game';
import { Player } from './player';

export interface CardPlayedEvent {
  roomId: string;
  card: Card;
  position: { x: number; y: number };
  tapped: boolean;
  cardId: string;
  playerName: string;
}

export interface CardMovedEvent {
  roomId: string;
  cardId: string;
  position: { x: number; y: number };
}

export interface CardCounterEvent {
  roomId: string;
  cardId: string;
  count: number;
  playerName: string;
  card: Card;
}

export interface HandUpdateEvent {
  roomId: string;
  playerId: string;
  count: number;
  playerName: string;
}

export interface LifeChangeEvent {
  roomId: string;
  playerId: string;
  life: number;
  delta: number;
  playerName: string;
}

export interface PhaseChangeEvent {
  roomId: string;
  phase: Phase;
  playerName: string;
}

export interface TargetingEvent {
  roomId: string;
  sourceId: string;
  sourceName: string;
  sourceCard: Card;
  target?: Target;
  playerName: string;
}