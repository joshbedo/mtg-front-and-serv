import React, { useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { LifeTotal } from './LifeTotal';
import { socket } from '../../services/socket';
import { useLobbyStore } from '../../store/lobbyStore';

interface LifeCounterProps {
  playerId: string;
}

export function LifeCounter({ playerId }: LifeCounterProps) {
  const life = useGameStore(state => state.life[playerId] ?? 20);
  const { currentUser } = useLobbyStore();
  const debounceTimer = useRef<NodeJS.Timeout>();
  const initialLife = useRef<number>();

  const handleLifeChange = (delta: number) => {
    const oldLife = life;
    const newLife = oldLife + delta;
    
    if (initialLife.current === undefined) {
      initialLife.current = oldLife;
    }
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Update local state immediately for responsiveness
    useGameStore.getState().updateLife(playerId, newLife);
    
    debounceTimer.current = setTimeout(() => {
      const roomId = localStorage.getItem('currentRoomId');
      if (roomId && currentUser) {
        // Only emit life changes if there was an actual change
        if (delta !== 0) {
          socket.emit('game:life', {
            roomId,
            playerId,
            life: newLife,
            delta,
            playerName: currentUser.name
          });
        }
      }
      initialLife.current = undefined;
    }, 500);
  };

  return <LifeTotal life={life} onLifeChange={handleLifeChange} />;
}