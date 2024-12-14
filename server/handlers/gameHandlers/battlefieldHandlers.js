export const handleBattlefieldActions = (io, socket) => {
  socket.on(
    "game:cardPlayed",
    ({ roomId, card, position, tapped, cardId, playerName }) => {
      // Broadcast to all other players in the room
      console.log("emitting card played", {
        roomId,
        card,
        position,
        tapped,
        cardId,
        playerName,
      });
      
      socket.to(roomId).emit("game:cardPlayed", {
        card,
        position,
        tapped,
        cardId,
        playerName,
      });

      // Send game action to all players including sender
      io.to(roomId).emit("game:action", {
        text: `${playerName} played ${card.name}`,
        type: "card",
        timestamp: Date.now(),
        card,
        playerName,
      });
    }
  );

  socket.on("game:cardMoved", ({ roomId, cardId, position }) => {
    socket.to(roomId).emit("game:cardMoved", { cardId, position });
  });

  socket.on("game:cardTapped", ({ roomId, cardId, tapped, playerName }) => {
    socket.to(roomId).emit("game:cardTapped", { cardId, tapped });
    io.to(roomId).emit("game:action", {
      text: `${playerName} ${tapped ? "tapped" : "untapped"} ${cardId}`,
      type: "card",
      timestamp: Date.now(),
      playerName,
    });
  });

  socket.on(
    "game:cardCounter",
    ({ roomId, cardId, count, playerName, card }) => {
      socket.to(roomId).emit("game:cardCounter", { cardId, count });
      io.to(roomId).emit("game:action", {
        text: `${playerName} ${count > 0 ? "added" : "removed"} a counter ${
          count > 0 ? "to" : "from"
        } ${card.name}`,
        type: "card",
        timestamp: Date.now(),
        card,
        playerName,
      });
    }
  );
};
