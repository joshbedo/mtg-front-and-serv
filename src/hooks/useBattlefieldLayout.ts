import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { useLobbyStore } from '../store/lobbyStore';
import { Player, Position } from '../types/game';

interface QuadrantLayout {
  player: Player | null;
  position: Position;
  isCurrentPlayer: boolean;
  style: React.CSSProperties;
}

export function useBattlefieldLayout() {
  const { players } = useGameStore();
  const { currentUser } = useLobbyStore();

  return useMemo(() => {
    // Find current player's index
    const currentPlayerIndex = players.findIndex(p => p.id === currentUser?.id);
    if (currentPlayerIndex === -1) return [];

    // Rotate player array so current player is always at bottom
    const rotatedPlayers = [
      ...players.slice(currentPlayerIndex),
      ...players.slice(0, currentPlayerIndex)
    ];

    // Map players to positions based on count
    const positions: Position[] = ['bottom', 'top', 'right', 'left'];
    const layouts: QuadrantLayout[] = [];

    rotatedPlayers.forEach((player, index) => {
      if (index >= positions.length) return;

      const position = positions[index];
      const style = getPositionStyle(position, players.length);

      layouts.push({
        player,
        position,
        isCurrentPlayer: player.id === currentUser?.id,
        style
      });
    });

    return layouts;
  }, [players, currentUser]);
}

function getPositionStyle(position: Position, playerCount: number): React.CSSProperties {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    transition: 'all 0.3s ease-out'
  };

  switch (position) {
    case 'bottom':
      return {
        ...baseStyle,
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%'
      };
    case 'top':
      return {
        ...baseStyle,
        top: 0,
        left: playerCount === 2 ? 0 : '25%',
        right: playerCount === 2 ? 0 : '25%',
        height: '50%'
      };
    case 'right':
      return {
        ...baseStyle,
        top: 0,
        right: 0,
        width: '50%',
        height: '100%'
      };
    case 'left':
      return {
        ...baseStyle,
        top: 0,
        left: 0,
        width: '50%',
        height: '100%'
      };
  }
}