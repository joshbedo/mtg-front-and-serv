import React from 'react';
import { useParams } from 'react-router-dom';
import { Battlefield } from '../components/Battlefield';
import { CustomDragLayer } from '../components/CustomDragLayer';
import { ChatSidebar } from '../components/ChatSidebar';
import { GameToolbox } from '../components/GameToolbox';
import { DeckModal } from '../components/DeckModal';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export function Game() {
  const [isDeckModalOpen, setIsDeckModalOpen] = React.useState(false);
  const { id } = useParams();
  useKeyboardShortcuts();

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