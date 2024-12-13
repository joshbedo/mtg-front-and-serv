import React, { useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { Card } from '../types/card';
import { useBattlefieldStore } from '../store/battlefieldStore';
import { DraggableCard } from './DraggableCard';
import { Hand } from './Hand';
import { PlayerBattlefield } from './PlayerBattlefield';
import { useChatStore } from '../store/chatStore';
import { PilePreview } from './PilePreview';
import { PhaseBar } from './PhaseBar';

interface DragItem extends Card {
  isOnBattlefield?: boolean;
  battlefieldId?: string;
  handId?: string;
  tapped?: boolean;
}

export function Battlefield() {
  const {
    cards,
    addCard,
    moveCard,
    removeFromHand,
    setHandMinimized,
    graveyard,
    exile,
    selectedPile,
    setSelectedPile
  } = useBattlefieldStore();
  
  const addMessage = useChatStore((state) => state.addMessage);
  const battlefieldRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const windowHeight = window.innerHeight;
      const mouseY = e.clientY;
      const proximityThreshold = 200;
      
      setHandMinimized(mouseY < windowHeight - proximityThreshold);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setHandMinimized]);

  const [, drop] = useDrop(() => ({
    accept: 'CARD',
    hover: (item: DragItem, monitor) => {
      if (!battlefieldRef.current) return;
      if (item.isOnBattlefield && item.battlefieldId) {
        const offset = monitor.getClientOffset();
        if (offset) {
          const rect = battlefieldRef.current.getBoundingClientRect();
          const x = offset.x - rect.left - 30;
          const y = offset.y - rect.top - 41.75;
          moveCard(item.battlefieldId, x, y);
        }
      }
    },
    drop: (item: DragItem, monitor) => {
      if (!battlefieldRef.current) return;
      const offset = monitor.getClientOffset();
      if (offset) {
        const rect = battlefieldRef.current.getBoundingClientRect();
        const x = offset.x - rect.left - 30;
        const y = offset.y - rect.top - 41.75;
        
        if (!item.isOnBattlefield) {
          addCard(item, x, y, item.tapped || false);
          if (item.handId) {
            removeFromHand(item.handId);
            addMessage(`Player 4 played ${item.name} from hand to battlefield`, item);
          }
        }
      }
    },
  }), [moveCard, addCard, removeFromHand, addMessage]);

  return (
    <div 
      ref={containerRef}
      className="h-screen relative bg-gray-900"
    >
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        <div className="relative">
          <PlayerBattlefield position="top" />
        </div>
        <div className="relative">
          <PlayerBattlefield position="right" />
        </div>
        <div className="relative">
          <PlayerBattlefield position="left" />
        </div>
        <div 
          ref={(node) => {
            battlefieldRef.current = node;
            drop(node);
          }}
          className="relative"
        >
          <PlayerBattlefield position="bottom" isCurrentPlayer={true}>
            {cards.map(({ id, card, x, y, tapped }) => (
              <div
                key={id}
                className="card-element"
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: '60px',
                  transition: 'none'
                }}
              >
                <DraggableCard
                  card={card}
                  battlefieldId={id}
                  isOnBattlefield={true}
                  tapped={tapped}
                />
              </div>
            ))}
          </PlayerBattlefield>
        </div>
      </div>
      <PhaseBar />
      <Hand />
      {selectedPile && (
        <PilePreview
          cards={selectedPile === 'graveyard' ? graveyard : exile}
          title={selectedPile === 'graveyard' ? 'Graveyard' : 'Exile'}
          onClose={() => setSelectedPile(null)}
        />
      )}
    </div>
  );
}