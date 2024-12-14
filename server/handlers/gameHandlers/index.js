import { Server, Socket } from "socket.io";
import { handleBattlefieldActions } from "./battlefieldHandlers.js";
import { handleDeckActions } from "./deckHandlers.js";
import { handleLifeActions } from "./lifeHandlers.js";
import { handlePhaseActions } from "./phaseHandlers.js";
import { handleTargetingActions } from "./targetingHandlers.js";

export const handleGameActions = (io, socket) => {
  handleBattlefieldActions(io, socket);
  handleDeckActions(io, socket);
  handleLifeActions(io, socket);
  handlePhaseActions(io, socket);
  handleTargetingActions(io, socket);
};
