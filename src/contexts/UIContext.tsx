import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
  isContextMenuOpen: boolean;
  setIsContextMenuOpen: (isOpen: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  return (
    <UIContext.Provider value={{ isContextMenuOpen, setIsContextMenuOpen }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}