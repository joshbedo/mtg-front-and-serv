import React from 'react';
import { Player } from '../../types/game';
import { MTG_CARD_BACK } from '../../constants/gameAssets';
import { useHandStyles } from './useHandStyles';

interface OpponentHandProps {
  player: Player;
  cardCount: number;
}

export function OpponentHand({ player, cardCount }: OpponentHandProps) {
  const getCardStyles = useHandStyles();

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-72 pointer-events-none">
      <div className="relative w-full h-full">
        {Array.from({ length: cardCount }).map((_, index) => (
          <div
            key={index}
            className="absolute left-1/2 top-0 transition-all duration-300"
            style={getCardStyles(index, cardCount, true)}
          >
            <div className="w-[120px] h-[167px] rounded-lg overflow-hidden shadow-lg">
              <img
                src={MTG_CARD_BACK}
                alt="Card back"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}