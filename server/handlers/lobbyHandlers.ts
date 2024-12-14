// import { Server, Socket } from "socket.io";
// import { lobbyManager } from "../services/lobbyManager";
// import { Player } from "../types/lobby";

// export const handleLobbyActions = (io: Server, socket: Socket) => {
//   // Send initial lobbies list when requested
//   socket.on("lobbies:list", () => {
//     socket.emit("lobbies:update", lobbyManager.getAvailableLobbies());
//   });

//   socket.on(
//     "lobby:create",
//     ({ name, player }: { name: string; player: Player }) => {
//       // Attach socket ID to player
//       const playerWithSocket = { ...player, socketId: socket.id };
//       const lobby = lobbyManager.createLobby(name, playerWithSocket);

//       console.log(lobby, "lobby created");

//       socket.join(lobby.id);
//       io.emit("lobbies:update", lobbyManager.getAvailableLobbies());
//       socket.emit("lobby:update", lobby);
//     }
//   );

//   socket.on(
//     "lobby:join",
//     ({ lobbyId, player }: { lobbyId: string; player: Player }) => {
//       const playerWithSocket = { ...player, socketId: socket.id };
//       const lobby = lobbyManager.joinLobby(lobbyId, playerWithSocket);

//       if (lobby) {
//         socket.join(lobbyId);
//         io.to(lobbyId).emit("lobby:update", lobby);
//         io.emit("lobbies:update", lobbyManager.getAvailableLobbies());
//         io.to(lobbyId).emit("chat:system", `${player.name} joined the game`);
//       } else {
//         socket.emit("game:error", "Failed to join game");
//       }
//     }
//   );

//   socket.on(
//     "lobby:leave",
//     ({ lobbyId, playerId }: { lobbyId: string; playerId: string }) => {
//       const lobby = lobbyManager.leaveLobby(lobbyId, playerId);

//       socket.leave(lobbyId);

//       if (lobby) {
//         io.to(lobbyId).emit("lobby:update", lobby);
//         io.to(lobbyId).emit(
//           "chat:system",
//           `${socket.data?.playerName} left the game`
//         );
//       }

//       io.emit("lobbies:update", lobbyManager.getAvailableLobbies());
//     }
//   );

//   // Handle disconnects
//   socket.on("disconnect", () => {
//     // Find all lobbies where this socket is a player
//     const lobbies = lobbyManager.getAvailableLobbies();
//     for (const lobby of lobbies) {
//       const player = lobby.players.find((p) => p.socketId === socket.id);
//       if (player) {
//         const updatedLobby = lobbyManager.leaveLobby(lobby.id, player.id);
//         if (updatedLobby) {
//           io.to(lobby.id).emit("lobby:update", updatedLobby);
//           io.to(lobby.id).emit("chat:system", `${player.name} disconnected`);
//         }
//       }
//     }

//     io.emit("lobbies:update", lobbyManager.getAvailableLobbies());
//   });
// };
