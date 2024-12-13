import React, { useState, useEffect } from 'react';
import { Library } from 'lucide-react';
import { useDeckStore } from '../store/deckStore';
import { useBattlefieldStore } from '../store/battlefieldStore';
import { DeckModal } from './DeckModal';
import { useGameStore } from '../store/gameStore';
import { useLobbyStore } from '../store/lobbyStore';
import { socket } from '../services/socket';

interface DeckContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  showSelectPrompt?: boolean;
}

export function DeckContextMenu({ x, y, onClose, showSelectPrompt }: DeckContextMenuProps) {
  const currentDeck = useDeckStore((state) => state.currentDeck);
  const { drawHand, drawCard, clearHand, remainingCards } = useBattlefieldStore();
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(showSelectPrompt);
  const [position, setPosition] = useState({ x, y });
  const { currentUser } = useLobbyStore();
  const { players } = useGameStore();

  const currentPlayer = players.find(p => p.id === currentUser?.id);
  const isCurrentPlayer = currentPlayer?.position === 'bottom';

  useEffect(() => {
    const menuWidth = 200;
    const menuHeight = 160;
    const padding = 8;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    if (x + menuWidth + padding > viewportWidth) {
      adjustedX = x - menuWidth;
    }

    if (y + menuHeight + padding > viewportHeight) {
      adjustedY = y - menuHeight;
    }

    adjustedX = Math.max(padding, Math.min(viewportWidth - menuWidth - padding, adjustedX));
    adjustedY = Math.max(padding, Math.min(viewportHeight - menuHeight - padding, adjustedY));

    setPosition({ x: adjustedX, y: adjustedY });
  }, [x, y]);

  const handleDrawHand = () => {
    debugger;
    if (currentDeck && isCurrentPlayer) {
      const roomId = localStorage.getItem('currentRoomId');
      if (roomId && currentUser) {
        // First draw the hand locally
        drawHand(currentDeck.cards);
        
        // Then emit the hand update to other players
        socket.emit('game:handUpdate', {
          roomId,
          playerId: currentUser.id,
          count: 7,
          playerName: currentUser.name
        });
      }
      onClose();
    }
  };

  const handleDrawCard = () => {
    if (remainingCards && remainingCards.length > 0 && isCurrentPlayer) {
      const roomId = localStorage.getItem('currentRoomId');
      if (roomId && currentUser) {
        // Draw card locally
        drawCard();
        
        // Emit hand update with new count
        socket.emit('game:handUpdate', {
          roomId,
          playerId: currentUser.id,
          count: remainingCards.length + 1,
          playerName: currentUser.name
        });
      }
      onClose();
    }
  };

  const handleClearHand = () => {
    if (isCurrentPlayer) {
      const roomId = localStorage.getItem('currentRoomId');
      if (roomId && currentUser) {
        // Clear hand locally
        clearHand();
        
        // Emit hand update with zero count
        socket.emit('game:handUpdate', {
          roomId,
          playerId: currentUser.id,
          count: 0,
          playerName: currentUser.name
        });
      }
      onClose();
    }
  };

  const handleSelectDeck = () => {
    setIsDeckModalOpen(true);
  };

  const handleDeckModalClose = (open: boolean) => {
    setIsDeckModalOpen(open);
    if (!open) {
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0" onClick={onClose} />
      <div
        className="fixed bg-gray-800 rounded-lg shadow-lg p-2 min-w-[200px] z-50"
        style={{ left: position.x, top: position.y }}
      >
        <button
          onClick={handleSelectDeck}
          className={`w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded flex items-center gap-2 ${
            showSelectPrompt ? 'bg-blue-500 hover:bg-blue-600' : ''
          }`}
        >
          <Library size={16} />
          Select Deck
        </button>
        {!showSelectPrompt && (
          <>
            <div className="h-px bg-gray-700 my-1" />
            <button
              onClick={handleDrawHand}
              disabled={!currentDeck || !isCurrentPlayer}
              className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Draw Hand
            </button>
            <button
              onClick={handleDrawCard}
              disabled={!remainingCards?.length || !isCurrentPlayer}
              className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Draw Card ({remainingCards?.length || 0})
            </button>
            <button
              onClick={handleClearHand}
              disabled={!isCurrentPlayer}
              className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Hand
            </button>
          </>
        )}
      </div>
      <DeckModal open={isDeckModalOpen} onOpenChange={handleDeckModalClose} />
    </>
  );
}