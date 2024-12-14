// import { nanoid } from 'nanoid';
// import { lobbyManager } from './services/lobbyManager.js';

// const gameRooms = new Map();

// const POSITIONS = ['bottom', 'left', 'top', 'right'];

// export function createGameRoom(roomId, name) {
//   console.log(roomId, name, 'createGameRoom');
//   const lobby = lobbyManager.createLobby(roomId, name, socketId);
//   if (!lobby) return null;

//   return lobby;

//   // const gameState = {
//   //   roomId,
//   //   name,
//   //   players: [],
//   //   currentPlayer: null,
//   //   currentPhase: 'Beginning',
//   //   battlefield: [],
//   //   status: 'waiting',
//   //   maxPlayers: 4
//   // };
  
//   // gameRooms.set(roomId, gameState);
//   // return gameState;
// }

// export function getAvailableLobbies() {
//   return lobbyManager.getAvailableLobbies();
//   // return Array.from(gameRooms.values())
//   //   .filter(game => game.status === 'waiting' && game.players.length < 4)
//   //   .map(game => ({
//   //     id: game.roomId,
//   //     name: game.name,
//   //     players: game.players,
//   //     host: game.players[0]?.id,
//   //     maxPlayers: game.maxPlayers
//   //   }));
// }

// export function joinGameRoom(roomId, player) {
//   // check if player is already in the lobby
//   const lobby = lobbyManager.getLobby(roomId);
//   const players = lobby?.players;
//   if (players?.some(p => p.id === player.id)) return lobby;

//   const joinedLobby = lobbyManager.joinLobby(roomId, player);
//   if (!joinedLobby) return null;

//   return joinedLobby;

//   // const gameState = gameRooms.get(roomId);
//   // if (!gameState) return null;
  
//   // if (gameState.players.length >= gameState.maxPlayers) return null;

//   // // Check if player is already in the room
//   // const existingPlayer = gameState.players.find(p => p.id === player.id);
//   // if (existingPlayer) return gameState;

//   // // Assign next available position
//   // player.position = POSITIONS[gameState.players.length];
  
//   // gameState.players.push(player);
  
//   // // First player becomes current player
//   // if (!gameState.currentPlayer) {
//   //   gameState.currentPlayer = player.id;
//   // }

//   // return gameState;
// }

// export function leaveGameRoom(roomId, playerId) {
//   const lobby = lobbyManager.leaveLobby(roomId, playerId);
//   if (!lobby) return null;

//   return lobby;

//   // const gameState = gameRooms.get(roomId);
//   // if (!gameState) return null;

//   // const playerIndex = gameState.players.findIndex(p => 
//   //   p.id === playerId || p.socketId === playerId
//   // );
  
//   // if (playerIndex === -1) return gameState;

//   // // Remove player
//   // gameState.players.splice(playerIndex, 1);
  
//   // // Reassign positions after player leaves
//   // gameState.players.forEach((p, i) => {
//   //   p.position = POSITIONS[i];
//   // });

//   // // Update current player if needed
//   // if (gameState.currentPlayer === playerId && gameState.players.length > 0) {
//   //   gameState.currentPlayer = gameState.players[0].id;
//   // }

//   // // Remove empty rooms
//   // if (gameState.players.length === 0) {
//   //   gameRooms.delete(roomId);
//   //   return null;
//   // }

//   // return gameState;
// }

// export function getGameState(roomId) {
//   // return gameRooms.get(roomId);
//   return lobbyManager.getLobby(roomId);
// }

// export function updateGameState(roomId, update) {
//   const lobby = lobbyManager.updateLobby(roomId, update);
//   if (!lobby) return null;

//   return lobby;

//   // const gameState = gameRooms.get(roomId);
//   // if (!gameState) return null;

//   // Object.assign(gameState, update);
//   // return gameState;
// }

// // Cleanup stale game rooms every minute
// setInterval(() => {
//   lobbyManager.cleanupStaleLobbies();
//   console.log('cleanupStaleLobbies');
//   // for (const [roomId, gameState] of gameRooms.entries()) {
//   //   if (gameState.players.length === 0) {
//   //     gameRooms.delete(roomId);
//   //   }
//   // }
// }, 60000);