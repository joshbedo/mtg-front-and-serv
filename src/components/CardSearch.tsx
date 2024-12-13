import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { searchCards } from '../services/scryfallApi';
import { Card } from '../types/card';
import { useDeckStore } from '../store/deckStore';

export function CardSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Card[]>([]);
  const addCard = useDeckStore((state) => state.addCard);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const cards = await searchCards(query);
      setResults(cards);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for cards..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <Search size={20} />
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((card) => (
          <div
            key={card.id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            {card.image_uris?.normal && (
              <img
                src={card.image_uris.normal}
                alt={card.name}
                className="w-full h-auto rounded-lg mb-2"
              />
            )}
            <h3 className="font-bold">{card.name}</h3>
            <button
              onClick={() => addCard({ ...card, quantity: 1 })}
              className="mt-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Add to Deck
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}