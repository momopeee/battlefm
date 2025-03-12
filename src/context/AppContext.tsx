
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define game-related types
export type GameScreen = 
  | 'start' 
  | 'battle1' 
  | 'victory1' 
  | 'select' 
  | 'battle2' 
  | 'endingA' 
  | 'endingB' 
  | 'endingC';

export type Character = {
  name: string;
  icon: string;
  maxHp: number;
  currentHp: number;
  attackMin: number;
  attackMax: number;
  specialPower: number;
};

export type Comment = {
  id: number;
  character: string;
  isSystem: boolean;
  message: string;
  timestamp: Date;
};

type AppContextType = {
  screen: GameScreen;
  setScreen: (screen: GameScreen) => void;
  player: Character;
  setPlayer: (player: Character) => void;
  opponent1: Character;
  setOpponent1: (opponent: Character) => void;
  opponent2: Character;
  setOpponent2: (opponent: Character) => void;
  comments: Comment[];
  addComment: (character: string, message: string, isSystem?: boolean) => void;
  clearComments: () => void;
  battleTimer: number;
  startBattleTimer: () => void;
  pauseBattleTimer: () => void;
  resetBattleTimer: () => void;
  specialAttackAvailable: boolean;
  setSpecialAttackAvailable: (available: boolean) => void;
  attackCount: number;
  setAttackCount: (count: number) => void;
  highballMode: boolean;
  setHighballMode: (mode: boolean) => void;
  yujiSpecialMode: boolean;
  setYujiSpecialMode: (mode: boolean) => void;
  yujiSpecialTimer: number;
  startYujiSpecialTimer: () => void;
  sosoHealMode: boolean;
  setSosoHealMode: (mode: boolean) => void;
  battleDuration: number;
  setBattleDuration: (duration: number) => void;
  totalComments: number;
  setTotalComments: (count: number) => void;
  bgmEnabled: boolean;
  toggleBgm: () => void;
  showCharacterSheet: boolean;
  setShowCharacterSheet: (show: boolean) => void;
  currentCharacterSheet: string;
  setCurrentCharacterSheet: (character: string) => void;
  handleScreenTransition: (nextScreen: GameScreen, delay?: number) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  
  // Core game state
  const [screen, setScreen] = useState<GameScreen>('start');
  const [battleTimer, setBattleTimer] = useState(0);
  const [battleTimerInterval, setBattleTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [yujiSpecialTimer, setYujiSpecialTimer] = useState(0);
  const [yujiSpecialInterval, setYujiSpecialInterval] = useState<NodeJS.Timeout | null>(null);
  const [bgmEnabled, setBgmEnabled] = useState(true);
  
  // Characters
  const [player, setPlayer] = useState<Character>({
    name: "とおる＠経営参謀",
    icon: "/lovable-uploads/a37987c5-d1ab-4f11-86a4-7ac9a089a401.png", // yamane3.jpg
    maxHp: 100,
    currentHp: 100,
    attackMin: 15,
    attackMax: 25,
    specialPower: 40
  });
  
  const [opponent1, setOpponent1] = useState<Character>({
    name: "そーそー＠狂犬ツイート",
    icon: "/lovable-uploads/5af802e0-9f63-462c-838c-e2b1acbf3c6f.png", // soso3.jpeg
    maxHp: 70,
    currentHp: 70,
    attackMin: 20,
    attackMax: 30,
    specialPower: 0
  });
  
  const [opponent2, setOpponent2] = useState<Character>({
    name: "ゆうじ＠陽気なおじさん",
    icon: "/lovable-uploads/656bd67f-53fe-4f15-86f3-0db149cc7285.png", // ug3.jpeg
    maxHp: 100,
    currentHp: 100,
    attackMin: 15,
    attackMax: 25,
    specialPower: 0
  });
  
  // Battle mechanics
  const [comments, setComments] = useState<Comment[]>([]);
  const [specialAttackAvailable, setSpecialAttackAvailable] = useState(false);
  const [attackCount, setAttackCount] = useState(0);
  const [highballMode, setHighballMode] = useState(false);
  const [yujiSpecialMode, setYujiSpecialMode] = useState(false);
  const [sosoHealMode, setSosoHealMode] = useState(false);
  
  // Result stats
  const [battleDuration, setBattleDuration] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  
  // UI state
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  const [currentCharacterSheet, setCurrentCharacterSheet] = useState('');
  
  // Handle screen transitions with optional delay
  const handleScreenTransition = (nextScreen: GameScreen, delay = 0) => {
    if (delay > 0) {
      setTimeout(() => {
        setScreen(nextScreen);
        navigate(`/${nextScreen}`);
      }, delay);
    } else {
      setScreen(nextScreen);
      navigate(`/${nextScreen}`);
    }
  };
  
  // Comments management
  const addComment = (character: string, message: string, isSystem = false) => {
    const newComment: Comment = {
      id: Date.now(),
      character,
      isSystem,
      message,
      timestamp: new Date()
    };
    
    setComments(prev => [...prev, newComment]);
    setTotalComments(prev => prev + 1);
  };
  
  const clearComments = () => {
    setComments([]);
  };
  
  // Timer functions
  const startBattleTimer = () => {
    if (battleTimerInterval) clearInterval(battleTimerInterval);
    
    const interval = setInterval(() => {
      setBattleTimer(prev => prev + 1);
    }, 1000);
    
    setBattleTimerInterval(interval);
  };
  
  const pauseBattleTimer = () => {
    if (battleTimerInterval) {
      clearInterval(battleTimerInterval);
      setBattleTimerInterval(null);
    }
  };
  
  const resetBattleTimer = () => {
    pauseBattleTimer();
    setBattleTimer(0);
  };
  
  const startYujiSpecialTimer = () => {
    if (yujiSpecialInterval) clearInterval(yujiSpecialInterval);
    
    setYujiSpecialTimer(40);
    const interval = setInterval(() => {
      setYujiSpecialTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setYujiSpecialMode(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setYujiSpecialInterval(interval);
  };
  
  const toggleBgm = () => {
    setBgmEnabled(prev => !prev);
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (battleTimerInterval) clearInterval(battleTimerInterval);
      if (yujiSpecialInterval) clearInterval(yujiSpecialInterval);
    };
  }, [battleTimerInterval, yujiSpecialInterval]);
  
  return (
    <AppContext.Provider
      value={{
        screen,
        setScreen,
        player,
        setPlayer,
        opponent1,
        setOpponent1,
        opponent2,
        setOpponent2,
        comments,
        addComment,
        clearComments,
        battleTimer,
        startBattleTimer,
        pauseBattleTimer,
        resetBattleTimer,
        specialAttackAvailable,
        setSpecialAttackAvailable,
        attackCount,
        setAttackCount,
        highballMode,
        setHighballMode,
        yujiSpecialMode,
        setYujiSpecialMode,
        yujiSpecialTimer,
        startYujiSpecialTimer,
        sosoHealMode,
        setSosoHealMode,
        battleDuration,
        setBattleDuration,
        totalComments,
        setTotalComments,
        bgmEnabled,
        toggleBgm,
        showCharacterSheet,
        setShowCharacterSheet,
        currentCharacterSheet,
        setCurrentCharacterSheet,
        handleScreenTransition
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
