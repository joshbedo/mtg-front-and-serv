export const handlePhaseActions = (io, socket) => {
  socket.on('game:phaseChange', ({ roomId, phase, playerName }) => {
    socket.to(roomId).emit('game:phaseChanged', { phase });
    io.to(roomId).emit('game:action', {
      text: `${playerName} moved to ${phase} phase`,
      type: 'phase',
      timestamp: Date.now(),
      playerName
    });
  });
};
