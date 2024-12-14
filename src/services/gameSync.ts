// import { socket } from './socket';
// import { useGameStore } from '../store/gameStore';
// import { useBattlefieldStore } from '../store/battlefieldStore';
// import { useChatStore } from '../store/chatStore';
// import { playCardPlaySound } from '../utils/audioUtils';

// export const initializeGameSync = () => {
//   // Game state updates
//   socket.on('game:state', (state) => {
//     if (state) {
//       useGameStore.getState().setGameState(state);
//     }
//   });

//   // Hand updates
//   socket.on('game:handUpdate', ({ playerId, count, playerName }) => {
//     useBattlefieldStore.setState(state => ({
//       handCounts: {
//         ...state.handCounts,
//         [playerId]: count
//       }
//     }));

//     useChatStore.setState(state => ({
//       messages: [...state.messages, {
//         text: `${playerName} has ${count} cards in hand`,
//         type: 'system',
//         timestamp: Date.now()
//       }]
//     }));
//   });

//   // Card played on battlefield
//   socket.on('game:cardPlayed', ({ card, position, tapped, cardId, playerName }) => {
//     useBattlefieldStore.getState().addCard(card, position.x, position.y, tapped);
//     playCardPlaySound();

//     useChatStore.setState(state => ({
//       messages: [...state.messages, {
//         text: `${playerName} played ${card.name}`,
//         type: 'card',
//         timestamp: Date.now(),
//         card
//       }]
//     }));
//   });

//   // Card moved on battlefield
//   socket.on('game:cardMoved', ({ cardId, position }) => {
//     useBattlefieldStore.getState().moveCard(cardId, position.x, position.y);
//   });

//   // Card tapped/untapped
//   socket.on('game:cardTapped', ({ cardId }) => {
//     useBattlefieldStore.getState().toggleTapped(cardId);
//   });

//   // Card removed from battlefield
//   socket.on('game:cardRemoved', ({ cardId }) => {
//     useBattlefieldStore.getState().removeCard(cardId);
//   });

//   // Card moved to graveyard
//   socket.on('game:cardToGraveyard', ({ card, pileId }) => {
//     useBattlefieldStore.getState().addToGraveyard({ ...card, pileId });
//   });

//   // Card exiled
//   socket.on('game:cardExiled', ({ card, pileId }) => {
//     useBattlefieldStore.getState().addToExile({ ...card, pileId });
//   });
// };
