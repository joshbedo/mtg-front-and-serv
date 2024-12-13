import React, { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { useChatStore } from '../store/chatStore';
import { MessageCircle, GripHorizontal, Send } from 'lucide-react';
import { ChatMessage } from './ChatMessage';

export function ChatSidebar() {
  const messages = useChatStore((state) => state.messages);
  const position = useChatStore((state) => state.position);
  const setPosition = useChatStore((state) => state.setPosition);
  const addChatMessage = useChatStore((state) => state.addChatMessage);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      addChatMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CHAT',
    item: { type: 'CHAT', x: position.x, y: position.y },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [position]);

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        opacity: isDragging ? 0.5 : 1,
        zIndex: 50,
      }}
      className="w-80 max-h-[400px] bg-gray-800/95 text-white rounded-lg shadow-lg overflow-hidden flex flex-col"
    >
      <div 
        ref={drag}
        className="p-3 border-b border-gray-700 cursor-move flex items-center gap-2"
      >
        <GripHorizontal size={18} className="text-gray-400" />
        <MessageCircle size={18} />
        <h2 className="text-sm font-semibold">Game Log</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {messages.map((message, index) => (
          <ChatMessage
            key={`${message.timestamp}-${index}`}
            message={message.text}
            card={message.card}
            targetCard={message.targetCard}
            type={message.type}
            playerName={message.playerName}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-2 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-1.5 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}