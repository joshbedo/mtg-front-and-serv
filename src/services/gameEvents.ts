import { socket } from './socket';
import { useGameStore } from '../store/gameStore';
import { useBattlefieldStore } from '../store/battlefieldStore';
import { useChatStore } from '../store/chatStore';
import { GameState } from '../types/game';

export const initializeGameEvents = () => {
  // Game state updates
  socket.on('game:state', (state: GameState) => {
    const gameStore = useGameStore.getState();
    if (gameStore && typeof gameStore.setGameState === 'function') {
      gameStore.setGameState(state);
    }
  });

  // Chat messages
  socket.on('chat:message', (message) => {
    useChatStore.setState(state => ({
      messages: [...state.messages, message]
    }));
  });

  // Game actions
  socket.on('game:action', (message) => {
    useChatStore.setState(state => ({
      messages: [...state.messages, message]
    }));
  });

  // Life changes
  socket.on('game:lifeChanged', ({ playerId, life, delta, playerName }) => {
    const gameStore = useGameStore.getState();
    if (gameStore && typeof gameStore.updateLife === 'function') {
      gameStore.updateLife(playerId, life);
    }
    
    const action = delta > 0 ? 'gained' : 'lost';
    const prevLife = life - delta;
    
    useChatStore.setState(state => ({
      messages: [...state.messages, {
        text: `${playerName} ${action} ${Math.abs(delta)} life (${prevLife} → ${life})`,
        type: 'life',
        timestamp: Date.now(),
        playerName
      }]
    }));
  });

  // Card played
  socket.on('game:cardPlayed', ({ card, position, playerName }) => {
    const battlefieldStore = useBattlefieldStore.getState();
    if (battlefieldStore && typeof battlefieldStore.addCard === 'function') {
      battlefieldStore.addCard(card, position.x, position.y);
    }
  });

  // System messages
  socket.on('chat:system', (text: string) => {
    useChatStore.setState(state => ({
      messages: [...state.messages, {
        text,
        type: 'system',
        timestamp: Date.now()
      }]
    }));
  });
};