import {
  initializeGameStateEvents,
  initializeBattlefieldEvents,
  initializeHandEvents,
  initializeLifeEvents,
  initializePileEvents
} from './events';
export { gameEmitters } from './emitters';

export const initializeGameSync = () => {
  // Initialize all event listeners
  initializeGameStateEvents();
  initializeBattlefieldEvents();
  initializeHandEvents();
  initializeLifeEvents();
  initializePileEvents();
};