import { nanoid } from 'nanoid';
// import { createGameRoom, joinGameRoom, leaveGameRoom, getAvailableLobbies } from '../gameState.js';
import { lobbyManager } from '../services/lobbyManager.js';

export const handleLobbyActions = (io, socket) => {
  // Send initial lobbies list when requested
  socket.on('lobbies:list', () => {
    socket.emit('lobbies:update', lobbyManager.getAvailableLobbies());
  });

  socket.on('lobby:create', ({ name, player }) => {
    const lobby = lobbyManager.createLobby(name, { ...player, socketId: socket.id });
    console.log(lobby, 'lobby');

    if (lobby) {
      io.to(lobby.id).emit('game:state', lobby);
      io.emit('lobbies:update', lobbyManager.getAvailableLobbies());
    }
    // const roomId = nanoid();
    // const gameState = createGameRoom(roomId, name);
    

    // console.log(gameState, 'gameState');
    
    // if (gameState) {
    //   socket.playerData = { ...player, roomId };
    //   socket.join(roomId);
      
    //   const updatedState = joinGameRoom(roomId, { ...player, socketId: socket.id });
    //   console.log(updatedState, 'updatedState lobby:create');
    //   if (updatedState) {
    //     io.to(roomId).emit('game:state', updatedState);
    //     io.emit('lobbies:update', getAvailableLobbies());
    //   }
    // }
  });

  socket.on('lobby:join', ({ lobbyId, player }) => {
    const lobby = lobbyManager.joinLobby(lobbyId, { ...player, socketId: socket.id });

    if (lobby) {
      socket.join(lobbyId);
      io.to(lobbyId).emit('game:state', lobby);
      io.to(lobbyId).emit('chat:system', `${player.name} joined the game`);
      io.emit('lobbies:update', lobbyManager.getAvailableLobbies());
    }
    // const gameState = joinGameRoom(lobbyId, { ...player, socketId: socket.id });
    
    // if (gameState) {
    //   socket.playerData = { ...player, roomId: lobbyId };
    //   socket.join(lobbyId);
    //   io.to(lobbyId).emit('game:state', gameState);
    //   io.to(lobbyId).emit('chat:system', `${player.name} joined the game`);
    //   io.emit('lobbies:update', getAvailableLobbies());
    // } else {
    //   socket.emit('game:error', 'Failed to join game');
    // }
  });

  socket.on('lobby:leave', ({ lobbyId, playerId }) => {
    const lobby = lobbyManager.leaveLobby(lobbyId, playerId);
    
    if (lobby) {
      socket.leave(lobbyId);
      io.to(lobbyId).emit('game:state', lobby);
      io.to(lobbyId).emit('chat:system', `${socket.playerData?.name} left the game`);
      io.emit('lobbies:update', lobbyManager.getAvailableLobbies());
    }
  });

  // Handle disconnects (tab close, browser close, etc)
  socket.on('disconnect', () => {
    console.log('disconnect');
    // if (socket.playerData) {
    //   const { roomId, id, name } = socket.playerData;
    //   const gameState = lobbyManager.leaveLobby(roomId, id);
      
    //   if (gameState) {
    //     io.to(roomId).emit('game:state', gameState);
    //     io.to(roomId).emit('chat:system', `${name} disconnected`);
    //     io.emit('lobbies:update', getAvailableLobbies());
    //   }
    // }
  });
};