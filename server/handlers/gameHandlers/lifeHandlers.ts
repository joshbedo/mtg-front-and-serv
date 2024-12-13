import { Server, Socket } from 'socket.io';

export const handleLifeActions = (io: Server, socket: Socket) => {
  socket.on('game:life', ({ roomId, playerId, life, delta, playerName }) => {
    io.to(roomId).emit('game:lifeChanged', {
      playerId,
      life,
      delta,
      playerName
    });
  });
};