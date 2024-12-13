import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export function useKeyboardShortcuts() {
  const nextPhase = useGameStore(state => state.nextPhase);
  
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'n') {
        nextPhase();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextPhase]);
}