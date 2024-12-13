import React from 'react';
import { useBattlefieldStore } from '../../store/battlefieldStore';
import { socket } from '../../services/socket';
import { gameStorage } from '../../services/gameStorage';

interface CardActionsProps {
  battlefieldId?: string;
  isOnBattlefield: boolean;
  tapped: boolean;
  onContextMenu: (x: number, y: number) => void;
}

export function CardActions({ 
  battlefieldId,
  isOnBattlefield,
  tapped,
  onContextMenu
}: CardActionsProps) {
  const { toggleTapped } = useBattlefieldStore();

  const handleDoubleClick = () => {
    if (isOnBattlefield && battlefieldId) {
      toggleTapped(battlefieldId);
      
      const roomId = gameStorage.getRoomId();
      if (roomId) {
        socket.emit('game:cardTapped', {
          roomId,
          cardId: battlefieldId,
          tapped: !tapped
        });
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOnBattlefield) {
      onContextMenu(e.clientX, e.clientY);
    }
  };

  return {
    handleDoubleClick,
    handleContextMenu
  };
}