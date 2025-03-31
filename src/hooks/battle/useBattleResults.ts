
import { useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VICTORY_BGM, DEFEAT_BGM } from '@/constants/audioUrls';

type BattleResultsProps = {
  addComment: (author: string, text: string, isSystem?: boolean) => void;
  handleScreenTransition: (screen: string) => void;
  setIsBattleOver: React.Dispatch<React.SetStateAction<boolean>>;
  setTransitionScheduled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlayerVictory: React.Dispatch<React.SetStateAction<boolean | null>>;
  setShowSkipButton: React.Dispatch<React.SetStateAction<boolean>>;
  setRedirectTimer: React.Dispatch<React.SetStateAction<NodeJS.Timeout | null>>;
  setBattleResult: React.Dispatch<React.SetStateAction<'victory' | 'defeat' | null>>;
};

export const useBattleResults = ({
  addComment,
  handleScreenTransition,
  setIsBattleOver,
  setTransitionScheduled,
  setIsPlayerVictory,
  setShowSkipButton,
  setRedirectTimer,
  setBattleResult
}: BattleResultsProps) => {
  const navigate = useNavigate();
  
  // Use a ref to store all active timers
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      // Clear all timers when component unmounts
      if (timersRef.current.length > 0) {
        clearAllTimers();
      }
    };
  }, []);
  
  // Improved timer creation that automatically tracks the timer
  const createTimer = useCallback((callback: () => void, delay: number): NodeJS.Timeout => {
    const timer = setTimeout(() => {
      // Remove this timer from our tracking array when it executes
      timersRef.current = timersRef.current.filter(t => t !== timer);
      // Execute the callback
      callback();
    }, delay);
    
    // Add this timer to our tracking array
    timersRef.current.push(timer);
    return timer;
  }, []);
  
  // Clear all tracked timers
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  // Handle victory with properly sequenced comments and actions
  const handleVictory = useCallback(() => {
    // Already scheduled a transition or in progress
    if (timersRef.current.length > 0) return;
    
    // Mark that we've already scheduled a transition
    setTransitionScheduled(true);
    setBattleResult('victory');
    
    // Add victory comments in sequence
    addComment("システム", "とおるが勝利した、そーそーは破れかぶれになってクソリプを量産してしまった", true);
    
    createTimer(() => {
      addComment("システム", "とおるは400の経験値を得た、とおるはレベルが上がった", true);
    }, 3000);
    
    createTimer(() => {
      addComment("システム", "とおるは祝いの美酒に酔いしれた", true);
    }, 6000);
    
    createTimer(() => {
      addComment("システム", "とおるは祝いの美酒の効果で痛風が悪化した、80のダメージ", true);
    }, 9000);
    
    // Final message and screen transition
    createTimer(() => {
      addComment("システム", "ライブが終了しました", true);
      
      // Show skip button after 10 seconds
      createTimer(() => {
        setShowSkipButton(true);
      }, 1000);
      
      // Set up a 20-second timer for automatic redirect
      const timer = createTimer(() => {
        handleScreenTransition('victory1');
        navigate('/victory1');
      }, 20000); // 20 seconds automatic redirect
      
      setRedirectTimer(timer);
    }, 12000);
  }, [addComment, createTimer, handleScreenTransition, navigate, setRedirectTimer, setShowSkipButton, setBattleResult, setTransitionScheduled]);

  // Handle defeat with properly sequenced comments and actions
  const handleDefeat = useCallback(() => {
    // Already scheduled a transition or in progress
    if (timersRef.current.length > 0) return;
    
    // Mark that we've already scheduled a transition
    setTransitionScheduled(true);
    setBattleResult('defeat');
    
    // Add defeat comments in sequence
    addComment("システム", "とおるが敗北した、そーそーは歯止めが利かなくなってしまった", true);
    
    createTimer(() => {
      addComment("システム", "とおるは4000の経験値を得た", true);
    }, 3000);
    
    createTimer(() => {
      addComment("システム", "とおるは敗北からも学べる男だった", true);
    }, 6000);
    
    createTimer(() => {
      addComment("システム", "とおるはレベルが上がった", true);
    }, 9000);
    
    createTimer(() => {
      addComment("システム", "とおるは敗北の美酒に酔いしれた", true);
    }, 12000);
    
    // Final messages and screen transition
    createTimer(() => {
      addComment("システム", "とおるは敗北の美酒の効果で痛風が悪化した、530000のダメージ", true);
      
      createTimer(() => {
        addComment("システム", "ライブが終了しました", true);
        
        // Show skip button after 15 seconds
        createTimer(() => {
          setShowSkipButton(true);
        }, 1000);
        
        // Set up a 20-second timer for automatic redirect to result1
        const timer = createTimer(() => {
          handleScreenTransition('result1');
          navigate('/result1');
        }, 20000); // 20 seconds automatic redirect
        
        setRedirectTimer(timer);
      }, 3000);
    }, 15000);
  }, [addComment, createTimer, handleScreenTransition, navigate, setRedirectTimer, setShowSkipButton, setBattleResult, setTransitionScheduled]);

  // Handle skipping end sequences
  const handleSkip = useCallback((isPlayerVictory: boolean | null, redirectTimer: NodeJS.Timeout | null) => {
    // Clear all timers to prevent any further automatic transitions
    clearAllTimers();
    
    if (redirectTimer) {
      clearTimeout(redirectTimer);
    }
    
    // Transition to the appropriate screen based on battle outcome
    if (isPlayerVictory === true) {
      handleScreenTransition('victory1');
      navigate('/victory1');
    } else if (isPlayerVictory === false) {
      handleScreenTransition('result1');
      navigate('/result1');
    }
  }, [clearAllTimers, handleScreenTransition, navigate]);

  return {
    handleVictory,
    handleDefeat,
    handleSkip,
    clearAllTimers
  };
};
