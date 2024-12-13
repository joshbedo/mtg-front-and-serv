import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  name: string | null;
  setName: (name: string) => void;
  clearName: () => void;
  hasCompletedInitialSetup: boolean;
  setHasCompletedInitialSetup: (value: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      name: null,
      hasCompletedInitialSetup: false,
      setName: (name) => set({ name, hasCompletedInitialSetup: true }),
      clearName: () => set({ name: null, hasCompletedInitialSetup: false }),
      setHasCompletedInitialSetup: (value) => set({ hasCompletedInitialSetup: value }),
    }),
    {
      name: 'user-storage',
    }
  )
);