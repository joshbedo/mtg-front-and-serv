import React from 'react';
import { useDrop } from 'react-dnd';
import { Card } from '../../types/card';
import { DragItem } from '../../types/drag';
import { useGameStore } from '../../store/gameStore';
import { useLobbyStore } from '../../store/lobbyStore';
import { useBattlefieldStore } from '../../store/battlefieldStore';
import { socket } from '../../services/socket';
import { gameStorage } from '../../services/gameStorage';

interface CardPileProps {
  title: 'Graveyard' | 'Exile';
  cards: Array<Card & { pileId: string }>;
  onClick: () => void;
  isSelected: boolean;
  isCurrentPlayer: boolean;
}

export function CardPile({ title, cards, onClick, isSelected, isCurrentPlayer }: CardPileProps) {
  const { currentUser } = useLobbyStore();
  const { removeCard } = useBattlefieldStore();
  
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'CARD',
    canDrop: (item: DragItem) => {
      return isCurrentPlayer && item.isOnBattlefield;
    },
    drop: (item: DragItem) => {
      if (item.isOnBattlefield && item.battlefieldId) {
        const roomId = gameStorage.getRoomId();
        
        // Remove from battlefield
        removeCard(item.battlefieldId);
        
        // Emit event
        if (roomId && currentUser) {
          socket.emit(`game:cardTo${title}`, {
            roomId,
            card: item,
            pileId: crypto.randomUUID(),
            sourceId: item.battlefieldId,
            playerName: currentUser.name
          });
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [isCurrentPlayer, title, currentUser]);

  return (
    <div
      ref={drop}
      onClick={onClick}
      className={`w-[60px] h-[83.5px] rounded-lg border-2 ${
        isOver && canDrop ? 'border-yellow-400' : 
        !isCurrentPlayer ? 'border-gray-600 opacity-50' :
        isSelected ? 'border-blue-500' : 
        'border-gray-400'
      } flex flex-col items-center justify-center cursor-pointer relative overflow-hidden`}
    >
      {cards.length > 0 ? (
        <img
          src={cards[cards.length - 1].image_uris?.normal}
          alt={cards[cards.length - 1].name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="text-center p-1 text-xs text-white bg-black bg-opacity-50">{title}</div>
      )}
      <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white px-1.5 py-0.5 rounded-full text-xs">
        {cards.length}
      </div>
      {isOver && canDrop && (
        <div className="absolute inset-0 bg-yellow-400 bg-opacity-20" />
      )}
    </div>
  );
}