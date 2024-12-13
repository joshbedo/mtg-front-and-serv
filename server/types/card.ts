export interface Card {
  id: string;
  name: string;
  image_uris?: {
    normal: string;
    small: string;
  };
  mana_cost?: string;
  type_line?: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  oracle_id?: string;
}

export interface DeckCard extends Card {
  quantity: number;
}