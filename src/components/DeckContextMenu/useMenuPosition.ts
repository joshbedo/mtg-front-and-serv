import { useState, useEffect } from 'react';

export function useMenuPosition(x: number, y: number) {
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    const menuWidth = 200;
    const menuHeight = 160;
    const padding = 8;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    if (x + menuWidth + padding > viewportWidth) {
      adjustedX = x - menuWidth;
    }

    if (y + menuHeight + padding > viewportHeight) {
      adjustedY = y - menuHeight;
    }

    adjustedX = Math.max(padding, Math.min(viewportWidth - menuWidth - padding, adjustedX));
    adjustedY = Math.max(padding, Math.min(viewportHeight - menuHeight - padding, adjustedY));

    setPosition({ x: adjustedX, y: adjustedY });
  }, [x, y]);

  return position;
}