import React from 'react';

interface TargetingArrowProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export function TargetingArrow({ start, end }: TargetingArrowProps) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx);
  const length = Math.sqrt(dx * dx + dy * dy);

  const arrowHeadSize = 10;
  const arrowHeadAngle = Math.PI / 6;

  const arrowPath = `
    M ${start.x} ${start.y}
    L ${end.x} ${end.y}
    M ${end.x} ${end.y}
    L ${end.x - arrowHeadSize * Math.cos(angle - arrowHeadAngle)} ${end.y - arrowHeadSize * Math.sin(angle - arrowHeadAngle)}
    M ${end.x} ${end.y}
    L ${end.x - arrowHeadSize * Math.cos(angle + arrowHeadAngle)} ${end.y - arrowHeadSize * Math.sin(angle + arrowHeadAngle)}
  `;

  return (
    <svg
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ width: '100vw', height: '100vh' }}
    >
      <path
        d={arrowPath}
        stroke="red"
        strokeWidth="2"
        fill="none"
        className="animate-pulse"
      />
    </svg>
  );
}