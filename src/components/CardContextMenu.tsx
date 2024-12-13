import React, { useState, useEffect } from 'react';
import { Target, Plus, Minus, Vibrate } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useBattlefieldStore } from '../store/battlefieldStore';
import { useChatStore } from '../store/chatStore';
import { useUI } from '../contexts/UIContext';
import { Card } from '../types/card';

interface CardContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  card: Card;
  cardId: string;
}

export function CardContextMenu({ x, y, onClose, card, cardId }: CardContextMenuProps) {
  const startTargeting = useGameStore(state => state.startTargeting);
  const { cards, initializeCounter, addCounter, removeCounter, shakeCard } = useBattlefieldStore();
  const addMessage = useChatStore(state => state.addMessage);
  const { setIsContextMenuOpen } = useUI();
  const cardState = cards.find(c => c.id === cardId);
  const [counterQuantity, setCounterQuantity] = useState(1);

  useEffect(() => {
    setIsContextMenuOpen(true);
    return () => setIsContextMenuOpen(false);
  }, [setIsContextMenuOpen]);

  const handleStartTargeting = () => {
    startTargeting(cardId, card.name, card);
    onClose();
  };

  const handleAddCounter = () => {
    if (!cardState?.counters.length) {
      initializeCounter(cardId, counterQuantity);
      addMessage(`Added ${counterQuantity} counter(s) to ${card.name}`, card);
    } else {
      const counter = cardState.counters[0];
      addCounter(cardId, counter.id);
      addMessage(`Added a counter to ${card.name} (${counter.count + 1} total)`, card);
    }
  };

  const handleRemoveCounter = () => {
    if (cardState?.counters.length) {
      const counter = cardState.counters[0];
      removeCounter(cardId, counter.id);
      addMessage(`Removed a counter from ${card.name} (${counter.count - 1} total)`, card);
    }
  };

  const handleShake = () => {
    shakeCard(cardId);
    addMessage(`Shook ${card.name}`, card);
    onClose();
  };

  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    left: x,
    top: y,
    zIndex: 1000,
  };

  return (
    <>
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div
        className="bg-gray-800 rounded-lg shadow-lg p-2 min-w-[200px]"
        style={menuStyle}
      >
        <button
          onClick={handleStartTargeting}
          className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded flex items-center gap-2"
        >
          <Target size={16} />
          Target
        </button>
        <button
          onClick={handleShake}
          className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded flex items-center gap-2"
        >
          <Vibrate size={16} />
          Shake
        </button>
        <div className="h-px bg-gray-700 my-1" />
        <div className="px-4 py-2 text-white">
          <div className="flex flex-col gap-2">
            {cardState?.counters.map(counter => (
              <div key={counter.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center text-xs font-bold border border-white/20">
                    {counter.count}
                  </div>
                  <span>counters</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleRemoveCounter}
                    className="p-1 hover:bg-gray-700 rounded"
                    disabled={counter.count <= 0}
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    onClick={handleAddCounter}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
            {!cardState?.counters.length && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddCounter}
                  className="px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm flex items-center gap-1"
                >
                  <Plus size={14} />
                  Add Counter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}