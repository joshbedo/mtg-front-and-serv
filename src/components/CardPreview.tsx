import React, { useState } from 'react';
import { Card } from '../types/card';
import { useUI } from '../contexts/UIContext';

interface CardPreviewProps {
  card: Card;
  children: React.ReactNode;
  position?: { x: number; y: number };
}

export function CardPreview({ card, children, position }: CardPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { isContextMenuOpen } = useUI();

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    setShowPreview(true);
  };

  const handleMouseLeave = () => {
    setShowPreview(false);
  };

  if (!card.image_uris?.normal) {
    return <>{children}</>;
  }

  // Calculate position to keep preview within viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const previewWidth = 300;
  const previewHeight = 418;
  
  const currentPosition = position || mousePosition;
  let left = currentPosition.x + 20;
  let top = currentPosition.y;

  // Adjust horizontal position if preview would go off screen
  if (left + previewWidth > viewportWidth) {
    left = currentPosition.x - previewWidth - 20;
  }

  // Adjust vertical position if preview would go off screen
  if (top + previewHeight / 2 > viewportHeight) {
    top = viewportHeight - previewHeight / 2;
  } else if (top - previewHeight / 2 < 0) {
    top = previewHeight / 2;
  }

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {children}
      </div>
      {showPreview && !isContextMenuOpen && (
        <div
          className="fixed pointer-events-none opacity-100 transition-opacity duration-150"
          style={{
            left,
            top,
            transform: 'translate(0, -50%)',
            zIndex: 100000,
          }}
        >
          <img
            src={card.image_uris.normal}
            alt={card.name}
            className="rounded-lg shadow-xl"
            style={{
              width: previewWidth,
              height: 'auto',
            }}
          />
        </div>
      )}
    </>
  );
}