import { create } from 'zustand';

interface ToolboxStore {
  activeToolId: string | null;
  setActiveToolId: (id: string | null) => void;
}

export const useToolboxStore = create<ToolboxStore>((set) => ({
  activeToolId: null,
  setActiveToolId: (id) => set({ activeToolId: id }),
}));