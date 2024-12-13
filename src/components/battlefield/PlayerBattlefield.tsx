import React, { useState } from 'react';
import { useBattlefieldStore } from '../../store/battlefieldStore';
import { CardPile } from '../piles/CardPile';
import { CardPilePreview } from '../piles/CardPilePreview';
import { DeckArea } from '../DeckArea';
import { LifeCounter } from '../LifeCounter';
import { Position } from '../../types/game';

interface PlayerBattlefieldProps {
  position: Position;
  isCurrentPlayer?: boolean;
  children?: React.ReactNode;
}

export function PlayerBattlefield({ position, isCurrentPlayer = false, children }: PlayerBattlefieldProps) {
  const { graveyard, exile } = useBattlefieldStore();
  const [selectedPile, setSelectedPile] = useState<'Graveyard' | 'Exile' | null>(null);

  const playerColors = {
    top: 'bg-red-900/20',
    right: 'bg-orange-900/20',
    left: 'bg-blue-900/20',
    bottom: 'bg-green-900/20'
  };

  return (
    <div className={`absolute inset-0 ${playerColors[position]}`}>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="bg-gray-900/80 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
          {isCurrentPlayer ? 'You' : `Player ${position}`}
        </div>
        <LifeCounter playerId={position} />
      </div>

      {isCurrentPlayer && (
        <div className="absolute bottom-4 right-4 flex gap-2 z-10">
          <CardPile
            title="Graveyard"
            cards={graveyard}
            onClick={() => setSelectedPile('Graveyard')}
            isSelected={selectedPile === 'Graveyard'}
            isCurrentPlayer={isCurrentPlayer}
          />
          <CardPile
            title="Exile"
            cards={exile}
            onClick={() => setSelectedPile('Exile')}
            isSelected={selectedPile === 'Exile'}
            isCurrentPlayer={isCurrentPlayer}
          />
          <DeckArea />
        </div>
      )}

      {selectedPile && (
        <CardPilePreview
          cards={selectedPile === 'Graveyard' ? graveyard : exile}
          title={selectedPile}
          onClose={() => setSelectedPile(null)}
        />
      )}

      {children}
    </div>
  );
}