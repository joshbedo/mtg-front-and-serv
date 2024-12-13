import React, { useState } from 'react';
import { useDeckStore } from '../store/deckStore';
import { useBattlefieldStore } from '../store/battlefieldStore';
import { DeckContextMenu } from './DeckContextMenu';
import { useGameStore } from '../store/gameStore';
import { useLobbyStore } from '../store/lobbyStore';

// Use a more reliable URL for the card back image
const MTG_CARD_BACK = "https://cards.scryfall.io/large/back/0/0/0000000000000000-0000000000000000.jpg";

export function DeckArea() {
  const currentDeck = useDeckStore((state) => state.currentDeck);
  const remainingCards = useBattlefieldStore((state) => state.remainingCards);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const { currentUser } = useLobbyStore();
  const { players } = useGameStore();
  const [imageError, setImageError] = useState(false);

  const currentPlayer = players.find(p => p.id === currentUser?.id);
  const isCurrentPlayer = currentPlayer?.position === 'bottom';

  const getDisplayedCardCount = () => {
    if (remainingCards.length > 0) {
      return remainingCards.length;
    }
    return currentDeck?.cards.reduce((sum, card) => sum + card.quantity, 0) || 0;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCurrentPlayer) {
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <div 
        className={`relative w-[70px] h-[97.5px] rounded-lg overflow-hidden ${
          isCurrentPlayer ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
        }`}
        onClick={handleContextMenu}
      >
        {!imageError ? (
          <img
            src={MTG_CARD_BACK}
            alt="Deck"
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          // Fallback when image fails to load
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-white text-xs font-medium">Deck</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {getDisplayedCardCount()}
          </span>
        </div>
      </div>
      {contextMenu && (
        <DeckContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
}