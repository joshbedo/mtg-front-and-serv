import React from 'react';
import { Position, Player } from '../../types/game';
import { LifeCounter } from '../LifeCounter';
import { DeckArea } from '../DeckArea';
import { CardPile } from '../CardPile';
import { useLobbyStore } from '../../store/lobbyStore';

interface PlayerQuadrantProps {
  position: Position;
  player: Player;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function PlayerQuadrant({ position, player, style, children }: PlayerQuadrantProps) {
  const { currentUser } = useLobbyStore();
  const isCurrentPlayer = player.id === currentUser?.id;

  const quadrantColors = {
    top: 'bg-red-900/20',
    right: 'bg-orange-900/20',
    bottom: 'bg-green-900/20',
    left: 'bg-blue-900/20'
  };

  return (
    <div 
      className={`absolute ${quadrantColors[position]} transition-colors duration-300`}
      style={{
        ...style,
        ...getPositionStyles(position)
      }}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <div className="bg-gray-900/80 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
          {player.name}{isCurrentPlayer ? ' (You)' : ''}
        </div>
        <LifeCounter playerId={player.id} />
      </div>

      {isCurrentPlayer && (
        <div className="absolute bottom-4 right-4 flex gap-2 z-10">
          <CardPile
            title="Graveyard"
            cards={[]}
            onDrop={() => {}}
            onClick={() => {}}
            isSelected={false}
            isCurrentPlayer={true}
          />
          <CardPile
            title="Exile"
            cards={[]}
            onDrop={() => {}}
            onClick={() => {}}
            isSelected={false}
            isCurrentPlayer={true}
          />
          <DeckArea />
        </div>
      )}

      {children}
    </div>
  );
}

function getPositionStyles(position: Position): React.CSSProperties {
  switch (position) {
    case 'top':
      return { top: 0, left: 0, right: 0, height: '50%' };
    case 'right':
      return { top: 0, right: 0, width: '50%', height: '100%' };
    case 'bottom':
      return { bottom: 0, left: 0, right: 0, height: '50%' };
    case 'left':
      return { top: 0, left: 0, width: '50%', height: '100%' };
  }
}