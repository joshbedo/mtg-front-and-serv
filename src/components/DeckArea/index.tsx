import React from 'react';
import { useDeckArea } from './useDeckArea';
import { DeckContextMenu } from '../DeckContextMenu';
import { MTG_CARD_BACK } from '../../constants/gameAssets';

export function DeckArea() {
  const {
    displayedCardCount,
    contextMenu,
    imageError,
    handleContextMenu,
    handleImageError,
    handleCloseMenu,
    showDeckPrompt
  } = useDeckArea();

  return (
    <>
      <div 
        className="relative w-[70px] h-[97.5px] rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500"
        onClick={handleContextMenu}
      >
        {!imageError ? (
          <img
            src={MTG_CARD_BACK}
            alt="Deck"
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-white text-xs font-medium">Deck</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          {showDeckPrompt ? (
            <span className="text-white text-xs font-medium text-center px-2">
              Select Deck
            </span>
          ) : (
            <span className="text-white font-bold text-lg">
              {displayedCardCount}
            </span>
          )}
        </div>
      </div>
      
      {contextMenu && (
        <DeckContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseMenu}
          showSelectPrompt={showDeckPrompt}
        />
      )}
    </>
  );
}