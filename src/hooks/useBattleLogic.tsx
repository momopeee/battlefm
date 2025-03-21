
import { useState, useEffect } from 'react';
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
  
  // Flag to track if the special skill message has been displayed
  const [specialSkillMessageDisplayed, setSpecialSkillMessageDisplayed] = useState(false);

  // Import battle results handlers
  const { handleVictory, handleDefeat, handleSkip: handleSkipResult } = useBattleResults({
    addComment,
    handleScreenTransition,
    setIsBattleOver,
    setTransitionScheduled,
    setIsPlayerVictory,
    setShowSkipButton,
    setRedirectTimer,
    setBattleResult
  });
  
  // Import battle action handlers
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

  // Initialize battle when component mounts
  useEffect(() => {
    clearComments();
    resetBattleTimer();
    startBattleTimer();
    setIsBattleStarted(true);
    
    // Reset player and opponent stats
    setPlayer({
      ...player,
      currentHp: player.maxHp,
      attackMin: 15,  // Set attack min to 15
      attackMax: 30,  // Set attack max to 30
      specialPower: 50 // Special attack power to 30-50
    });
    
    setOpponent1({
      ...opponent1,
      currentHp: opponent1.maxHp
    });
    
    setAttackCount(0);
    setSpecialAttackAvailable(false);
    setHighballMode(false);
    setSosoHealMode(false);
    setTransitionScheduled(false);
    setIsPlayerVictory(null);
    setShowSkipButton(false);
    setSpecialSkillMessageDisplayed(false); // Reset special skill message flag
    
    addComment("システム", "バトル開始！ さよならクソリプそーそー！", true);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle opponent's turn
  useEffect(() => {
    if (!isPlayerTurn && isBattleStarted && !isBattleOver) {
      const opponentTimer = setTimeout(() => {
        if (sosoHealMode) {
          handleSosoHeal();
        } else {
          handleOpponentAttack();
        }
      }, 1500);
      
      return () => clearTimeout(opponentTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayerTurn, isBattleStarted, isBattleOver, sosoHealMode]);

  // Check for battle over conditions
  useEffect(() => {
    if ((player.currentHp <= 0 || opponent1.currentHp <= 0) && !isBattleOver && !transitionScheduled) {
      setIsBattleOver(true);
      
      if (player.currentHp <= 0) {
        // Player lost
        setIsPlayerVictory(false);
        handleDefeat();
      } else if (opponent1.currentHp <= 0) {
        // Player won
        setIsPlayerVictory(true);
        handleVictory();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.currentHp, opponent1.currentHp]);

  // Activate soso heal mode when HP falls below 30 and display special skill message once
  useEffect(() => {
    if (opponent1.currentHp <= 30 && !sosoHealMode && !isBattleOver && !specialSkillMessageDisplayed) {
      setSosoHealMode(true);
      setSpecialSkillMessageDisplayed(true); // Mark that we've displayed the special skill message
      
      // Display the skill activation message sequence
      addComment("システム", "そーそーがとくぎ「強制コラボ召喚」を発動した", true);
      
      // To ensure messages display in order with some delay
      setTimeout(() => {
        addComment(opponent1.name, "あー、生きるのってむずかしいんだよなー、株クラのみんなも上がろうよ", false);
      }, 1000);
      
      setTimeout(() => {
        addComment("システム", "ラムダがコラボに参加した、松嶋ことがコラボに参加した", true);
      }, 2000);
    }
  }, [opponent1.currentHp, sosoHealMode, isBattleOver, specialSkillMessageDisplayed, addComment, opponent1.name]);

  // Show skip button after some delay based on battle result
  useEffect(() => {
    let skipButtonTimer: NodeJS.Timeout | null = null;
    
    if (isBattleOver && isPlayerVictory === true) {
      skipButtonTimer = setTimeout(() => {
        setShowSkipButton(true);
      }, 10000); // 10 seconds delay for victory
    } else if (isBattleOver && isPlayerVictory === false) {
      skipButtonTimer = setTimeout(() => {
        setShowSkipButton(true);
      }, 15000); // 15 seconds delay for defeat
    }
    
    return () => {
      if (skipButtonTimer) clearTimeout(skipButtonTimer);
    };
  }, [isBattleOver, isPlayerVictory]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [redirectTimer]);

  // Wrapper function to handle skipping to results
  const handleSkip = () => {
    if (!isBattleOver) return;
    
    // Cancel any pending timers/transitions
    setTransitionScheduled(true);
    handleSkipResult(isPlayerVictory, redirectTimer);
  };

  // Handle character sheet display
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
