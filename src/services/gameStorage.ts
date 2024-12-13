import { socket } from './socket';

// Storage keys
const STORAGE_KEYS = {
  ROOM_ID: 'currentRoomId',
  USER_ID: 'userId',
  USER_NAME: 'userName',
  GAME_STATE: 'gameState',
  LOBBY_STATE: 'lobbyState'
};

// Game storage service
export const gameStorage = {
  // Room management
  setRoomId: (roomId: string) => {
    localStorage.setItem(STORAGE_KEYS.ROOM_ID, roomId);
    // Also emit a join event to ensure socket room membership
    socket.emit('game:join', { roomId });
  },

  getRoomId: () => localStorage.getItem(STORAGE_KEYS.ROOM_ID),

  clearRoomId: () => localStorage.removeItem(STORAGE_KEYS.ROOM_ID),

  // User management
  setUserId: (userId: string) => localStorage.setItem(STORAGE_KEYS.USER_ID, userId),

  getUserId: () => localStorage.getItem(STORAGE_KEYS.USER_ID),

  setUserName: (name: string) => localStorage.setItem(STORAGE_KEYS.USER_NAME, name),

  getUserName: () => localStorage.getItem(STORAGE_KEYS.USER_NAME),

  // Game state
  saveGameState: (state: any) => {
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
  },

  getGameState: () => {
    const state = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    return state ? JSON.parse(state) : null;
  },

  // Lobby state
  saveLobbyState: (state: any) => {
    localStorage.setItem(STORAGE_KEYS.LOBBY_STATE, JSON.stringify(state));
  },

  getLobbyState: () => {
    const state = localStorage.getItem(STORAGE_KEYS.LOBBY_STATE);
    return state ? JSON.parse(state) : null;
  },

  // Clear all game data
  clearGameData: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },

  // Initialize from storage
  initializeFromStorage: () => {
    const userId = gameStorage.getUserId();
    const userName = gameStorage.getUserName();
    const roomId = gameStorage.getRoomId();
    const gameState = gameStorage.getGameState();
    const lobbyState = gameStorage.getLobbyState();

    return {
      userId,
      userName,
      roomId,
      gameState,
      lobbyState
    };
  }
};