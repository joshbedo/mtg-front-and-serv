import { Position, Player } from '../../types/game';

interface QuadrantLayout {
  position: Position;
  width?: string;
  left?: string;
}

export function useQuadrantLayout(players: Player[]) {
  const getLayout = (): QuadrantLayout[] => {
    const count = players.length;
    
    switch (count) {
      case 1:
        return [{ position: 'bottom' }];
      case 2:
        return [
          { position: 'top' },
          { position: 'bottom' }
        ];
      case 3:
        return [
          { position: 'top', width: '50%', left: '0%' },
          { position: 'top', width: '50%', left: '50%' },
          { position: 'bottom', width: '100%', left: '0%' }
        ];
      case 4:
        return [
          { position: 'top' },
          { position: 'right' },
          { position: 'bottom' },
          { position: 'left' }
        ];
      default:
        return [];
    }
  };

  return getLayout();
}