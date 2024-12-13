import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useBattlefieldStore } from '../store/battlefieldStore';
import { useChatStore } from '../store/chatStore';

const TOKEN_TYPES = [
  { name: 'Angel', power: '4', toughness: '4', image: 'https://cards.scryfall.io/art_crop/front/7/c/7c8798e9-c46f-4175-97b5-776f9e366c23.jpg' },
  { name: 'Soldier', power: '1', toughness: '1', image: 'https://cards.scryfall.io/art_crop/front/5/4/54f53e3d-b466-4b7c-af5c-86c17ad18b36.jpg' },
  { name: 'Spirit', power: '1', toughness: '1', image: 'https://cards.scryfall.io/art_crop/front/f/8/f8df0dae-c021-4f23-8e42-c5f52481c27f.jpg' },
  { name: 'Zombie', power: '2', toughness: '2', image: 'https://cards.scryfall.io/art_crop/front/6/a/6a11f69e-c8d4-4591-a28f-757e4c32f0fe.jpg' },
];

export function TokenCreator() {
  const [selectedToken, setSelectedToken] = useState(TOKEN_TYPES[0]);
  const addCard = useBattlefieldStore(state => state.addCard);
  const addMessage = useChatStore(state => state.addMessage);

  const createToken = () => {
    const token = {
      id: crypto.randomUUID(),
      name: `${selectedToken.name} Token`,
      image_uris: {
        normal: selectedToken.image,
        small: selectedToken.image
      },
      power: selectedToken.power,
      toughness: selectedToken.toughness,
      type_line: `Token Creature — ${selectedToken.name}`
    };

    // Add token to the center of the battlefield
    addCard(token, window.innerWidth / 2 - 30, window.innerHeight / 2 - 41.75);
    addMessage(`Player 4 created a ${selectedToken.name} token`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {TOKEN_TYPES.map((token) => (
          <button
            key={token.name}
            onClick={() => setSelectedToken(token)}
            className={`p-2 rounded-lg text-left ${
              selectedToken.name === token.name
                ? 'bg-blue-500/20 ring-2 ring-blue-500'
                : 'hover:bg-gray-700'
            }`}
          >
            <img
              src={token.image}
              alt={token.name}
              className="w-full h-20 object-cover rounded-lg mb-2"
            />
            <div className="text-sm font-medium">{token.name}</div>
            <div className="text-xs text-gray-400">{token.power}/{token.toughness}</div>
          </button>
        ))}
      </div>

      <button
        onClick={createToken}
        className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        Create {selectedToken.name} Token
      </button>
    </div>
  );
}