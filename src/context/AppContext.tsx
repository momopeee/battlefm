import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

// Character interface
export interface Character {
  name: string;
  icon: string;
  maxHp: number;
  currentHp: number;
  attackMin: number;
  attackMax: number;
  specialPower: number;
}

// Comment interface
export interface Comment {
  author: string;
  text: string;
  isSystem: boolean;
}

// Define the possible screens
export type Screen = 'index' | 'start' | 'battle1' | 'victory1' | 'result1' | 'select' | 'battle2' | 'victory2' | 'result2' | 'endingA' | 'endingB' | 'endingC';

// AppContext interface
interface AppContextProps {
  player: Character;
  setPlayer: React.Dispatch<React.SetStateAction<Character>>;
  opponent1: Character;
  setOpponent1: React.Dispatch<React.SetStateAction<Character>>;
  opponent2: Character;
  setOpponent2: React.Dispatch<React.SetStateAction<Character>>;
  bgmEnabled: boolean;
  toggleBgm: () => void;
  userInteracted: boolean;
  setUserInteracted: () => void;
  battleTimer: number;
  startBattleTimer: () => void;
  pauseBattleTimer: () => void;
  resetBattleTimer: () => void;
  currentScreen: Screen;
  handleScreenTransition: (screen: Screen) => void;
  comments: Comment[];
  addComment: (author: string, text: string, isSystem?: boolean) => void;
  clearComments: () => void;
  totalComments: number;
  attackCount: number;
  setAttackCount: React.Dispatch<React.SetStateAction<number>>;
  specialAttackAvailable: boolean;
  setSpecialAttackAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  highballMode: boolean;
  setHighballMode: React.Dispatch<React.SetStateAction<boolean>>;
  sosoHealMode: boolean;
  setSosoHealMode: React.Dispatch<React.SetStateAction<boolean>>;
  yujiSpecialMode: boolean;
  setYujiSpecialMode: React.Dispatch<React.SetStateAction<boolean>>;
  showCharacterSheet: boolean;
  setShowCharacterSheet: React.Dispatch<React.SetStateAction<boolean>>;
  currentCharacterSheet: 'player' | 'opponent1' | 'opponent2' | null;
  setCurrentCharacterSheet: React.Dispatch<React.SetStateAction<'player' | 'opponent1' | 'opponent2' | null>>;
  resetBattleState: () => void;
}

