import React from 'react';
import { Trash2 } from 'lucide-react';
import { useDeckStore } from '../store/deckStore';
import { CardPreview } from './CardPreview';

export function DeckList() {
  const { currentDeck, removeCard, updateQuantity } = useDeckStore();

  const getTotalCardCount = () => {
    if (!currentDeck) return 0;
    return currentDeck.cards.reduce((sum, card) => sum + (card.quantity || 0), 0);
  };

  if (!currentDeck) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-gray-500">Select or create a deck to get started</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">
        {currentDeck.name} ({getTotalCardCount()} cards)
      </h2>
      <div className="space-y-2">
        {currentDeck.cards.map((card) => (
          <div
            key={card.id}
            className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <CardPreview card={card}>
                {card.image_uris?.small && (
                  <img
                    src={card.image_uris.small}
                    alt={card.name}
                    className="w-12 h-12 rounded"
                  />
                )}
              </CardPreview>
              <CardPreview card={card}>
                <span className="cursor-pointer hover:text-blue-500">{card.name}</span>
              </CardPreview>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="99"
                value={card.quantity || 1}
                onChange={(e) => updateQuantity(card.id, parseInt(e.target.value, 10))}
                className="w-16 px-2 py-1 border rounded"
              />
              <button
                onClick={() => removeCard(card.id)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}