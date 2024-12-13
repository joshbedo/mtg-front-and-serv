import React, { useRef, useState, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import { Card } from '../types/card';
import { useBattlefieldStore } from '../store/battlefieldStore';
import { useGameStore } from '../store/gameStore';
import { CardPreviewFollower } from './CardPreviewFollower';
import { CardContextMenu } from './CardContextMenu';
import { CanvasTargetingArrow } from './CanvasTargetingArrow';
import { CardCounters } from './card/CardCounters';

interface DraggableCardProps {
  card: Card;
  className?: string;
  style?: React.CSSProperties;
  isOnBattlefield?: boolean;
  isInHand?: boolean;
  isInPile?: boolean;
  battlefieldId?: string;
  handId?: string;
  pileId?: string;
  pileType?: 'graveyard' | 'exile';
  tapped?: boolean;
  counters?: Array<{ id: string; count: number }>;
  onDragStart?: () => void;
}

export function DraggableCard({ 
  card, 
  className = '', 
  style,
  isOnBattlefield = false,
  isInHand = false,
  isInPile = false,
  battlefieldId,
  handId,
  pileId,
  pileType,
  tapped = false,
  counters = [],
  onDragStart
}: DraggableCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  const { toggleTapped } = useBattlefieldStore();
  const { targeting } = useGameStore();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (targeting.sourceId === battlefieldId) {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
  }, [targeting.sourceId, battlefieldId]);

  React.useEffect(() => {
    if (targeting.sourceId === battlefieldId) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [targeting.sourceId, battlefieldId, handleMouseMove]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: () => {
      if (onDragStart) onDragStart();
      return { 
        ...card, 
        isOnBattlefield,
        isInHand,
        isInPile,
        battlefieldId,
        handId,
        pileId,
        pileType,
        tapped
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [card, isOnBattlefield, isInHand, battlefieldId, handId, tapped]);

  const cardStyle = {
    ...style,
    transform: `rotate(${tapped ? '90deg' : '0deg'}) scale(${isOnBattlefield ? 0.5 : 1})`,
    transformOrigin: 'center center',
    opacity: isDragging ? 0.5 : 1,
    cursor: targeting.sourceId ? 'crosshair' : 'grab',
    transition: isDragging ? 'none' : 'all 0.2s ease-out',
    width: '120px',
  };

  return (
    <>
      <div
        ref={(node) => {
          drag(node);
          if (ref.current !== node) {
            ref.current = node as HTMLDivElement | null;
          }
        }}
        onDoubleClick={() => isOnBattlefield && battlefieldId && toggleTapped(battlefieldId)}
        onContextMenu={(e) => {
          e.preventDefault();
          if (isOnBattlefield) {
            setContextMenu({ x: e.clientX, y: e.clientY });
          }
        }}
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
        className={`${className} select-none rounded-lg shadow-lg hover:shadow-xl transition-shadow relative pb-4`}
        style={cardStyle}
      >
        <div className="rounded-lg overflow-hidden">
          {card.image_uris?.normal && (
            <img
              src={card.image_uris.normal}
              alt={card.name}
              className="w-full h-auto"
              draggable={false}
            />
          )}
        </div>
        {counters?.length > 0 && (
          <CardCounters counters={counters} />
        )}
      </div>
      {showPreview && !isDragging && <CardPreviewFollower card={card} />}
      {contextMenu && (
        <CardContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          card={card}
          cardId={battlefieldId!}
        />
      )}
      {targeting.sourceId === battlefieldId && mousePosition && ref.current && (
        <CanvasTargetingArrow
          start={{
            x: ref.current.getBoundingClientRect().left + ref.current.offsetWidth / 2,
            y: ref.current.getBoundingClientRect().top + ref.current.offsetHeight / 2
          }}
          end={mousePosition}
        />
      )}
    </>
  );
}