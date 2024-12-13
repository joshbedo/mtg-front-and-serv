import { create } from 'zustand';
import { socket, waitForConnection } from '../services/socket';
import { Lobby, User, ChatMessage } from '../types/lobby';
import { useGameStore } from './gameStore';
import { useChatStore } from './chatStore';
import { gameStorage } from '../services/gameStorage';

interface LobbyStore {
  currentLobby: Lobby | null;
  availableLobbies: Lobby[];
  currentUser: User | null;
  messages: ChatMessage[];
  setCurrentUser: (user: User) => void;
  createLobby: (name: string) => void;
  joinLobby: (lobbyId: string) => Promise<void>;
  leaveLobby: () => void;
  sendMessage: (text: string) => void;
  setReady: (isReady: boolean) => void;
  startGame: () => void;
  initializeFromStorage: () => void;
}

export const useLobbyStore = create<LobbyStore>((set, get) => ({
  currentLobby: null,
  availableLobbies: [],
  currentUser: null,
  messages: [],
  
  initializeFromStorage: () => {
    const stored = gameStorage.initializeFromStorage();
    if (stored.userId && stored.userName) {
      set({
        currentUser: {
          id: stored.userId,
          name: stored.userName,
          isReady: false
        }
      });
    }
    if (stored.lobbyState) {
      set({ currentLobby: stored.lobbyState });
    }
  },

  setCurrentUser: (user) => {
    set({ currentUser: user });
    gameStorage.setUserId(user.id);
    gameStorage.setUserName(user.name);
    socket.emit('user:update', user);
  },

  createLobby: async (name) => {
    const user = get().currentUser;
    if (!user) return;

    await waitForConnection();

    socket.emit('lobby:create', { 
      name,
      player: {
        id: user.id,
        name: user.name,
        position: 'bottom',
        isReady: false
      }
    });
  },

  joinLobby: async (lobbyId) => {
    const user = get().currentUser;
    if (!user) return;

    await waitForConnection();

    // Save room ID before joining
    gameStorage.setRoomId(lobbyId);

    socket.emit('lobby:join', { 
      lobbyId,
      player: {
        id: user.id,
        name: user.name,
        position: null,
        isReady: false
      }
    });
  },

  leaveLobby: () => {
    const { currentLobby, currentUser } = get();
    if (!currentLobby || !currentUser) return;

    socket.emit('lobby:leave', { 
      lobbyId: currentLobby.id,
      playerId: currentUser.id
    });

    // Clear game data when leaving
    gameStorage.clearGameData();
    set({ currentLobby: null });
  },

  sendMessage: (text) => {
    const { currentLobby, currentUser } = get();
    if (!currentLobby || !currentUser) return;

    socket.emit('chat:message', {
      lobbyId: currentLobby.id,
      text,
      userId: currentUser.id,
      userName: currentUser.name
    });
  },

  setReady: (isReady) => {
    const { currentLobby, currentUser } = get();
    if (!currentLobby || !currentUser) return;

    socket.emit('player:ready', {
      lobbyId: currentLobby.id,
      playerId: currentUser.id,
      isReady
    });
  },

  startGame: () => {
    const { currentLobby } = get();
    if (!currentLobby) return;

    socket.emit('game:start', { lobbyId: currentLobby.id });
  }
}));

// Socket event listeners
socket.on('lobby:update', (lobby: Lobby) => {
  useLobbyStore.setState({ currentLobby: lobby });
  
  if (lobby) {
    // Save lobby state and room ID
    gameStorage.saveLobbyState(lobby);
    gameStorage.setRoomId(lobby.id);
    
    useGameStore.getState().setGameState({
      roomId: lobby.id,
      players: lobby.players,
      currentPlayer: lobby.players[0]?.id || null
    });
  }
});

socket.on('lobbies:update', (lobbies: Lobby[]) => {
  useLobbyStore.setState({ availableLobbies: lobbies });
});

socket.on('chat:message', (message: ChatMessage) => {
  useLobbyStore.setState(state => ({
    messages: [...state.messages, message]
  }));
});