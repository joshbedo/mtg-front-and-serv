import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLobbyStore } from '../../store/lobbyStore';
import { LobbyHeader } from './LobbyHeader';
import { PlayerList } from './PlayerList';
import { LobbyChat } from './LobbyChat';
import { LobbyActions } from './LobbyActions';

export function GameLobby() {
  const navigate = useNavigate();
  const { currentLobby, currentUser, leaveLobby } = useLobbyStore();

  React.useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  React.useEffect(() => {
    if (currentLobby?.isStarted) {
      navigate('/game');
    }
  }, [currentLobby?.isStarted, navigate]);

  const handleLeave = () => {
    leaveLobby();
    navigate('/');
  };

  if (!currentLobby || !currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-[1fr_300px] gap-8">
        <div className="space-y-8">
          <LobbyHeader lobby={currentLobby} onLeave={handleLeave} />
          <PlayerList 
            players={currentLobby.players}
            currentUser={currentUser}
            hostId={currentLobby.host}
          />
          <LobbyActions
            isHost={currentLobby.host === currentUser.id}
            canStart={currentLobby.players.length > 1 && 
                     currentLobby.players.every(p => p.isReady)}
          />
        </div>
        <LobbyChat />
      </div>
    </div>
  );
}