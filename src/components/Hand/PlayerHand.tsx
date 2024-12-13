import React from 'react';
import { DraggableCard } from '../DraggableCard';
import { DeckCard } from '../../types/card';
import { useHandStyles } from './useHandStyles';

interface PlayerHandProps {
  hand: DeckCard[];
  isMinimized: boolean;
}

export function PlayerHand({ hand, isMinimized }: PlayerHandProps) {
  const getCardStyles = useHandStyles();

  return (
    <div 
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-72 pointer-events-none transition-all duration-300 ease-in-out z-50
        ${isMinimized ? 'translate-y-48 opacity-30 hover:translate-y-0 hover:opacity-100' : ''}`}
    >
      <div className="relative w-full h-full">
        {hand.map((card, index) => (
          <div
            key={card.id}
            className="absolute left-1/2 bottom-0 transition-all duration-300 pointer-events-auto hover:z-50"
            style={getCardStyles(index, hand.length)}
          >
            <DraggableCard 
              card={card}
              handId={card.id}
              isInHand={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}