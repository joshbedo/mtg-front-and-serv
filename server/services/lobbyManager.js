import { nanoid } from "nanoid";

class LobbyManager {
  constructor() {
    this.lobbies = new Map();

    // Run cleanup every minute
    this.cleanupInterval = setInterval(() => this.cleanupStaleLobbies(), 60000);
  }

  createLobby(name, player) {
    const lobby = {
      id: nanoid(),
      name: name,
      host: player.id,
      players: [player],
      maxPlayers: 4,
      isStarted: false,
      lastActivity: Date.now(),
    };

    this.lobbies.set(lobby.id, lobby);
    return lobby;
  }

  getLobby(id) {
    const lobby = this.lobbies.get(id);
    if (lobby) {
      lobby.lastActivity = Date.now();
    }
    return lobby;
  }

  joinLobby(lobbyId, player) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby || lobby.players.length >= lobby.maxPlayers) {
      return null;
    }

    // Check if player is already in the lobby
    if (!lobby.players.find((p) => p.id === player.id)) {
      lobby.players.push(player);
    }

    lobby.lastActivity = Date.now();
    return lobby;
  }

  updateLobby(lobbyId, update) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return null;

    Object.assign(lobby, update);
    return lobby;
  }

  leaveLobby(playerId) {
    // find the lobby that the player is in

    // Find lobby containing player by socketId
    // let foundLobby = null;
    // for (const [id, lobby] of this.lobbies.entries()) {
    //   const playerInLobby = lobby.players.find(p => 
    //     typeof p === 'object' && p.socketId === playerId
    //   );
    //   if (playerInLobby) {
    //     foundLobby = lobby;
    //     break;
    //   }
    // }

    // console.log(foundLobby, 'foundLobby');

    // foundLobby.players = foundLobby.players.filter((p) => p.id !== playerId);
    // foundLobby.lastActivity = Date.now();

    // console.log(foundLobby, 'foundLobby');
    // // If the host left, assign new host
    // if (foundLobby.host === playerId && foundLobby.players.length > 0) {
    //   foundLobby.host = foundLobby.players[0].id;
    // }

    // // Remove foundLobby if empty
    // if (foundLobby.players.length === 0) {
    //   this.lobbies.delete(foundLobby.id);
    //   return null;
    // }

    // return foundLobby;
  }

  getAvailableLobbies() {
    return Array.from(this.lobbies.values()).filter(
      (lobby) => !lobby.isStarted && lobby.players.length < lobby.maxPlayers
    );
  }

  cleanupStaleLobbies() {
    const now = Date.now();
    const staleThreshold = 30 * 60 * 1000; // 30 minutes

    for (const [id, lobby] of this.lobbies.entries()) {
      // Remove lobbies that are:
      // 1. Empty
      // 2. Inactive for more than 30 minutes
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
