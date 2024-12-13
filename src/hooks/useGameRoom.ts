import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameStorage } from '../services/gameStorage';
import { socket } from '../services/socket';
import { useGameStore } from '../store/gameStore';
import { useLobbyStore } from '../store/lobbyStore';

export function useGameRoom(roomId: string | undefined) {
  const navigate = useNavigate();
  const { currentUser } = useLobbyStore();
  const setGameState = useGameStore((state) => state.setGameState);

  useEffect(() => {
    if (!roomId || !currentUser) {
      navigate('/lobbies');
      return;
    }

    // Store room ID and join socket room
    gameStorage.setRoomId(roomId);

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

    // Handle game state updates
    const handleGameState = (state: any) => {
      setGameState(state);
      gameStorage.saveGameState(state);
    };

    const handleError = (error: string) => {
      console.error('Game error:', error);
      navigate('/lobbies');
    };

    socket.on('game:state', handleGameState);
    socket.on('game:error', handleError);

    // Handle page unload/tab close
    const handleBeforeUnload = () => {
      socket.emit('lobby:leave', { roomId, playerId: currentUser.id });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Try to restore game state from storage
    const savedState = gameStorage.getGameState();
    if (savedState) {
      setGameState(savedState);
    }

    // Cleanup
    return () => {
      socket.off('game:state', handleGameState);
      socket.off('game:error', handleError);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
      gameStorage.clearRoomId();
    };
  }, [roomId, currentUser, setGameState, navigate]);
}