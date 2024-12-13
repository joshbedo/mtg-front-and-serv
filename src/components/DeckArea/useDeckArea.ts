import { useState, useEffect } from 'react';
import { useDeckStore } from '../../store/deckStore';
import { useBattlefieldStore } from '../../store/battlefieldStore';
import { useLobbyStore } from '../../store/lobbyStore';

export function useDeckArea() {
  const currentDeck = useDeckStore((state) => state.currentDeck);
  const remainingCards = useBattlefieldStore((state) => state.remainingCards);
  const { currentUser } = useLobbyStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [imageError, setImageError] = useState(false);
  const [showDeckPrompt, setShowDeckPrompt] = useState(false);

  useEffect(() => {
    setShowDeckPrompt(!currentDeck);
  }, [currentDeck]);

  const getDisplayedCardCount = () => {
    if (remainingCards?.length > 0) {
      return remainingCards.length;
    }
    return currentDeck?.cards.reduce((sum, card) => sum + (card.quantity || 0), 0) || 0;
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCloseMenu = () => {
    setContextMenu(null);
  };

  return {
    displayedCardCount: getDisplayedCardCount(),
    contextMenu,
    imageError,
    showDeckPrompt,
    currentUser,
    handleContextMenu,
    handleImageError,
    handleCloseMenu
  };
}