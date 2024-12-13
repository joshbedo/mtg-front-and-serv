import { socket } from './socket';
import { Card } from '../types/card';
import { Phase } from '../types/game';

export const gameActions = {
  // ... existing actions ...

  updateLife: (roomId: string, playerId: string, life: number, delta: number) => {
    socket.emit('game:life', { roomId, playerId, life, delta });
  },

  // ... rest of the actions ...
};