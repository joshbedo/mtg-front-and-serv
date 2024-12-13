import React from 'react';
import { useBattlefieldStore } from '../store/battlefieldStore';
import { DraggableCard } from './DraggableCard';
import { useGameStore } from '../store/gameStore';
import { useLobbyStore } from '../store/lobbyStore';

export function Hand() {
  const hand = useBattlefieldStore((state) => state.hand);
  const isHandMinimized = useBattlefieldStore((state) => state.isHandMinimized);
  const { currentUser } = useLobbyStore();
  const { players } = useGameStore();
  
  const currentPlayer = players.find(p => p.id === currentUser?.id);
  const isCurrentPlayer = currentPlayer?.position === 'bottom';

  if (!isCurrentPlayer || hand.length === 0) {
    return null;
  }

  const getCardStyles = (index: number, total: number) => {
    const maxSpread = Math.min(total * 30, window.innerWidth * 0.6); // Limit spread width
    const centerOffset = maxSpread / 2;
    const cardWidth = 120;
    const spacing = maxSpread / Math.max(total - 1, 1);
    const baseX = (window.innerWidth / 2) - (cardWidth / 2);
    const x = baseX + (index * spacing) - centerOffset;
    
    // Calculate rotation and vertical offset based on position from center
    const centerIndex = (total - 1) / 2;
    const distanceFromCenter = Math.abs(index - centerIndex);
    const rotation = distanceFromCenter * 3 * (index < centerIndex ? -1 : 1);
    const yOffset = Math.abs(distanceFromCenter) * 5;

    return {
      transform: `translateX(${x}px) translateY(${yOffset}px) rotate(${rotation}deg)`,
      transformOrigin: 'bottom center',
      zIndex: index,
    };
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 h-48 pointer-events-none transition-all duration-300 ease-in-out
        ${isHandMinimized ? 'translate-y-32 opacity-30 hover:translate-y-0 hover:opacity-100' : ''}`}
    >
      <div className="relative w-full h-full">
        {hand.map((card, index) => (
          <div
            key={card.id}
            className="absolute bottom-0 transition-transform duration-200 hover:-translate-y-16 hover:scale-110 pointer-events-auto"
            style={getCardStyles(index, hand.length)}
          >
            <DraggableCard 
              card={card}
              handId={card.id}
              isInHand={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}