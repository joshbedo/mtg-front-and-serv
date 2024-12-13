import { Server, Socket } from 'socket.io';
import { handleBattlefieldActions } from './battlefieldHandlers';
import { handleDeckActions } from './deckHandlers';
import { handleLifeActions } from './lifeHandlers';
import { handlePhaseActions } from './phaseHandlers';
import { handleTargetingActions } from './targetingHandlers';

export const handleGameActions = (io: Server, socket: Socket) => {
  handleBattlefieldActions(io, socket);
  handleDeckActions(io, socket);
  handleLifeActions(io, socket);
  handlePhaseActions(io, socket);
  handleTargetingActions(io, socket);
};