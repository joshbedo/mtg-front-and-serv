import { getGameState, updateGameState } from '../gameState.js';

export const handleGameActions = (io, socket) => {
  // ... existing handlers ...

  socket.on('game:handUpdate', ({ roomId, playerId, count, playerName }) => {
    const gameState = getGameState(roomId);
    if (!gameState) return;

    // Update hand count in game state
    if (!gameState.handCounts) gameState.handCounts = {};
    gameState.handCounts[playerId] = count;
    updateGameState(roomId, gameState);

    // Broadcast hand count update to all players in room
    io.to(roomId).emit('game:handUpdated', {
      playerId,
      count,
      playerName
    });
  });

  // ... rest of the handlers ...
};