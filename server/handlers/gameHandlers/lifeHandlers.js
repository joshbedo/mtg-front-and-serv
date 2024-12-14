export const handleLifeActions = (io, socket) => {
  socket.on("game:life", ({ roomId, playerId, life, delta, playerName }) => {
    io.to(roomId).emit("game:lifeChanged", {
      playerId,
      life,
      delta,
      playerName,
    });
  });
};
