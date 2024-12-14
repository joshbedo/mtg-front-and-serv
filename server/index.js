import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleGameActions } from './handlers/gameHandlers/index.js';
import { handleLobbyActions } from './handlers/lobbyHandlers.js';
import { handleChatActions } from './handlers/chatHandlers.js';
import { lobbyManager } from './services/lobbyManager.js';

dotenv.config();

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://mtg-game-stackblitz.netlify.app']
      : ['http://localhost:5173'],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket']
});

// Health check endpoint for Heroku
app.get('/', (req, res) => {
  res.send('MTG Game Server is running');
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Initialize handlers
  handleGameActions(io, socket);
  handleLobbyActions(io, socket);
  handleChatActions(io, socket);

  socket.on('disconnect', () => {
    // when a client disconnects, we need to remove them from the lobby
    // lobbyManager.removePlayerFromLobby(socket.id);
    // console.log(lobbyManager.lobbies);
    // TODO: needs fixed
    // lobbyManager.leaveGameRoom(socket.id);
    console.log('Client disconnected:', socket.id);
  });
});

// Cleanup on server shutdown
process.on('SIGTERM', () => {
  console.log('Server shutting down...');
  lobbyManager.cleanup();
  process.exit(0);
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});