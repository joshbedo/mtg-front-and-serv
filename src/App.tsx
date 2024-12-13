import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AppRoutes } from './routes';
import { UIProvider } from './contexts/UIContext';
import { initializeGameSync } from './services/gameSync';

function App() {
  useEffect(() => {
    // Initialize WebSocket event listeners for game synchronization
    initializeGameSync();
  }, []);

  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
        <UIProvider>
          <AppRoutes />
        </UIProvider>
      </DndProvider>
    </Router>
  );
}

export default App;