import { io } from 'socket.io-client';
import { gameStorage } from './gameStorage';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket'],
  secure: import.meta.env.PROD,
  timeout: 10000
});

let isConnected = false;

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
  isConnected = true;
  
  // Attempt to rejoin room if we have one stored
  const roomId = gameStorage.getRoomId();
  const userId = gameStorage.getUserId();
  const userName = gameStorage.getUserName();
  
  if (roomId && userId && userName) {
    socket.emit('game:rejoin', {
      roomId,
      player: {
        id: userId,
        name: userName,
        isReady: false
      }
    });
  }
  
  // Request initial lobbies list
  socket.emit('lobbies:list');
});

socket.on('connect_error', (error) => {
  console.error('WebSocket connection error:', error);
  isConnected = false;
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
  isConnected = false;
});

export const waitForConnection = () => {
  return new Promise((resolve) => {
    if (isConnected) {
      resolve(true);
      return;
    }

    const checkConnection = setInterval(() => {
      if (isConnected) {
        clearInterval(checkConnection);
        resolve(true);
      }
    }, 100);
  });
};