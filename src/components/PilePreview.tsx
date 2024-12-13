import React from 'react';
import { X } from 'lucide-react';
import { Card } from '../types/card';
import { DraggableCard } from './DraggableCard';

interface PilePreviewProps {
  cards: Array<Card & { pileId: string }>;
  title: string;
  onClose: () => void;
}

export function PilePreview({ cards, title, onClose }: PilePreviewProps) {
  if (cards.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-[1000px] max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            {title} ({cards.length} cards)
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-5 gap-4 p-4">
            {cards.map((card) => (
              <div key={card.pileId} className="relative group">
                <DraggableCard
                  card={card}
                  pileId={card.pileId}
                  isInPile={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}