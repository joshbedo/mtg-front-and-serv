export interface Player {
  id: string;
  name: string;
  socketId?: string;
  position: 'top' | 'right' | 'bottom' | 'left' | null;
  isReady: boolean;
}