import { useState, useEffect } from 'react';
import { socket } from '../../services/socket';
import { useGameStore } from '../../store/gameStore';
import { useLobbyStore } from '../../store/lobbyStore';

export function useGameRoom(roomId: string | undefined) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentLobby } = useLobbyStore();
  const setGameState = useGameStore((state) => state.setGameState);

  useEffect(() => {
    if (!roomId) {
      setError('Invalid room ID');
      return;
    }

    socket.emit('game:join', { roomId });

    const handleGameState = (gameState: any) => {
      setGameState(gameState);
      setIsLoading(false);
    };

    const handleError = (error: string) => {
      setError(error);
      setIsLoading(false);
    };

    socket.on('game:state', handleGameState);
    socket.on('game:error', handleError);

    return () => {
      socket.off('game:state', handleGameState);
      socket.off('game:error', handleError);
      socket.emit('game:leave', { roomId });
    };
  }, [roomId, setGameState]);

  return { isLoading, error };
}