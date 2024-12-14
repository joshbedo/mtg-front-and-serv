import {
  initializeGameStateEvents,
  initializeBattlefieldEvents,
  initializeHandEvents,
  initializeLifeEvents,
  initializePileEvents,
  initializeChatEvents,
} from "./events";
export { gameEmitters } from "./emitters";

export const initializeGameSync = () => {
  console.log("initializing game sync");
  // Initialize all event listeners
  initializeGameStateEvents();
  initializeChatEvents();
  initializeBattlefieldEvents();
  initializeHandEvents();
  initializeLifeEvents();
  initializePileEvents();
};
