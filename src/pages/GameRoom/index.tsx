import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../hooks/useWebSocket';
import { usePersistentGame } from '../../hooks/usePersistentGame';
import { useGameState } from '../../hooks/useGameState';
import { Battlefield } from '../../components/battlefield/Battlefield';
import { CustomDragLayer } from '../../components/CustomDragLayer';
import { ChatSidebar } from '../../components/ChatSidebar';
import { GameToolbox } from '../../components/GameToolbox';
import { DeckModal } from '../../components/DeckModal';
import { LoadingScreen } from '../../components/LoadingScreen';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

export function GameRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = usePersistentGame(roomId);
  const { isConnecting, error } = useWebSocket(roomId || '');
  const [isDeckModalOpen, setIsDeckModalOpen] = React.useState(false);
  
  useGameState();
  useKeyboardShortcuts();

  React.useEffect(() => {
    if (error) {
      console.error('Game room error:', error);
      navigate('/lobbies');
    }
  }, [error, navigate]);

  if (!isAuthenticated || isConnecting) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Battlefield />
      <CustomDragLayer />
      <ChatSidebar />
      <GameToolbox />
      <DeckModal open={isDeckModalOpen} onOpenChange={setIsDeckModalOpen} />
    </div>
  );
}