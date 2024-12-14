import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { socket } from "../services/socket";
import { GameState } from "../types/game";

export function useGameState() {
  const setGameState = useGameStore((state) => state.setGameState);

  useEffect(() => {
    const handleGameState = (state: GameState) => {
      console.log("useGameState: Game state updated:", state);
      setGameState(state);
    };

    socket.on("game:state", handleGameState);

    return () => {
      socket.off("game:state", handleGameState);
    };
  }, [setGameState]);
}
