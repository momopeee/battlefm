
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the types for our context
type Screen = 'start' | 'battle1' | 'victory1' | 'select' | 'battle2' | 'endingA' | 'endingB' | 'endingC';

interface AppContextType {
  currentScreen: Screen;
  bgmEnabled: boolean;
  playerHP: number;
  enemyHP: number;
  battleTimer: number;
  totalComments: number;
  toggleBgm: () => void;
  handleScreenTransition: (screen: Screen) => void;
  updatePlayerHP: (hp: number) => void;
  updateEnemyHP: (hp: number) => void;
  incrementComments: () => void;
  resetBattle: () => void;
}

// Create the context with default values
const AppContext = createContext<AppContextType>({
  currentScreen: 'start',
  bgmEnabled: true,
  playerHP: 100,
  enemyHP: 70,
  battleTimer: 0,
  totalComments: 0,
  toggleBgm: () => {},
  handleScreenTransition: () => {},
  updatePlayerHP: () => {},
  updateEnemyHP: () => {},
  incrementComments: () => {},
  resetBattle: () => {},
});

// Create the provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(70);
  const [battleTimer, setBattleTimer] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Toggle BGM on/off
  const toggleBgm = () => {
    setBgmEnabled(!bgmEnabled);
  };

  // Handle screen transitions
  const handleScreenTransition = (screen: Screen) => {
    setCurrentScreen(screen);
    
    // Reset battle timer when entering battle screens
    if (screen === 'battle1' || screen === 'battle2') {
      setBattleTimer(0);
      startTimer();
    } else {
      stopTimer();
    }
  };

  // Update player HP
  const updatePlayerHP = (hp: number) => {
    setPlayerHP(hp);
    
    // Check for game over condition
    if (hp <= 0) {
      if (currentScreen === 'battle1') {
        setTimeout(() => handleScreenTransition('endingB'), 20000);
      } else if (currentScreen === 'battle2') {
        setTimeout(() => handleScreenTransition('endingC'), 20000);
      }
    }
  };

  // Update enemy HP
  const updateEnemyHP = (hp: number) => {
    setEnemyHP(hp);
    
    // Check for victory condition
    if (hp <= 0) {
      if (currentScreen === 'battle1') {
        setTimeout(() => handleScreenTransition('victory1'), 20000);
      } else if (currentScreen === 'battle2') {
        setTimeout(() => handleScreenTransition('endingA'), 20000);
      }
    }
  };

  // Increment comments counter
  const incrementComments = () => {
    setTotalComments(prev => prev + 1);
  };

  // Reset battle state
  const resetBattle = () => {
    setPlayerHP(100);
    setEnemyHP(70);
    setBattleTimer(0);
    setTotalComments(0);
  };

  // Start battle timer
  const startTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const interval = setInterval(() => {
      setBattleTimer(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
  };

  // Stop battle timer
  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Context value
  const contextValue: AppContextType = {
    currentScreen,
    bgmEnabled,
    playerHP,
    enemyHP,
    battleTimer,
    totalComments,
    toggleBgm,
    handleScreenTransition,
    updatePlayerHP,
    updateEnemyHP,
    incrementComments,
    resetBattle,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the app context
export const useApp = () => useContext(AppContext);
