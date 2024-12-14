import { socket } from "../socket";
import { useGameStore } from "../../store/gameStore";
import { useBattlefieldStore } from "../../store/battlefieldStore";
import { useChatStore } from "../../store/chatStore";
import { GameState, BattlefieldCard } from "../../types/game";
import { Card } from "../../types/card";

// Game state events
export const initializeGameStateEvents = () => {
  socket.on("game:state", (state: GameState) => {
    useGameStore.getState().setGameState(state);
  });

  socket.on("game:phaseChanged", ({ phase, playerName }) => {
    useGameStore.getState().setPhase(phase);
    useChatStore
      .getState()
      .addMessage(
        `${playerName} moved to ${phase} phase`,
        undefined,
        undefined,
        "phase"
      );
  });

  socket.on("game:turnChanged", ({ playerId, playerName }) => {
    useGameStore.getState().setCurrentPlayer(playerId);
    useChatStore
      .getState()
      .addMessage(`${playerName}'s turn`, undefined, undefined, "system");
  });
};

// Battlefield events
export const initializeBattlefieldEvents = () => {
  socket.on(
    "game:cardPlayed",
    ({
      card,
      position,
      tapped,
      cardId,
      playerName,
    }: {
      card: Card;
      position: { x: number; y: number };
      tapped: boolean;
      cardId: string;
      playerName: string;
    }) => {
      useBattlefieldStore
        .getState()
        .addCard(card, position.x, position.y, tapped);
      useChatStore
        .getState()
        .addMessage(`${playerName} played ${card.name}`, card);
    }
  );

  socket.on(
    "game:cardMoved",
    ({
      cardId,
      position,
    }: {
      cardId: string;
      position: { x: number; y: number };
    }) => {
      useBattlefieldStore.getState().moveCard(cardId, position.x, position.y);
    }
  );

  socket.on(
    "game:cardTapped",
    ({
      cardId,
      tapped,
      playerName,
      card,
    }: {
      cardId: string;
      tapped: boolean;
      playerName: string;
      card: Card;
    }) => {
      useBattlefieldStore.getState().toggleTapped(cardId);
      useChatStore
        .getState()
        .addMessage(
          `${playerName} ${tapped ? "tapped" : "untapped"} ${card.name}`,
          card
        );
    }
  );

  socket.on("game:cardRemoved", ({ cardId }: { cardId: string }) => {
    useBattlefieldStore.getState().removeCard(cardId);
  });
};

// Hand events
export const initializeHandEvents = () => {
  socket.on(
    "game:handUpdate",
    ({
      playerId,
      count,
      playerName,
    }: {
      playerId: string;
      count: number;
      playerName: string;
    }) => {
      // TODO: needs updated
      // useBattlefieldStore.getState().updateHandCount(playerId, count);
      useChatStore
        .getState()
        .addMessage(
          `${playerName} has ${count} cards in hand`,
          undefined,
          undefined,
          "system"
        );
    }
  );

  socket.on(
    "game:cardDrawn",
    ({ playerName, count }: { playerName: string; count: number }) => {
      useChatStore
        .getState()
        .addMessage(
          `${playerName} drew ${count} card${count > 1 ? "s" : ""}`,
          undefined,
          undefined,
          "system"
        );
    }
  );
};

export const initializeChatEvents = () => {
  socket.on("chat:message", (message) => {
    console.log("gameEvents: Chat message:", message);
    useChatStore.setState((state) => ({
      messages: [...state.messages, message],
    }));
  });
};

// Life total events
export const initializeLifeEvents = () => {
  socket.on(
    "game:lifeChanged",
    ({
      playerId,
      life,
      delta,
      playerName,
    }: {
      playerId: string;
      life: number;
      delta: number;
      playerName: string;
    }) => {
      useGameStore.getState().updateLife(playerId, life);

      const action = delta > 0 ? "gained" : "lost";
      const prevLife = life - delta;
      console.log("adding message");
      useChatStore
        .getState()
        .addGameActionMessage(
          `${playerName} ${action} ${Math.abs(
            delta
          )} life (${prevLife} → ${life})`,
          undefined,
          undefined,
          "life"
        );
    }
  );
};

// Card pile events
export const initializePileEvents = () => {
  socket.on(
    "game:cardToGraveyard",
    ({
      card,
      pileId,
      playerName,
    }: {
      card: Card;
      pileId: string;
      playerName: string;
    }) => {
      useBattlefieldStore.getState().addToGraveyard(card);
      useChatStore
        .getState()
        .addMessage(`${playerName} moved ${card.name} to graveyard`, card);
    }
  );

  socket.on(
    "game:cardExiled",
    ({
      card,
      pileId,
      playerName,
    }: {
      card: Card;
      pileId: string;
      playerName: string;
    }) => {
      useBattlefieldStore.getState().addToExile(card);
      useChatStore
        .getState()
        .addMessage(`${playerName} exiled ${card.name}`, card);
    }
  );
};
