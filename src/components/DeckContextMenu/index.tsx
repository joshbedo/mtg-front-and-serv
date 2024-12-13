import React, { useState } from 'react';
import { Library } from 'lucide-react';
import { useDrawHandlers } from './useDrawHandlers';
import { DeckModal } from '../DeckModal';
import { useMenuPosition } from './useMenuPosition';
import { gameEmitters } from '../../services/gameSync';
import { useLobbyStore } from '../../store/lobbyStore';

interface DeckContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  showSelectPrompt?: boolean;
}

export function DeckContextMenu({ x, y, onClose, showSelectPrompt }: DeckContextMenuProps) {
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const position = useMenuPosition(x, y);
  const { currentUser } = useLobbyStore();
  const {
    handleDrawHand,
    handleDrawCard,
    handleClearHand,
    currentDeck,
    remainingCards
  } = useDrawHandlers(onClose);

  const handleDrawHandClick = () => {
    if (!currentUser || !currentDeck) return;
    
    handleDrawHand();
    gameEmitters.updateHand(currentUser.id, 7, currentUser.name);
    gameEmitters.drawCard(currentUser.name, 7);
    onClose();
  };

  const handleDrawCardClick = () => {
    if (!currentUser || !remainingCards?.length) return;
    
    handleDrawCard();
    gameEmitters.updateHand(
      currentUser.id,
      (remainingCards?.length || 0) + 1,
      currentUser.name
    );
    gameEmitters.drawCard(currentUser.name, 1);
    onClose();
  };

  const handleClearHandClick = () => {
    if (!currentUser) return;
    
    handleClearHand();
    gameEmitters.updateHand(currentUser.id, 0, currentUser.name);
    onClose();
  };

  // ... rest of the component remains the same
}