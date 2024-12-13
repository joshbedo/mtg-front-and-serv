import { nanoid } from 'nanoid';
import { createGameRoom, joinGameRoom, leaveGameRoom, getAvailableLobbies } from '../gameState.js';

export const handleLobbyActions = (io, socket) => {
  // Send initial lobbies list when requested
  socket.on('lobbies:list', () => {
    socket.emit('lobbies:update', getAvailableLobbies());
  });

  socket.on('lobby:create', ({ name, player }) => {
    const roomId = nanoid();
    const gameState = createGameRoom(roomId, name);
    
    if (gameState) {
      socket.playerData = { ...player, roomId };
      socket.join(roomId);
      
      const updatedState = joinGameRoom(roomId, { ...player, socketId: socket.id });
      if (updatedState) {
        io.to(roomId).emit('game:state', updatedState);
        io.emit('lobbies:update', getAvailableLobbies());
      }
    }
  });

  socket.on('lobby:join', ({ lobbyId, player }) => {
    const gameState = joinGameRoom(lobbyId, { ...player, socketId: socket.id });
    
    if (gameState) {
      socket.playerData = { ...player, roomId: lobbyId };
      socket.join(lobbyId);
      io.to(lobbyId).emit('game:state', gameState);
      io.to(lobbyId).emit('chat:system', `${player.name} joined the game`);
      io.emit('lobbies:update', getAvailableLobbies());
    } else {
      socket.emit('game:error', 'Failed to join game');
    }
  });

  socket.on('lobby:leave', ({ lobbyId, playerId }) => {
    const gameState = leaveGameRoom(lobbyId, playerId);
    
    if (gameState) {
      socket.leave(lobbyId);
      io.to(lobbyId).emit('game:state', gameState);
      io.to(lobbyId).emit('chat:system', `${socket.playerData?.name} left the game`);
      io.emit('lobbies:update', getAvailableLobbies());
    }
  });

  // Handle disconnects (tab close, browser close, etc)
  socket.on('disconnect', () => {
    if (socket.playerData) {
      const { roomId, id, name } = socket.playerData;
      const gameState = leaveGameRoom(roomId, id);
      
      if (gameState) {
        io.to(roomId).emit('game:state', gameState);
        io.to(roomId).emit('chat:system', `${name} disconnected`);
        io.emit('lobbies:update', getAvailableLobbies());
      }
    }
  });
};