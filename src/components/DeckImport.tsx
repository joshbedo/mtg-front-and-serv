import React, { useState } from 'react';
import { Import } from 'lucide-react';
import { useDeckStore } from '../store/deckStore';
import { searchCards } from '../services/scryfallApi';
import { Card } from '../types/card';

export function DeckImport() {
  const [isImporting, setIsImporting] = useState(false);
  const [importText, setImportText] = useState('');
  const [status, setStatus] = useState<string>('');
  const { currentDeck, addCard } = useDeckStore();

  const isBasicLand = (name: string) => {
    return ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'].includes(name.trim());
  };

  const getBasicLandCard = (name: string, index: number): Card => {
    const landImages: Record<string, string> = {
      Plains: 'https://cards.scryfall.io/large/front/4/e/4ef17ed4-a9b5-4b8e-b4cb-2ecb7e5898c3.jpg?1730489617',
      Island: 'https://cards.scryfall.io/large/front/2/7/279df7e2-2a3b-464a-a7df-e91da28e3a8c.jpg?1730489639',
      Swamp: 'https://cards.scryfall.io/large/front/3/1/319bc1f0-ee42-44e5-b08b-735613ded2ba.jpg?1730489632',
      Mountain: 'https://cards.scryfall.io/large/front/2/7/279df7e2-2a3b-464a-a7df-e91da28e3a8c.jpg?1730489639',
      Forest: 'https://cards.scryfall.io/large/front/d/2/d232fcc2-12f6-401a-b1aa-ddff11cb9378.jpg?1730489646'
    };

    const trimmedName = name.trim();
    const uniqueId = `${trimmedName.toLowerCase()}-${crypto.randomUUID()}`;
    
    return {
      id: uniqueId,
      name: trimmedName,
      image_uris: {
        normal: landImages[trimmedName],
        small: landImages[trimmedName]
      }
    };
  };

  const parseMTGOList = (text: string) => {
    const cleanText = text.replace(/^\uFEFF/, '').trim();
    const lines = cleanText.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('//'));

    const cardMap = new Map<string, number>();

    for (const line of lines) {
      const match = line.match(/^(\d+)\s+(.+?)(?:\s*$)/);
      if (match) {
        const [, quantityStr, cardName] = match;
        const quantity = parseInt(quantityStr, 10);
        const name = cardName.trim();
        cardMap.set(name, (cardMap.get(name) || 0) + quantity);
      } else if (line.trim()) {
        // Handle cards without quantity (like commanders)
        cardMap.set(line.trim(), (cardMap.get(line.trim()) || 0) + 1);
      }
    }

    return Array.from(cardMap.entries()).map(([name, quantity]) => ({
      name,
      quantity
    }));
  };

  const handleImport = async () => {
    if (!currentDeck) {
      setStatus('Please select a deck first');
      return;
    }

    setStatus('Importing cards...');
    const cardList = parseMTGOList(importText);
    let imported = 0;
    let failed = 0;

    for (const { name, quantity } of cardList) {
      try {
        if (isBasicLand(name)) {
          // Add basic lands with their quantity
          const basicLand = getBasicLandCard(name, 0);
          addCard({ ...basicLand, quantity });
          imported += quantity;
        } else {
          const searchResult = await searchCards(`!"${name}" include:extras`);
          if (searchResult.length > 0) {
            const card = searchResult[0];
            addCard({ ...card, quantity });
            imported += quantity;
          } else {
            console.warn(`Card not found: ${name}`);
            failed++;
          }
        }
        setStatus(`Imported ${imported} cards...`);
      } catch (error) {
        console.error(`Failed to import card: ${name}`, error);
        failed++;
      }

      // Add a small delay between API calls to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    setStatus(`Import complete! ${imported} cards imported${failed > 0 ? `, ${failed} cards failed` : ''}`);
    setImportText('');
    setTimeout(() => setIsImporting(false), 2000);
  };

  if (!isImporting) {
    return (
      <button
        onClick={() => setIsImporting(true)}
        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
      >
        <Import size={20} />
        Import Deck
      </button>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Import MTGO Deck List</h3>
        <button
          onClick={() => setIsImporting(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
      <textarea
        value={importText}
        onChange={(e) => setImportText(e.target.value)}
        placeholder="Paste your MTGO deck list here...&#10;Format:&#10;1 Abzan Falconer&#10;1 Arcane Signet&#10;7 Forest&#10;&#10;1 Tayam, Luminous Enigma"
        className="w-full h-64 px-3 py-2 border rounded-lg mb-4 font-mono text-sm"
      />
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">{status}</span>
        <button
          onClick={handleImport}
          disabled={!importText.trim() || !currentDeck}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Import Cards
        </button>
      </div>
    </div>
  );
}