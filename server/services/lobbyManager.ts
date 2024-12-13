import { nanoid } from 'nanoid';
import { Lobby, Player } from '../types/lobby';

class LobbyManager {
  private lobbies: Map<string, Lobby> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Run cleanup every minute
    this.cleanupInterval = setInterval(() => this.cleanupStaleLobbies(), 60000);
  }

  createLobby(name: string, player: Player): Lobby {
    const lobby: Lobby = {
      id: nanoid(),
      name,
      host: player.id,
      players: [player],
      maxPlayers: 4,
      isStarted: false,
      lastActivity: Date.now()
    };

    this.lobbies.set(lobby.id, lobby);
    return lobby;
  }

  getLobby(id: string): Lobby | undefined {
    const lobby = this.lobbies.get(id);
    if (lobby) {
      lobby.lastActivity = Date.now();
    }
    return lobby;
  }

  joinLobby(lobbyId: string, player: Player): Lobby | null {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby || lobby.players.length >= lobby.maxPlayers) {
      return null;
    }

    // Check if player is already in the lobby
    if (!lobby.players.find(p => p.id === player.id)) {
      lobby.players.push(player);
    }

    lobby.lastActivity = Date.now();
    return lobby;
  }

  leaveLobby(lobbyId: string, playerId: string): Lobby | null {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return null;

    lobby.players = lobby.players.filter(p => p.id !== playerId);
    lobby.lastActivity = Date.now();

    // If the host left, assign new host
    if (lobby.host === playerId && lobby.players.length > 0) {
      lobby.host = lobby.players[0].id;
    }

    // Remove lobby if empty
    if (lobby.players.length === 0) {
      this.lobbies.delete(lobbyId);
      return null;
    }

    return lobby;
  }

  getAvailableLobbies(): Lobby[] {
    return Array.from(this.lobbies.values())
      .filter(lobby => !lobby.isStarted && lobby.players.length < lobby.maxPlayers);
  }

  private cleanupStaleLobbies() {
    const now = Date.now();
    const staleThreshold = 30 * 60 * 1000; // 30 minutes

    for (const [id, lobby] of this.lobbies.entries()) {
      // Remove lobbies that are:
      // 1. Empty
      // 2. Inactive for more than 30 minutes
      // 3. Have disconnected players (no socket connection)
      if (
        lobby.players.length === 0 ||
        now - lobby.lastActivity > staleThreshold
      ) {
        this.lobbies.delete(id);
      }
    }
  }

  cleanup() {
    clearInterval(this.cleanupInterval);
    this.lobbies.clear();
  }
}

export const lobbyManager = new LobbyManager();