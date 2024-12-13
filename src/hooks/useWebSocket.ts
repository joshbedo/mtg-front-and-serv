import { useEffect, useCallback, useState } from 'react';
import { socket, waitForConnection } from '../services/socket';
import { useGameStore } from '../store/gameStore';
import { useLobbyStore } from '../store/lobbyStore';
import { GameState } from '../types/game';

export function useWebSocket(roomId: string) {
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setGameState = useGameStore((state) => state.setGameState);
  const { currentUser } = useLobbyStore();

  const handleGameState = useCallback((gameState: GameState) => {
    if (!gameState) {
      setError('Invalid game state received');
      setIsConnecting(false);
      return;
    }
    setGameState(gameState);
    setIsConnecting(false);
  }, [setGameState]);

  const handleError = useCallback((error: string) => {
    console.error('Game error:', error);
    setError(error);
    setIsConnecting(false);
  }, []);

  useEffect(() => {
    if (!roomId || !currentUser) {
      setError('Missing room ID or user information');
      setIsConnecting(false);
      return;
    }

    let mounted = true;

    const initializeConnection = async () => {
      try {
        await waitForConnection();
        
        if (!mounted) return;

        // Join game room
        socket.emit('game:join', { 
          roomId,
          player: {
            id: currentUser.id,
            name: currentUser.name,
            position: null,
            isReady: false
          }
        });

        // Set up event listeners
        socket.on('game:state', handleGameState);
        socket.on('game:error', handleError);
        socket.on('connect_error', () => {
          if (mounted) {
            setError('Failed to connect to game server');
            setIsConnecting(false);
          }
        });

      } catch (err) {
        if (mounted) {
          console.error('Connection error:', err);
          setError('Failed to connect to game server');
          setIsConnecting(false);
        }
      }
    };

    initializeConnection();

    return () => {
      mounted = false;
      socket.off('game:state', handleGameState);
      socket.off('game:error', handleError);
      if (socket.connected) {
        socket.emit('game:leave', { roomId });
      }
    };
  }, [roomId, currentUser, handleGameState, handleError]);

  return { isConnecting, error };
}