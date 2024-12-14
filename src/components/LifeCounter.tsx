import React, { useRef } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useChatStore } from '../store/chatStore';
import { gameEmitters } from '../services/gameSync/emitters';

interface LifeCounterProps {
  playerId: number;
}

export function LifeCounter({ playerId }: LifeCounterProps) {
  const { life, updateLife } = useGameStore();
  const addMessage = useChatStore(state => state.addMessage);

  // Use refs to track the debounce timer and initial life value
  const debounceTimer = useRef<NodeJS.Timeout>();
  const initialLife = useRef<number>();

  const handleLifeChange = (delta: number) => {
    const oldLife = life[playerId];
    const newLife = oldLife + delta;
    // updateLife(playerId, newLife);
    gameEmitters.updateLife(playerId, newLife, delta, 'test');
    // Store the initial life value when starting a sequence of changes
    if (initialLife.current === undefined) {
      initialLife.current = oldLife;
    }

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      const startLife = initialLife.current!;
      const endLife = newLife;
      const action = endLife > startLife ? 'gained' : 'lost';
      gameEmitters.gameChat(`Player ${playerId} ${action} life ${startLife} → ${endLife}`);

      // Reset the initial life value
      initialLife.current = undefined;
    }, 500); // 500ms debounce delay
  };

  return (
    <div className="flex items-center gap-1 bg-gray-700/50 rounded-full px-3 py-1 text-sm font-medium">
      <button
        onClick={() => handleLifeChange(-1)}
        className="text-red-300 hover:text-red-400 transition-colors"
      >
        <Minus size={14} />
      </button>
      <span className="text-gray-200 min-w-[2rem] text-center">
        {life[playerId]}
      </span>
      <button
        onClick={() => handleLifeChange(1)}
        className="text-green-300 hover:text-green-400 transition-colors"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}