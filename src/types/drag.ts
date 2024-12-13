import { Card } from './card';

export interface DragItem extends Card {
  isOnBattlefield?: boolean;
  isInHand?: boolean;
  isInPile?: boolean;
  battlefieldId?: string;
  handId?: string;
  pileId?: string;
  pileType?: 'graveyard' | 'exile';
  tapped?: boolean;
}