import React from 'react';
import { LifeCounter } from '../LifeCounter';
import { CardPile } from '../CardPile';
import { DeckArea } from '../DeckArea';
import { Position } from '../../types/game';

interface BattlefieldQuadrantProps {
  position: Position;
  player?: {
    id: string;
    name: string;
    isReady: boolean;
  } | null;
  isCurrentPlayer: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function BattlefieldQuadrant({ 
  position, 
  player, 
  isCurrentPlayer,
  style,
  children 
}: BattlefieldQuadrantProps) {
  const baseStyles = 'absolute flex items-start transition-colors duration-300';
  
  // Get quadrant styles based on position
  const getQuadrantStyles = () => {
    const colors = {
      top: 'bg-red-900/20',
      right: 'bg-orange-900/20',
      bottom: 'bg-green-900/20',
      left: 'bg-blue-900/20'
    };

    const positions = {
      top: 'top-0 left-0 right-0 h-1/2',
      right: 'top-0 right-0 w-1/2 h-full',
      bottom: 'bottom-0 left-0 right-0 h-1/2',
      left: 'top-0 left-0 w-1/2 h-full'
    };

    return `${colors[position]} ${positions[position]}`;
  };

  if (!player) {
    return (
      <div 
        className={`${baseStyles} ${getQuadrantStyles()} opacity-25`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
          Waiting for player...
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${baseStyles} ${getQuadrantStyles()}`}
      style={style}
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