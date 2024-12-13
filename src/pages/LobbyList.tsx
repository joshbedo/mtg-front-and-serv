import React, { useEffect } from 'react';
import { Users } from 'lucide-react';
import { useLobbyStore } from '../store/lobbyStore';
import { useUserStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';
import { LobbyCard } from '../components/lobby/LobbyCard';
import { CreateLobbyForm } from '../components/lobby/CreateLobbyForm';
import { EmptyLobbyState } from '../components/lobby/EmptyLobbyState';
import { socket } from '../services/socket';
import { gameStorage } from '../services/gameStorage';

export function LobbyList() {
  const userName = useUserStore((state) => state.name);
  const { availableLobbies, setCurrentUser, createLobby, joinLobby, initializeFromStorage } = useLobbyStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userName) {
      navigate('/');
      return;
    }

    // Try to restore user from storage first
    initializeFromStorage();

    // If no stored user, create new one
    if (!gameStorage.getUserId()) {
      setCurrentUser({
        id: crypto.randomUUID(),
        name: userName,
        isReady: false
      });
    }

    // Request initial lobbies list
    socket.emit('lobbies:list');

    // Set up polling for lobby updates
    const pollInterval = setInterval(() => {
      socket.emit('lobbies:list');
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [userName, setCurrentUser, navigate, initializeFromStorage]);

  if (!userName) return null;

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Game Lobbies</h1>
            <p className="text-gray-400">Welcome back, {userName}!</p>
          </div>
          <CreateLobbyForm onCreateLobby={createLobby} />
        </div>

        <div className="grid gap-4">
          {availableLobbies.length > 0 ? (
            availableLobbies.map((lobby) => (
              <LobbyCard
                key={lobby.id}
                lobby={lobby}
                onJoin={() => joinLobby(lobby.id)}
              />
            ))
          ) : (
            <EmptyLobbyState />
          )}
        </div>
      </div>
    </div>
  );
}