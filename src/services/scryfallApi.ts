import axios from 'axios';
import { Card } from '../types/card';

const SCRYFALL_API = 'https://api.scryfall.com';

export const searchCards = async (query: string): Promise<Card[]> => {
  try {
    const response = await axios.get(`${SCRYFALL_API}/cards/search`, {
      params: { q: query },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error searching cards:', error);
    return [];
  }
};

export const getCardById = async (id: string): Promise<Card | null> => {
  try {
    const response = await axios.get(`${SCRYFALL_API}/cards/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching card:', error);
    return null;
  }
};