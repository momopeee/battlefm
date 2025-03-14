import { useState, useCallback } from 'react';
import { useUI } from '@/context/UIContext';
import { useCharacter } from '@/context/CharacterContext';
import { useBattle } from '@/context/BattleContext';
import { 
  performOpponentAttack,
  performSosoHeal
} from '@/utils/battleActions';
import { useBattleEffects } from './useBattleEffects';
import { usePlayerActions } from './usePlayerActions';
import { useBattleInitialization } from './useBattleInitialization';

export const useBattleLogic = () => {
  const { handleScreenTransition } = useUI();
  const { 
    player, setPlayer,
    opponent1, setOpponent1,
    showCharacterSheet, setShowCharacterSheet,
    currentCharacterSheet, setCurrentCharacterSheet,
  } = useCharacter();
  const {
    battleTimer,
    resetBattleTimer,
    startBattleTimer,
    comments, addComment, clearComments,
    specialAttackAvailable, setSpecialAttackAvailable,
    attackCount, setAttackCount,
    highballMode, setHighballMode,
    sosoHealMode, setSosoHealMode,
  } = useBattle();

  const [isBattleOver, setIsBattleOver] = useState(false);
  const [soundEffect, setSoundEffect] = useState<string | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isBattleStarted, setIsBattleStarted] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);

  useBattleInitialization({
    player,
    opponent: opponent1,
    setPlayer,
    setOpponent: setOpponent1,
    clearComments,
    resetBattleTimer,
    startBattleTimer,
    setAttackCount,
    setSpecialAttackAvailable,
    setHighballMode,
    setSosoHealMode,
    addComment,
    setIsBattleStarted
  });

  const handleOpponentAttack = useCallback(() => {
    if (isBattleOver || actionInProgress) return;
    
    setActionInProgress(true);
    
    const result = performOpponentAttack(player, opponent1, addComment);
    
    setPlayer(result.updatedPlayer);
    
    if (result.endTurn) {
      setTimeout(() => {
        setIsPlayerTurn(true);
        setActionInProgress(false);
      }, 800);
    }
  }, [player, opponent1, isBattleOver, actionInProgress, addComment, setPlayer, setIsPlayerTurn]);

  const handleSosoHeal = useCallback(() => {
    if (isBattleOver || actionInProgress) return;
    
    setActionInProgress(true);
    
    const result = performSosoHeal(opponent1, addComment);
    
    setOpponent1(result.updatedOpponent);
    
    if (result.endTurn) {
      setTimeout(() => {
        setIsPlayerTurn(true);
        setActionInProgress(false);
      }, 800);
    }
  }, [opponent1, isBattleOver, actionInProgress, addComment, setOpponent1, setIsPlayerTurn]);

  useBattleEffects({
    player,
    opponent1,
    battleTimer,
    isPlayerTurn,
    isBattleStarted,
    isBattleOver,
    sosoHealMode,
    actionInProgress,
    setSosoHealMode,
    setIsBattleOver,
    addComment,
    setSoundEffect,
    handleOpponentAttack,
    handleSosoHeal,
    setActionInProgress
  });

  const {
    handlePlayerAttack,
    handlePlayerSpecial,
    handleRunAway,
    handleHighball
  } = usePlayerActions({
    player,
    opponent: opponent1,
    isBattleOver,
    isPlayerTurn,
    highballMode,
    attackCount,
    specialAttackAvailable,
    actionInProgress,
    setPlayer,
    setOpponent: setOpponent1,
    setIsPlayerTurn,
    setAttackCount,
    setSpecialAttackAvailable,
    setHighballMode,
    setActionInProgress,
    addComment
  });

  const handleCharacterClick = (character: 'player' | 'opponent1') => {
    setCurrentCharacterSheet(character);
    setShowCharacterSheet(true);
  };

  return {
    player,
    opponent1,
    battleTimer,
    isBattleOver,
    soundEffect,
    isPlayerTurn,
    attackCount,
    sosoHealMode,
    specialAttackAvailable,
    highballMode,
    showCharacterSheet,
    currentCharacterSheet,
    comments,
    handlePlayerAttack,
    handlePlayerSpecial,
    handleRunAway,
    handleHighball,
    handleCharacterClick,
    setShowCharacterSheet
  };
};
