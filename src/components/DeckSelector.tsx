import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useDeckStore } from '../store/deckStore';
import { DeckImport } from './DeckImport';

export function DeckSelector() {
  const { decks, addDeck, setCurrentDeck, currentDeck, deleteDeck } = useDeckStore();
  const [newDeckName, setNewDeckName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState<string | null>(null);

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDeckName.trim()) {
      addDeck(newDeckName.trim());
      setNewDeckName('');
      setIsCreating(false);
    }
  };

  const handleDeleteDeck = (id: string) => {
    setDeckToDelete(id);
  };

  const confirmDelete = () => {
    if (deckToDelete) {
      deleteDeck(deckToDelete);
      setDeckToDelete(null);
    }
  };

  const getCardCount = (deck: typeof decks[0]) => {
    return deck.cards.reduce((sum, card) => sum + card.quantity, 0);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Decks</h2>
        <div className="flex gap-2">
          <DeckImport />
          <button
            onClick={() => setIsCreating(true)}
            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
          >
            <Plus size={20} />
            New Deck
          </button>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateDeck} className="mb-4">
          <input
            type="text"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            placeholder="Deck name..."
            className="w-full px-3 py-2 border rounded-lg"
            autoFocus
          />
        </form>
      )}

      {deckToDelete && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 mb-3">Are you sure you want to delete this deck? This action cannot be undone.</p>
          <div className="flex gap-2">
            <button
              onClick={confirmDelete}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => setDeckToDelete(null)}
              className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {decks.map((deck) => (
          <div
            key={deck.id}
            className={`flex items-center justify-between p-2 rounded-lg ${
              currentDeck?.id === deck.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <button
              onClick={() => setCurrentDeck(deck.id)}
              className="flex-1 text-left"
            >
              {deck.name} ({getCardCount(deck)} cards)
            </button>
            <button
              onClick={() => handleDeleteDeck(deck.id)}
              className={`p-1 rounded-full hover:bg-opacity-20 ${
                currentDeck?.id === deck.id
                  ? 'hover:bg-black text-white'
                  : 'hover:bg-red-500 text-gray-600 hover:text-red-500'
              }`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}