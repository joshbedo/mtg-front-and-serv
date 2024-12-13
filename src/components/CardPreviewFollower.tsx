import React, { useState, useEffect } from 'react';
import { Card } from '../types/card';

interface CardPreviewFollowerProps {
  card: Card;
}

export function CardPreviewFollower({ card }: CardPreviewFollowerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!card.image_uris?.normal) return null;

  // Calculate position to keep preview within viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const previewWidth = 300;
  const previewHeight = 418;
  
  let left = position.x + 20;
  let top = position.y;

  // Adjust horizontal position if preview would go off screen
  if (left + previewWidth > viewportWidth) {
    left = position.x - previewWidth - 20;
  }

  // Adjust vertical position if preview would go off screen
  if (top + previewHeight / 2 > viewportHeight) {
    top = viewportHeight - previewHeight / 2;
  } else if (top - previewHeight / 2 < 0) {
    top = previewHeight / 2;
  }

  return (
    <div
      className="fixed z-[10001] pointer-events-none opacity-100 transition-opacity duration-150"
      style={{
        left,
        top,
        transform: 'translate(0, -50%)',
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
  );
}