import { Card } from '../types/card';

export function getCardFromMessage(message: string): Card | undefined {
  // This is a placeholder implementation. In a real application,
  // you would maintain a reference to the actual card object when creating the message,
  // or implement a more sophisticated parsing mechanism.
  const cardNameMatch = message.match(/(?:played|moved|tapped|untapped|exiled|added) (.*?)(?= (?:from|to|on|from))/);
  if (cardNameMatch) {
    return {
      id: '',
      name: cardNameMatch[1],
      image_uris: {
        normal: '', // You would need the actual image URL here
        small: ''
      }
    };
  }
  return undefined;
}