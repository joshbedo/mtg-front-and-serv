import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useGameStore } from '../../store/gameStore';
import { useLobbyStore } from '../../store/lobbyStore';
import { PlayerQuadrant } from './PlayerQuadrant';
import { useQuadrantLayout } from './useQuadrantLayout';
import { PhaseBar } from '../PhaseBar';
import { Hand } from '../Hand';
import { useBattlefieldStore } from '../../store/battlefieldStore';
import { Card } from '../../types/card';
import { socket } from '../../services/socket';
import { gameStorage } from '../../services/gameStorage';
import { DraggableCard } from '../DraggableCard';

interface DragItem extends Card {
  isOnBattlefield?: boolean;
  isInHand?: boolean;
  battlefieldId?: string;
  handId?: string;
  tapped?: boolean;
}

export function Battlefield() {
  const { players } = useGameStore();
  const { currentUser } = useLobbyStore();
  const { cards, addCard, removeFromHand, moveCard } = useBattlefieldStore();
  const quadrants = useQuadrantLayout(players);
  const battlefieldRef = useRef<HTMLDivElement>(null);

  const handleDrop = (item: DragItem, monitor: any) => {
    if (!battlefieldRef.current || !currentUser) return;

    const offset = monitor.getClientOffset();
    if (!offset) return;

    const rect = battlefieldRef.current.getBoundingClientRect();
    const x = offset.x - rect.left - 30;
    const y = offset.y - rect.top - 41.75;

    // If card is already on battlefield, just move it
    if (item.isOnBattlefield && item.battlefieldId) {
      moveCard(item.battlefieldId, x, y);
    } 
    // If card is from hand, check if it exists and add/move accordingly
    else if (item.isInHand && item.handId) {
      const cardId = addCard(item, x, y, false);
      removeFromHand(item.handId);
    }
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }), [currentUser, cards]);

  return (
    <div className="relative h-screen bg-gray-900">
      <div className="absolute inset-0">
        {quadrants.map((quadrant, index) => {
          const player = players[index];
          if (!player) return null;

          const isCurrentPlayer = player.id === currentUser?.id;
          const playerCards = isCurrentPlayer ? cards : [];

          return (
            <PlayerQuadrant
              key={quadrant.position}
              position={quadrant.position}
              player={player}
              isCurrentPlayer={isCurrentPlayer}
              style={{
                width: quadrant.width,
                left: quadrant.left
              }}
            >
              <div
                ref={isCurrentPlayer ? (node) => {
                  battlefieldRef.current = node;
                  drop(node);
                } : null}
                className="absolute inset-0"
              >
                {playerCards.map(({ id, card, x, y, tapped, counters }) => (
                  <div
                    key={id}
                    className="absolute"
                    style={{ left: x, top: y }}
                  >
                    <DraggableCard
                      card={card}
                      battlefieldId={id}
                      isOnBattlefield={true}
                      tapped={tapped}
                      counters={counters}
                    />
                  </div>
                ))}
              </div>
            </PlayerQuadrant>
          );
        })}
      </div>
      <PhaseBar />
      <Hand />
    </div>
  );
}