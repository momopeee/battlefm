import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types for our app
export type Screen = 'start' | 'battle1' | 'victory1' | 'select' | 'battle2' | 'endingA' | 'endingB' | 'endingC';

export interface Character {
  name: string;
  icon: string;
  maxHp: number;
  currentHp: number;
  attackMin: number;
  attackMax: number;
  specialPower: number;
}

export interface Comment {
  author: string;
  text: string;
  isSystem?: boolean;
}

interface AppContextType {
  currentScreen: Screen;
  bgmEnabled: boolean;
  player: Character;
  opponent1: Character;
  opponent2: Character;
  battleTimer: number;
  comments: Comment[];
  attackCount: number;
  specialAttackAvailable: boolean;
  highballMode: boolean;
  sosoHealMode: boolean;
  yujiSpecialMode: boolean;
  showCharacterSheet: boolean;
  currentCharacterSheet: 'player' | 'opponent1' | 'opponent2' | null;
  totalComments: number;
  
  // Methods
  toggleBgm: () => void;
  handleScreenTransition: (screen: Screen) => void;
  setPlayer: (player: Character) => void;
  setOpponent1: (opponent: Character) => void;
  setOpponent2: (opponent: Character) => void;
  resetBattleTimer: () => void;
  startBattleTimer: () => void;
  addComment: (author: string, text: string, isSystem?: boolean) => void;
  clearComments: () => void;
  setAttackCount: (count: number) => void;
  setSpecialAttackAvailable: (available: boolean) => void;
  setHighballMode: (mode: boolean) => void;
  setSosoHealMode: (mode: boolean) => void;
  setYujiSpecialMode: (mode: boolean) => void;
  setShowCharacterSheet: (show: boolean) => void;
  setCurrentCharacterSheet: (character: 'player' | 'opponent1' | 'opponent2' | null) => void;
  incrementComments: () => void;
}

// Create the context with default values
const AppContext = createContext<AppContextType>({
  currentScreen: 'start',
  bgmEnabled: true,
  player: {
    name: 'とおる＠経営参謀',
    icon: '/lovable-uploads/c1b2b6d0-3acd-4ea0-b336-0631411ff128.png',
    maxHp: 100,
    currentHp: 100,
    attackMin: 15,
    attackMax: 25,
    specialPower: 40
  },
  opponent1: {
    name: 'そーそー＠狂犬ツイート',
    icon: '/lovable-uploads/fe83fabb-d53f-4b39-8b88-170eb64b66f1.png',
    maxHp: 70,
    currentHp: 70,
    attackMin: 20,
    attackMax: 30,
    specialPower: 0
  },
  opponent2: {
    name: 'ゆうじ＠陽気なおじさん',
    icon: '/lovable-uploads/87eeca18-7288-449e-b4dc-8a6b2d6ad9a9.png',
    maxHp: 100,
    currentHp: 100,
    attackMin: 15,
    attackMax: 25,
    specialPower: 40
  },
  battleTimer: 0,
  comments: [],
  attackCount: 0,
  specialAttackAvailable: false,
  highballMode: false,
  sosoHealMode: false,
  yujiSpecialMode: false,
  showCharacterSheet: false,
  currentCharacterSheet: null,
  totalComments: 0,
  
  toggleBgm: () => {},
  handleScreenTransition: () => {},
  setPlayer: () => {},
  setOpponent1: () => {},
  setOpponent2: () => {},
  resetBattleTimer: () => {},
  startBattleTimer: () => {},
  addComment: () => {},
  clearComments: () => {},
  setAttackCount: () => {},
  setSpecialAttackAvailable: () => {},
  setHighballMode: () => {},
  setSosoHealMode: () => {},
  setYujiSpecialMode: () => {},
  setShowCharacterSheet: () => {},
  setCurrentCharacterSheet: () => {},
  incrementComments: () => {},
});

// Create the provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const [player, setPlayerState] = useState<Character>({
    name: 'とおる＠経営参謀',
    icon: '/lovable-uploads/c1b2b6d0-3acd-4ea0-b336-0631411ff128.png',
    maxHp: 100,
    currentHp: 100,
    attackMin: 15,
    attackMax: 25,
    specialPower: 40
  });
  const [opponent1, setOpponent1State] = useState<Character>({
    name: 'そーそー＠狂犬ツイート',
    icon: '/lovable-uploads/fe83fabb-d53f-4b39-8b88-170eb64b66f1.png',
    maxHp: 70,
    currentHp: 70,
    attackMin: 20,
    attackMax: 30,
    specialPower: 0
  });
  const [opponent2, setOpponent2State] = useState<Character>({
    name: 'ゆうじ＠陽気なおじさん',
    icon: '/lovable-uploads/87eeca18-7288-449e-b4dc-8a6b2d6ad9a9.png',
    maxHp: 100,
    currentHp: 100,
    attackMin: 15,
    attackMax: 25,
    specialPower: 40
  });
  const [battleTimer, setBattleTimer] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [attackCount, setAttackCount] = useState(0);
  const [specialAttackAvailable, setSpecialAttackAvailable] = useState(false);
  const [highballMode, setHighballMode] = useState(false);
  const [sosoHealMode, setSosoHealMode] = useState(false);
  const [yujiSpecialMode, setYujiSpecialMode] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  const [currentCharacterSheet, setCurrentCharacterSheet] = useState<'player' | 'opponent1' | 'opponent2' | null>(null);
  const [totalComments, setTotalComments] = useState(0);

  // Toggle BGM on/off
  const toggleBgm = () => {
    setBgmEnabled(!bgmEnabled);
  };

  // Handle screen transitions
  const handleScreenTransition = (screen: Screen) => {
    setCurrentScreen(screen);
    
    // Reset battle timer when entering battle screens
    if (screen === 'battle1' || screen === 'battle2') {
      resetBattleTimer();
      startBattleTimer();
    } else {
      stopTimer();
    }
  };

  // Update player character
  const setPlayer = (updatedPlayer: Character) => {
    setPlayerState(updatedPlayer);
  };

  // Update opponent1 character
  const setOpponent1 = (updatedOpponent: Character) => {
    setOpponent1State(updatedOpponent);
  };

  // Update opponent2 character
  const setOpponent2 = (updatedOpponent: Character) => {
    setOpponent2State(updatedOpponent);
  };

  // Reset battle timer
  const resetBattleTimer = () => {
    setBattleTimer(0);
  };

  // Start battle timer
  const startBattleTimer = () => {
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

  // Add comment to the chat
  const addComment = (author: string, text: string, isSystem: boolean = false) => {
    setComments(prev => [...prev, { author, text, isSystem }]);
    incrementComments();
  };

  // Clear all comments
  const clearComments = () => {
    setComments([]);
  };

  // Increment total comments counter
  const incrementComments = () => {
    setTotalComments(prev => prev + 1);
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
    player,
    opponent1,
    opponent2,
    battleTimer,
    comments,
    attackCount,
    specialAttackAvailable,
    highballMode,
    sosoHealMode,
    yujiSpecialMode,
    showCharacterSheet,
    currentCharacterSheet,
    totalComments,
    toggleBgm,
    handleScreenTransition,
    setPlayer,
    setOpponent1,
    setOpponent2,
    resetBattleTimer,
    startBattleTimer,
    addComment,
    clearComments,
    setAttackCount,
    setSpecialAttackAvailable,
    setHighballMode,
    setSosoHealMode,
    setYujiSpecialMode,
    setShowCharacterSheet,
    setCurrentCharacterSheet,
    incrementComments,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the app context
export const useApp = () => useContext(AppContext);
