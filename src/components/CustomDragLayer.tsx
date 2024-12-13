import React from 'react';
import { useDragLayer } from 'react-dnd';
import { Card } from '../types/card';

interface DragItem extends Card {
  isOnBattlefield?: boolean;
  battlefieldId?: string;
  tapped?: boolean;
}

export function CustomDragLayer() {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem() as DragItem,
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !currentOffset || !item?.image_uris?.normal) {
    return null;
  }

  const cardWidth = item.isOnBattlefield ? 60 : 120; // Half size for battlefield cards
  const cardHeight = item.isOnBattlefield ? 83.5 : 167; // Half size for battlefield cards

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 100,
        left: currentOffset.x - (cardWidth / 2),
        top: currentOffset.y - (cardHeight / 2),
        width: cardWidth,
        opacity: 0.8,
      }}
    >
      <img
        src={item.image_uris.normal}
        alt={item.name}
        className="w-full h-auto rounded-lg"
        style={{
          transform: 'rotate(0deg)',
          transition: 'none',
        }}
      />
    </div>
  );
}