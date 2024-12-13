import { useState, useEffect } from 'react';
import { useDeckStore } from '../../store/deckStore';
import { useBattlefieldStore } from '../../store/battlefieldStore';
import { useLobbyStore } from '../../store/lobbyStore';

export function useDeckState() {
  const currentDeck = useDeckStore((state) => state.currentDeck);
  const remainingCards = useBattlefieldStore((state) => state.remainingCards);
  const { currentUser } = useLobbyStore();
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

  return {
    currentDeck,
    remainingCards,
    currentUser,
    showDeckPrompt,
    displayedCardCount: getDisplayedCardCount()
  };
}