// Create context
const AppContext = createContext<AppContextProps | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initial player state
  const [player, setPlayer] = useState<Character>({
    name: 'とおる＠経営参謀',
    icon: '/lovable-uploads/da232b1a-dd62-447f-89f0-799e9e8c150a.png',
    maxHp: 100,
    currentHp: 100,
    attackMin: 15,
    attackMax: 30,
    specialPower: 50
  });
  
  // Initial opponent1 (soso) state
  const [opponent1, setOpponent1] = useState<Character>({
    name: 'そーそー＠狂犬ツイート',
    icon: '/lovable-uploads/b62bfeb2-59a1-4f1b-976a-d026638e0416.png',
    maxHp: 100,
    currentHp: 100,
    attackMin: 5,
    attackMax: 15,
    specialPower: 0
  });
  
  // Initial opponent2 (yuji) state
  const [opponent2, setOpponent2] = useState<Character>({
    name: 'ゆうじ＠陽気なおじさん',
    icon: '/lovable-uploads/988ea3ef-2efe-4616-a292-04d0d01fb33c.png',
    maxHp: 100,
    currentHp: 100,
    attackMin: 10,
    attackMax: 20,
    specialPower: 0
  });
  
  // BGM state
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(true);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);
  
  // Toggle BGM
  const toggleBgm = () => {
    setBgmEnabled(prev => !prev);
  };
  
  // Battle timer
  const [battleTimer, setBattleTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Start battle timer
  const startBattleTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    
    const interval = setInterval(() => {
      setBattleTimer(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
  };
  
  // Pause battle timer
  const pauseBattleTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };
  
  // Reset battle timer
  const resetBattleTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setBattleTimer(0);
    console.log('Battle timer reset to 0');
  };
  
  // Screen transition
  const [currentScreen, setCurrentScreen] = useState<Screen>('index');
  
  const handleScreenTransition = (screen: Screen) => {
    setCurrentScreen(screen);
  };
  
  // Comments system
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  
  const addComment = (author: string, text: string, isSystem: boolean = false) => {
    setComments(prev => [...prev, { author, text, isSystem }]);
    if (!isSystem) {
      setTotalComments(prev => prev + 1);
    }
  };
  
  const clearComments = () => {
    setComments([]);
    setTotalComments(0);
  };
  
  // Battle mechanics
  const [attackCount, setAttackCount] = useState(0);
  const [specialAttackAvailable, setSpecialAttackAvailable] = useState(false);
  const [highballMode, setHighballMode] = useState(false);
  const [sosoHealMode, setSosoHealMode] = useState(false);
  const [yujiSpecialMode, setYujiSpecialMode] = useState(false);
  
  // Character sheet display
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  const [currentCharacterSheet, setCurrentCharacterSheet] = useState<'player' | 'opponent1' | 'opponent2' | null>(null);
  
  // New function to reset battle state
  const resetBattleState = () => {
    // Reset player and opponents stats with FULL reset of all battle properties
    setPlayer({
      ...player,
      currentHp: player.maxHp,
      attackMin: 15,  // Ensure attack min is reset to 15
      attackMax: 30,  // Ensure attack max is reset to 30
      specialPower: 50 // Reset special attack power to 50
    });
    
    setOpponent1({
      ...opponent1,
      currentHp: opponent1.maxHp,
      attackMin: 5,   // Reset to initial value
      attackMax: 15,  // Reset to initial value
      specialPower: 0 // Reset special power
    });
    
    setOpponent2({
      ...opponent2,
      currentHp: opponent2.maxHp,
      attackMin: 10,  // Reset to initial value
      attackMax: 20,  // Reset to initial value
      specialPower: 0 // Reset special power
    });
    
    // Reset battle mechanics
    setAttackCount(0);
    setSpecialAttackAvailable(false);
    setHighballMode(false);
    setSosoHealMode(false);
    setYujiSpecialMode(false);
    
    // Clear comments and reset timer
    clearComments();
    resetBattleTimer();
    
    // Reset character sheet
    setShowCharacterSheet(false);
    setCurrentCharacterSheet(null);
    
    console.log('Battle state fully reset - all character stats and battle flags reset to initial values');
  };
  
  // Add a function to set user interaction flag
  const handleUserInteraction = useCallback(() => {
    setUserInteracted(true);
  }, []);
  
  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);
  
  // Add event listeners for user interaction at the App level
  useEffect(() => {
    if (!userInteracted) {
      const handleUserInteraction = () => {
        setUserInteracted(true);
      };

      document.addEventListener('click', handleUserInteraction, { once: true });
      document.addEventListener('touchstart', handleUserInteraction, { once: true });
      
      return () => {
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
      };
    }
  }, [userInteracted]);
  
  // Update the context value to include new properties
  const contextValue: AppContextType = {
    player, setPlayer,
    opponent1, setOpponent1,
    opponent2, setOpponent2,
    bgmEnabled, toggleBgm,
    userInteracted,
    setUserInteracted: handleUserInteraction,
    battleTimer, startBattleTimer, pauseBattleTimer, resetBattleTimer,
    currentScreen, handleScreenTransition,
    comments, addComment, clearComments, totalComments,
    attackCount, setAttackCount,
    specialAttackAvailable, setSpecialAttackAvailable,
    highballMode, setHighballMode,
    sosoHealMode, setSosoHealMode,
    yujiSpecialMode, setYujiSpecialMode,
    showCharacterSheet, setShowCharacterSheet,
    currentCharacterSheet, setCurrentCharacterSheet,
    resetBattleState
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the AppContext
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export type AppContextType = {
  player: Character;
  setPlayer: React.Dispatch<React.SetStateAction<Character>>;
  opponent1: Character;
  setOpponent1: React.Dispatch<React.SetStateAction<Character>>;
  opponent2: Character;
  setOpponent2: React.Dispatch<React.SetStateAction<Character>>;
  bgmEnabled: boolean;
  toggleBgm: () => void;
  userInteracted: boolean;
  setUserInteracted: () => void;
  battleTimer: number;
  startBattleTimer: () => void;
  pauseBattleTimer: () => void;
  resetBattleTimer: () => void;
  currentScreen: Screen;
  handleScreenTransition: (screen: Screen) => void;
  comments: Comment[];
  addComment: (author: string, text: string, isSystem?: boolean) => void;
  clearComments: () => void;
  totalComments: number;
  attackCount: number;
  setAttackCount: React.Dispatch<React.SetStateAction<number>>;
  specialAttackAvailable: boolean;
  setSpecialAttackAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  highballMode: boolean;
  setHighballMode: React.Dispatch<React.SetStateAction<boolean>>;
  sosoHealMode: boolean;
  setSosoHealMode: React.Dispatch<React.SetStateAction<boolean>>;
  yujiSpecialMode: boolean;
  setYujiSpecialMode: React.Dispatch<React.SetStateAction<boolean>>;
  showCharacterSheet: boolean;
  setShowCharacterSheet: React.Dispatch<React.SetStateAction<boolean>>;
  currentCharacterSheet: 'player' | 'opponent1' | 'opponent2' | null;
  setCurrentCharacterSheet: React.Dispatch<React.SetStateAction<'player' | 'opponent1' | 'opponent2' | null>>;
  resetBattleState: () => void;
};
