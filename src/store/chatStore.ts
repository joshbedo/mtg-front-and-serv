import { create } from 'zustand';
import { Card } from '../types/card';
import { socket } from '../services/socket';
import { useLobbyStore } from './lobbyStore';

interface ChatMessage {
  text: string;
  card?: Card;
  targetCard?: Card;
  timestamp: number;
  type?: 'life' | 'card' | 'phase' | 'system' | 'chat';
  lifeDelta?: number;
  playerName?: string;
}

interface ChatStore {
  messages: ChatMessage[];
  position: { x: number; y: number };
  addMessage: (text: string, card?: Card, targetCard?: Card, type?: 'life' | 'card' | 'phase' | 'system' | 'chat', lifeDelta?: number) => void;
  addChatMessage: (text: string) => void;
  clear: () => void;
  setPosition: (position: { x: number; y: number }) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  position: { x: window.innerWidth - 340, y: 128 },
  
  addMessage: (text, card, targetCard, type, lifeDelta) => {
    const { currentUser } = useLobbyStore.getState();
    const roomId = localStorage.getItem('currentRoomId');
    
    if (roomId && currentUser) {
      socket.emit('game:action', { 
        roomId, 
        message: {
          text,
          card,
          targetCard,
          type,
          lifeDelta,
          playerName: currentUser.name,
          timestamp: Date.now()
        }
      });
    }
  },

  addChatMessage: (text) => {
    const { currentUser } = useLobbyStore.getState();
    const roomId = localStorage.getItem('currentRoomId');
    
    if (roomId && currentUser) {
      socket.emit('game:chat', { 
        roomId, 
        text,
        playerName: currentUser.name
      });
    }
  },
  
  clear: () => set({ messages: [] }),
  setPosition: (position) => set({ position }),
}));