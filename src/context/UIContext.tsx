
import React, { createContext, useContext, useState } from 'react';

// Define types for our app
export type Screen = 'start' | 'battle1' | 'victory1' | 'select' | 'battle2' | 'endingA' | 'endingB' | 'endingC';

interface UIContextType {
  currentScreen: Screen;
  bgmEnabled: boolean;
  
  toggleBgm: () => void;
  handleScreenTransition: (screen: Screen) => void;
}

const UIContext = createContext<UIContextType>({
  currentScreen: 'start',
  bgmEnabled: true,
  
  toggleBgm: () => {},
  handleScreenTransition: () => {},
});

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [bgmEnabled, setBgmEnabled] = useState(true);

  // Toggle BGM on/off
  const toggleBgm = () => {
    setBgmEnabled(!bgmEnabled);
  };

  // Handle screen transitions
  const handleScreenTransition = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const value = {
    currentScreen,
    bgmEnabled,
    toggleBgm,
    handleScreenTransition,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
