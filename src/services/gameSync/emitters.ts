import { socket } from "../socket";
import { gameStorage } from "../gameStorage";
import { Card } from "../../types/card";
import { Phase } from "../../types/game";

export const gameEmitters = {
  // gameAction: (message) => {
  //   const roomId = gameStorage.getRoomId();
  //   if (!roomId) return;

  //   socket.emit("game:chat", { roomId, message });
  // },

  gameChat: (message) => {
    const roomId = gameStorage.getRoomId();
    if (!roomId) return;

    socket.emit("game:chat", { roomId, message });
  },

  // Phase and turn actions
  changePhase: (phase: Phase, playerName: string) => {
    const roomId = gameStorage.getRoomId();
    if (!roomId) return;

    socket.emit("game:phaseChange", { roomId, phase, playerName });
  },

  // Card actions
  playCard: (
    card: Card,
    position: { x: number; y: number },
    tapped: boolean,
    playerName: string
  ) => {
    const roomId = gameStorage.getRoomId();
    if (!roomId) return;

    console.log("emitting card played", {
      roomId,
      card,
      position,
      tapped,
      playerName,
    });

    const cardId = crypto.randomUUID();
    socket.emit("game:cardPlayed", {
      roomId,
      card,
      position,
      tapped,
      cardId,
      playerName,
    });
    return cardId;
  },

  moveCard: (cardId: string, position: { x: number; y: number }) => {
    const roomId = gameStorage.getRoomId();
    if (!roomId) return;

    socket.emit("game:cardMoved", { roomId, cardId, position });
  },

  toggleCard: (
    cardId: string,
    tapped: boolean,
    playerName: string,
    card: Card
  ) => {
    const roomId = gameStorage.getRoomId();
    if (!roomId) return;

    socket.emit("game:cardTapped", {
      roomId,
      cardId,
      tapped,
      playerName,
      card,
    });
  },

  // Hand actions
  updateHand: (playerId: string, count: number, playerName: string) => {
    const roomId = gameStorage.getRoomId();
    if (!roomId) return;

    socket.emit("game:handUpdate", { roomId, playerId, count, playerName });
  },

  drawCard: (playerName: string, count: number = 1) => {
    const roomId = gameStorage.getRoomId();
    if (!roomId) return;

    socket.emit("game:cardDrawn", { roomId, playerName, count });
  },

  // Life total actions
  updateLife: (
    playerId: string,
    life: number,
    delta: number,
    playerName: string
  ) => {
    const roomId = gameStorage.getRoomId();
    if (!roomId) return;

    socket.emit("game:life", { roomId, playerId, life, delta, playerName });
  },

  // Card pile actions
  moveToGraveyard: (card: Card, playerName: string) => {
    const roomId = gameStorage.getRoomId();
    if (!roomId) return;

    const pileId = crypto.randomUUID();
    socket.emit("game:cardToGraveyard", { roomId, card, pileId, playerName });
    return pileId;
  },

  moveToExile: (card: Card, playerName: string) => {
    const roomId = gameStorage.getRoomId();
    if (!roomId) return;

    const pileId = crypto.randomUUID();
    socket.emit("game:cardExiled", { roomId, card, pileId, playerName });
    return pileId;
  },
};
