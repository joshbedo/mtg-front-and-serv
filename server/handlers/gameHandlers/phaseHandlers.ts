import { Server, Socket } from 'socket.io';
import { Phase } from '../../types/game';

export const handlePhaseActions = (io: Server, socket: Socket) => {
  socket.on('game:phaseChange', ({ roomId, phase, playerName }: { roomId: string; phase: Phase; playerName: string }) => {
    socket.to(roomId).emit('game:phaseChanged', { phase });
    io.to(roomId).emit('game:action', {
      text: `${playerName} moved to ${phase} phase`,
      type: 'phase',
      timestamp: Date.now(),
      playerName
    });
  });
};