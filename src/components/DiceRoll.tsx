import React, { useState } from 'react';
import { Dice1, ChevronDown } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { DiceAnimation } from './DiceAnimation';

type DiceType = 'd6' | 'd10' | 'd20' | 'custom';

interface DiceOption {
  label: string;
  value: DiceType;
  sides: number;
}

const diceOptions: DiceOption[] = [
  { label: 'D6', value: 'd6', sides: 6 },
  { label: 'D10', value: 'd10', sides: 10 },
  { label: 'D20', value: 'd20', sides: 20 },
];

export function DiceRoll() {
  const [customSides, setCustomSides] = useState('');
  const [currentRoll, setCurrentRoll] = useState<{ type: DiceType; result: number | null }>({ type: 'd20', result: null });
  const addMessage = useChatStore(state => state.addMessage);

  const handleRoll = (sides: number, type: DiceType) => {
    const roll = Math.floor(Math.random() * sides) + 1;
    setCurrentRoll({ type, result: roll });
    addMessage(`Player 4 rolled a ${roll} (d${sides})`);
  };

  const handleCustomRoll = (e: React.FormEvent) => {
    e.preventDefault();
    const sides = parseInt(customSides, 10);
    if (sides > 0) {
      handleRoll(sides, 'custom');
      setCustomSides('');
    }
  };

  return (
    <div className="space-y-4">
      {diceOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleRoll(option.sides, option.value)}
          className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded flex items-center gap-2"
        >
          <Dice1 size={16} />
          Roll {option.label}
        </button>
      ))}
      
      <form onSubmit={handleCustomRoll} className="flex gap-2">
        <input
          type="number"
          value={customSides}
          onChange={(e) => setCustomSides(e.target.value)}
          placeholder="Custom sides"
          className="flex-1 px-3 py-1 bg-gray-700 text-white rounded"
          min="1"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <Dice1 size={16} />
          Roll
        </button>
      </form>

      {currentRoll.result !== null && (
        <DiceAnimation
          type={currentRoll.type}
          result={currentRoll.result}
        />
      )}
    </div>
  );
}