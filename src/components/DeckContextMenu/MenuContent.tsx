import React from 'react';
import { Library } from 'lucide-react';
import { DeckCard } from '../../types/card';

interface MenuContentProps {
  showSelectPrompt?: boolean;
  onSelectDeck: () => void;
  onDrawHand: () => void;
  onDrawCard: () => void;
  onClearHand: () => void;
  isCurrentPlayer: boolean;
  currentDeck: { cards: DeckCard[] } | null;
  remainingCards: DeckCard[] | null;
}

export function MenuContent({
  showSelectPrompt,
  onSelectDeck,
  onDrawHand,
  onDrawCard,
  onClearHand,
  isCurrentPlayer,
  currentDeck,
  remainingCards
}: MenuContentProps) {
  return (
    <>
      <button
        onClick={onSelectDeck}
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
            onClick={onDrawHand}
            disabled={!currentDeck || !isCurrentPlayer}
            className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Draw Hand
          </button>
          <button
            onClick={onDrawCard}
            disabled={!remainingCards?.length || !isCurrentPlayer}
            className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Draw Card ({remainingCards?.length || 0})
          </button>
          <button
            onClick={onClearHand}
            disabled={!isCurrentPlayer}
            className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear Hand
          </button>
        </>
      )}
    </>
  );
}