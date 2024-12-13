import React from 'react';
import { CardPile } from './CardPile';
import { DeckArea } from './DeckArea';
import { LifeCounter } from './LifeCounter';
import { useBattlefieldStore } from '../store/battlefieldStore';
import { useGameStore } from '../store/gameStore';

interface PlayerBattlefieldProps {
  position: 'top' | 'right' | 'bottom' | 'left';
  isCurrentPlayer?: boolean;
  children?: React.ReactNode;
}

export function PlayerBattlefield({ position, isCurrentPlayer = false, children }: PlayerBattlefieldProps) {
  const { graveyard, exile, addToGraveyard, addToExile, setSelectedPile, selectedPile } = useBattlefieldStore();
  const { targeting, setTarget } = useGameStore();

  const containerClasses = {
    top: 'flex-row justify-start',
    right: 'flex-row justify-end',
    bottom: 'flex-row justify-start',
    left: 'flex-row justify-start'
  };

  const pileContainerClasses = {
    top: 'bottom-4 right-4 flex-col',
    right: 'bottom-4 right-4 flex-col',
    bottom: 'bottom-4 right-4 flex-col',
    left: 'bottom-4 right-4 flex-col'
  };

  const playerColors = {
    top: 'bg-red-900/20',
    right: 'bg-orange-900/20',
    left: 'bg-blue-900/20',
    bottom: 'bg-green-900/20'
  };

  const playerIds = {
    top: 2,
    right: 3,
    left: 1,
    bottom: 4
  };

  const handlePlayerClick = () => {
    if (targeting.sourceId && targeting.sourceName) {
      setTarget({
        type: 'player',
        id: playerIds[position],
        name: `Player ${playerIds[position]}`
      });
    }
  };

  return (
    <div 
      className={`absolute inset-0 flex ${containerClasses[position]} items-start ${playerColors[position]} ${targeting.sourceId ? 'cursor-crosshair' : ''}`}
      onClick={handlePlayerClick}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="bg-gray-900/80 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
          Player {playerIds[position]}{isCurrentPlayer ? ' (You)' : ''}
        </div>
        <LifeCounter playerId={playerIds[position]} />
      </div>
      <div className={`absolute ${pileContainerClasses[position]} flex gap-2 z-10`}>
        <CardPile
          title="Graveyard"
          cards={isCurrentPlayer ? graveyard : []}
          onDrop={addToGraveyard}
          onClick={() => setSelectedPile(selectedPile === 'graveyard' ? null : 'graveyard')}
          isSelected={selectedPile === 'graveyard'}
          isCurrentPlayer={isCurrentPlayer}
        />
        <CardPile
          title="Exile"
          cards={isCurrentPlayer ? exile : []}
          onDrop={addToExile}
          onClick={() => setSelectedPile(selectedPile === 'exile' ? null : 'exile')}
          isSelected={selectedPile === 'exile'}
          isCurrentPlayer={isCurrentPlayer}
        />
        {isCurrentPlayer && <DeckArea />}
      </div>
      {children}
    </div>
  );
}