import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useLobbyStore } from '../store/lobbyStore';
import { socket, waitForConnection } from '../services/socket';

export function usePersistentGame(roomId: string | undefined) {
  const navigate = useNavigate();
  const userName = useUserStore((state) => state.name);
  const { currentUser, setCurrentUser } = useLobbyStore();

  useEffect(() => {
    if (!userName) {
      navigate('/');
      return;
    }

    // If we don't have a current user but have a username, recreate the user
    if (!currentUser && userName) {
      setCurrentUser({
        id: crypto.randomUUID(),
        name: userName,
        isReady: false
      });
    }

    // Attempt to reconnect to room if we have a roomId
    if (roomId && currentUser) {
      const initializeConnection = async () => {
        try {
          await waitForConnection();
          
          // Rejoin the room
          socket.emit('game:join', {
            roomId,
            player: {
              id: currentUser.id,
              name: currentUser.name,
              position: null,
              isReady: false
            }
          });
        } catch (err) {
          console.error('Failed to reconnect:', err);
          navigate('/lobbies');
        }
      };

      initializeConnection();
    }
  }, [roomId, userName, currentUser, setCurrentUser, navigate]);

  return { isAuthenticated: Boolean(userName && currentUser) };
}