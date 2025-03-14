
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Character } from './CharacterContext';

interface BattleContextType {
  battleTimer: number;
  attackCount: number;
  specialAttackAvailable: boolean;
  highballMode: boolean;
  sosoHealMode: boolean;
  yujiSpecialMode: boolean;
  comments: Comment[];
  totalComments: number;
  
  resetBattleTimer: () => void;
  startBattleTimer: () => void;
  addComment: (author: string, text: string, isSystem?: boolean) => void;
  clearComments: () => void;
  setAttackCount: (count: number) => void;
  setSpecialAttackAvailable: (available: boolean) => void;
  setHighballMode: (mode: boolean) => void;
  setSosoHealMode: (mode: boolean) => void;
  setYujiSpecialMode: (mode: boolean) => void;
  incrementComments: () => void;
}

export interface Comment {
  author: string;
  text: string;
  isSystem?: boolean;
}

const BattleContext = createContext<BattleContextType>({
  battleTimer: 0,
  attackCount: 0,
  specialAttackAvailable: false,
  highballMode: false,
  sosoHealMode: false,
  yujiSpecialMode: false,
  comments: [],
  totalComments: 0,
  
  resetBattleTimer: () => {},
  startBattleTimer: () => {},
  addComment: () => {},
  clearComments: () => {},
  setAttackCount: () => {},
  setSpecialAttackAvailable: () => {},
  setHighballMode: () => {},
  setSosoHealMode: () => {},
  setYujiSpecialMode: () => {},
  incrementComments: () => {},
});

export const BattleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [battleTimer, setBattleTimer] = useState(0);
  const [attackCount, setAttackCount] = useState(0);
  const [specialAttackAvailable, setSpecialAttackAvailable] = useState(false);
  const [highballMode, setHighballMode] = useState(false);
  const [sosoHealMode, setSosoHealMode] = useState(false);
  const [yujiSpecialMode, setYujiSpecialMode] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [totalComments, setTotalComments] = useState(0);

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

  const value = {
    battleTimer,
    attackCount,
    specialAttackAvailable,
    highballMode,
    sosoHealMode,
    yujiSpecialMode,
    comments,
    totalComments,
    resetBattleTimer,
    startBattleTimer,
    addComment,
    clearComments,
    setAttackCount,
    setSpecialAttackAvailable,
    setHighballMode,
    setSosoHealMode,
    setYujiSpecialMode,
    incrementComments,
  };

  return (
    <BattleContext.Provider value={value}>
      {children}
    </BattleContext.Provider>
  );
};

export const useBattle = () => useContext(BattleContext);
