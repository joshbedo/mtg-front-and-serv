import { Server, Socket } from 'socket.io';
import { HandUpdateEvent } from '../../types/events';

export const handleDeckActions = (io: Server, socket: Socket) => {
  socket.on('game:handUpdate', ({ roomId, playerId, count, playerName }: HandUpdateEvent) => {
    // Broadcast hand count update to other players
    socket.to(roomId).emit('game:handUpdate', {
      playerId,
      count,
      playerName
    });

    // Send game action for drawing cards
    if (count === 7) {
      io.to(roomId).emit('game:action', {
        text: `${playerName} drew a new hand`,
        type: 'card',
        timestamp: Date.now(),
        playerName
      });
    } else {
      io.to(roomId).emit('game:action', {
        text: `${playerName} drew a card`,
        type: 'card',
        timestamp: Date.now(),
        playerName
      });
    }
  });
};