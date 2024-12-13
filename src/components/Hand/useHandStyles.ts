import { useMemo } from 'react';

export function useHandStyles() {
  return useMemo(() => {
    return (index: number, total: number, isOpponent: boolean = false) => {
      // Calculate the arc parameters
      const arcRadius = 800; // Larger radius for a gentler curve
      const arcSpread = Math.min(60, total * 5); // Limit total spread angle
      const startAngle = -arcSpread / 2;
      const angleStep = arcSpread / (total - 1 || 1);
      const currentAngle = startAngle + (index * angleStep);
      
      // Convert angle to radians for calculations
      const angleRad = (currentAngle * Math.PI) / 180;
      
      // Calculate position along the arc
      const cardWidth = 120;
      const cardHeight = 167;
      const verticalOffset = isOpponent ? -cardHeight / 2 : cardHeight / 2;
      
      // Calculate base position
      const x = Math.sin(angleRad) * arcRadius;
      const y = Math.cos(angleRad) * arcRadius - arcRadius + verticalOffset;
      
      // Calculate rotation
      const rotation = currentAngle * 0.8; // Reduce rotation for a more natural look
      
      return {
        transform: `translate(calc(${x}px - 50%), ${y}px) rotate(${rotation}deg)`,
        transformOrigin: isOpponent ? 'bottom center' : 'top center',
        zIndex: index,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ':hover': {
          transform: `translate(calc(${x}px - 50%), calc(${y}px - 40px)) rotate(${rotation * 0.5}deg) scale(1.1)`,
          zIndex: 1000
        }
      };
    };
  }, []);
}