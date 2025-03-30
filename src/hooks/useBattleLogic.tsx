import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useBattleActions } from './battle/useBattleActions';
import { useBattleResults } from './battle/useBattleResults';

export const useBattleLogic = () => {
  const { 
    player, setPlayer,
    opponent1, setOpponent1,
    battleTimer,
    resetBattleTimer,
    startBattleTimer,
    comments, addComment, clearComments,
    specialAttackAvailable, setSpecialAttackAvailable,
    attackCount, setAttackCount,
    highballMode, setHighballMode,
    sosoHealMode, setSosoHealMode,
    showCharacterSheet, setShowCharacterSheet,
    currentCharacterSheet, setCurrentCharacterSheet,
    handleScreenTransition
  } = useApp();

  const navigate = useNavigate();
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isBattleStarted, setIsBattleStarted] = useState(false);
  const [transitionScheduled, setTransitionScheduled] = useState(false);
  const [isPlayerVictory, setIsPlayerVictory] = useState<boolean | null>(null);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);
  const [specialSkillMessageDisplayed, setSpecialSkillMessageDisplayed] = useState(false);

  const opponentTimerRef = useRef<NodeJS.Timeout | null>(null);
  const skipButtonTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sosoHealTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { handleVictory, handleDefeat, handleSkip: handleSkipResult, clearAllTimers } = useBattleResults({
    addComment,
    handleScreenTransition,
    setIsBattleOver,
    setTransitionScheduled,
    setIsPlayerVictory,
    setShowSkipButton,
    setRedirectTimer,
    setBattleResult
  });

  const { 
    handlePlayerAttack,
    handlePlayerSpecial,
    handleRunAway,
    handleHighball,
    handleOpponentAttack,
    handleSosoHeal
  } = useBattleActions({
    player,
    setPlayer,
    opponent1,
    setOpponent1,
    attackCount,
    setAttackCount,
    isPlayerTurn,
    setIsPlayerTurn,
    isBattleOver,
    highballMode,
    setHighballMode,
    specialAttackAvailable,
    setSpecialAttackAvailable,
    sosoHealMode,
    addComment,
    handleDefeat
  });

  const clearLocalTimers = () => {
    if (opponentTimerRef.current) {
      clearTimeout(opponentTimerRef.current);
      opponentTimerRef.current = null;
    }
    if (skipButtonTimerRef.current) {
      clearTimeout(skipButtonTimerRef.current);
      skipButtonTimerRef.current = null;
    }
    if (sosoHealTimerRef.current) {
      clearTimeout(sosoHealTimerRef.current);
      sosoHealTimerRef.current = null;
    }
  };

  useEffect(() => {
    clearAllTimers();
    clearLocalTimers();
    clearComments();
    resetBattleTimer();
    startBattleTimer();
    setIsBattleStarted(true);
    setIsBattleOver(false);
    setIsPlayerVictory(null);
    setBattleResult(null);
    
    setPlayer({
      ...player,
      currentHp: player.maxHp,
      attackMin: 15,
      attackMax: 30,
      specialPower: 50
    });
    
    setOpponent1({
      ...opponent1,
      currentHp: opponent1.maxHp,
      attackMin: 5,
      attackMax: 15,
      specialPower: 0
    });
    
    setAttackCount(0);
    setSpecialAttackAvailable(false);
    setHighballMode(false);
    setSosoHealMode(false);
    setTransitionScheduled(false);
    setShowSkipButton(false);
    setSpecialSkillMessageDisplayed(false);
    
    addComment("システム", "バトル開始！ さよならクソリプそーそー！", true);
    
    return () => {
      clearAllTimers();
      clearLocalTimers();
    };
  }, []);

  useEffect(() => {
    if (opponentTimerRef.current) {
      clearTimeout(opponentTimerRef.current);
      opponentTimerRef.current = null;
    }
    
    if (!isPlayerTurn && isBattleStarted && !isBattleOver) {
      opponentTimerRef.current = setTimeout(() => {
        if (sosoHealMode) {
          handleSosoHeal();
        } else {
          handleOpponentAttack();
        }
      }, 1500);
    }
    
    return () => {
      if (opponentTimerRef.current) {
        clearTimeout(opponentTimerRef.current);
        opponentTimerRef.current = null;
      }
    };
  }, [isPlayerTurn, isBattleStarted, isBattleOver, sosoHealMode]);

  useEffect(() => {
    if ((player.currentHp <= 0 || opponent1.currentHp <= 0) && !isBattleOver && !transitionScheduled) {
      setIsBattleOver(true);
      
      if (player.currentHp <= 0) {
        setIsPlayerVictory(false);
        handleDefeat();
      } else if (opponent1.currentHp <= 0) {
        setIsPlayerVictory(true);
        handleVictory();
      }
    }
  }, [player.currentHp, opponent1.currentHp]);

  useEffect(() => {
    if (sosoHealTimerRef.current) {
      clearTimeout(sosoHealTimerRef.current);
      sosoHealTimerRef.current = null;
    }
    
    if (opponent1.currentHp <= 30 && !sosoHealMode && !isBattleOver && !specialSkillMessageDisplayed) {
      setSosoHealMode(true);
      setSpecialSkillMessageDisplayed(true);
      
      addComment("システム", "そーそーがとくぎ「強制コラボ召喚」を発動した", true);
      
      sosoHealTimerRef.current = setTimeout(() => {
        addComment(opponent1.name, "あー、生きるのってむずかしいんだよなー、株クラのみんなも上がろうよ", false);
        
        const innerTimer = setTimeout(() => {
          addComment("システム", "ラムダがコラボに参加した、松嶋ことがコラボに参加した", true);
        }, 1000);
        
        if (sosoHealTimerRef.current) {
          const oldTimer = sosoHealTimerRef.current;
          sosoHealTimerRef.current = innerTimer;
          clearTimeout(oldTimer);
        }
      }, 1000);
    }
    
    return () => {
      if (sosoHealTimerRef.current) {
        clearTimeout(sosoHealTimerRef.current);
        sosoHealTimerRef.current = null;
      }
    };
  }, [opponent1.currentHp, sosoHealMode, isBattleOver, specialSkillMessageDisplayed]);

  useEffect(() => {
    if (skipButtonTimerRef.current) {
      clearTimeout(skipButtonTimerRef.current);
      skipButtonTimerRef.current = null;
    }
    
    if (isBattleOver && isPlayerVictory === true) {
      skipButtonTimerRef.current = setTimeout(() => {
        setShowSkipButton(true);
      }, 10000);
    } else if (isBattleOver && isPlayerVictory === false) {
      skipButtonTimerRef.current = setTimeout(() => {
        setShowSkipButton(true);
      }, 15000);
    }
    
    return () => {
      if (skipButtonTimerRef.current) {
        clearTimeout(skipButtonTimerRef.current);
        skipButtonTimerRef.current = null;
      }
    };
  }, [isBattleOver, isPlayerVictory]);

  useEffect(() => {
    return () => {
      clearAllTimers();
      clearLocalTimers();
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [redirectTimer]);

  const handleSkip = () => {
    if (!isBattleOver) return;
    
    clearAllTimers();
    clearLocalTimers();
    
    setTransitionScheduled(true);
    handleSkipResult(isPlayerVictory, redirectTimer);
  };

  const handleCharacterClick = (character: 'player' | 'opponent1' | 'opponent2') => {
    setCurrentCharacterSheet(character);
    setShowCharacterSheet(true);
  };

  return {
    player,
    opponent1,
    battleTimer,
    isBattleOver,
    isPlayerTurn,
    attackCount,
    sosoHealMode,
    specialAttackAvailable,
    highballMode,
    showCharacterSheet,
    currentCharacterSheet,
    comments,
    showSkipButton,
    battleResult,
    handlePlayerAttack,
    handlePlayerSpecial,
    handleRunAway,
    handleHighball,
    handleCharacterClick,
    setShowCharacterSheet,
    handleSkip
  };
};
