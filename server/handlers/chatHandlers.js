export const handleChatActions = (io, socket) => {
  socket.on('game:chat', ({ roomId, text, playerName }) => {
    const message = {
      text,
      playerName,
      timestamp: Date.now(),
      type: 'chat'
    };
    
    // Broadcast chat message to all players in the room
    io.to(roomId).emit('chat:message', message);
  });

  socket.on('game:action', ({ roomId, message }) => {
    // Broadcast game action to all players in the room
    io.to(roomId).emit('game:action', message);
  });

  socket.on('game:life', ({ roomId, playerId, life, delta, playerName }) => {
    // Only broadcast if there was an actual change in life total
    if (delta !== 0) {
      const prevLife = life - delta;
      const action = delta > 0 ? 'gained' : 'lost';
      const message = {
        text: `${playerName} ${action} ${Math.abs(delta)} life (${prevLife} → ${life})`,
        type: 'life',
        timestamp: Date.now(),
        playerName
      };

      // Update life total and send message to all players
      io.to(roomId).emit('game:lifeChanged', {
        playerId,
        life,
        delta,
        playerName
      });

      // Send chat message about life change
      io.to(roomId).emit('chat:message', message);
    }
  });
};