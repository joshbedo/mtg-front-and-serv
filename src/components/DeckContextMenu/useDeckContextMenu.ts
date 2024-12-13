import { useState, useEffect } from 'react';
import { useDeckStore } from '../../store/deckStore';
import { useBattlefieldStore } from '../../store/battlefieldStore';
import { useGameStore } from '../../store/gameStore';
import { useLobbyStore } from '../../store/lobbyStore';

interface UseDeckContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

export function useDeckContextMenu({ x, y, onClose }: UseDeckContextMenuProps) {
  const [position, setPosition] = useState({ x, y });
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  
  const currentDeck = useDeckStore((state) => state.currentDeck);
  const { drawHand, drawCard, clearHand, remainingCards } = useBattlefieldStore();
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
    if (!currentDeck?.cards?.length || !isCurrentPlayer) return;
    drawHand(currentDeck.cards);
    onClose();
  };

  const handleDrawCard = () => {
    if (!remainingCards?.length || !isCurrentPlayer) return;
    drawCard();
    onClose();
  };

  const handleClearHand = () => {
    if (!isCurrentPlayer) return;
    clearHand();
    onClose();
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

  return {
    position,
    isDeckModalOpen,
    handleDeckModalClose,
    handleDrawHand,
    handleDrawCard,
    handleClearHand,
    handleSelectDeck,
    isCurrentPlayer,
    currentDeck,
    remainingCards
  };
}