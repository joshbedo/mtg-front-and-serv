import { Server, Socket } from 'socket.io';
import { Card } from '../../types/card';
import { Target } from '../../types/game';

export const handleTargetingActions = (io: Server, socket: Socket) => {
  socket.on('game:targeting', ({ 
    roomId, 
    sourceId, 
    sourceName,
    sourceCard,
    playerName 
  }: {
    roomId: string;
    sourceId: string;
    sourceName: string;
    sourceCard: Card;
    playerName: string;
  }) => {
    socket.to(roomId).emit('game:targetingStarted', {
      sourceId,
      sourceName,
      sourceCard
    });
  });

  socket.on('game:targetSelected', ({
    roomId,
    sourceId,
    sourceName,
    sourceCard,
    target,
    playerName
  }: {
    roomId: string;
    sourceId: string;
    sourceName: string;
    sourceCard: Card;
    target: Target;
    playerName: string;
  }) => {
    io.to(roomId).emit('game:action', {
      text: `${playerName} targeted ${target.name} with ${sourceName}`,
      type: 'card',
      timestamp: Date.now(),
      card: sourceCard,
      targetCard: target.card,
      playerName
    });
  });
};