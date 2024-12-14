// import { Server, Socket } from 'socket.io';
// import { Card } from '../../types/card.js';
// import { Target } from '../../types/game.js';

export const handleTargetingActions = (io, socket) => {
  socket.on('game:targeting', ({ 
    roomId, 
    sourceId, 
    sourceName,
    sourceCard,
    playerName
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
