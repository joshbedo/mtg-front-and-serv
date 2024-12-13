import React from 'react';
import { Card } from '../types/card';
import { CardPreview } from './CardPreview';
import { TapIcon } from './TapIcon';

interface ChatMessageProps {
  message: string;
  card?: Card;
  targetCard?: Card;
  type?: 'life' | 'card' | 'phase' | 'system' | 'chat';
  playerName?: string;
}

export function ChatMessage({ message, card, targetCard, type, playerName }: ChatMessageProps) {
  if (type === 'chat' && playerName) {
    return (
      <div className="text-sm text-gray-300">
        <span className="font-medium text-blue-400">{playerName}: </span>
        <span>{message}</span>
      </div>
    );
  }

  if (!card && type === 'life') {
    return (
      <div className="text-xs text-gray-300 border-l-2 border-gray-600 pl-2">
        {message}
      </div>
    );
  }

  if (!card) {
    return (
      <div className="text-xs text-gray-300 border-l-2 border-gray-600 pl-2">
        {message}
      </div>
    );
  }

  const isTapAction = message.includes('tapped') || message.includes('untapped');
  const isTapped = message.includes('tapped') && !message.includes('untapped');

  const renderCardName = (cardToRender: Card, text: string) => (
    <CardPreview card={cardToRender}>
      <span className="text-blue-400 hover:text-blue-300 cursor-pointer">
        {text}
      </span>
    </CardPreview>
  );

  let parts = message;
  let elements: React.ReactNode[] = [];
  let lastIndex = 0;

  const cardMatches = [
    { card, name: card.name },
    ...(targetCard ? [{ card: targetCard, name: targetCard.name }] : [])
  ];

  const matches = cardMatches.reduce<Array<{ index: number; card: Card; name: string }>>((acc, { card, name }) => {
    let pos = -1;
    let lastPos = 0;
    while ((pos = message.indexOf(name, lastPos)) !== -1) {
      acc.push({ index: pos, card, name });
      lastPos = pos + 1;
    }
    return acc;
  }, []).sort((a, b) => a.index - b.index);

  matches.forEach((match, i) => {
    if (match.index > lastIndex) {
      elements.push(
        <React.Fragment key={`text-${i}`}>
          {message.substring(lastIndex, match.index)}
        </React.Fragment>
      );
    }
    elements.push(
      <React.Fragment key={`card-${i}`}>
        {renderCardName(match.card, match.name)}
      </React.Fragment>
    );
    lastIndex = match.index + match.name.length;
  });

  if (lastIndex < message.length) {
    elements.push(
      <React.Fragment key="text-end">
        {message.substring(lastIndex)}
      </React.Fragment>
    );
  }

  return (
    <div className="text-xs text-gray-300 border-l-2 border-gray-600 pl-2">
      {isTapAction && <TapIcon tapped={isTapped} className="mr-1 text-blue-400" />}
      {elements}
    </div>
  );
}