
import { useState, useCallback, useEffect, useRef } from 'react';
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

  // Initialize battle when component mounts
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

  // Handle opponent attack logic
  const handleOpponentAttack = useCallback(() => {
    if (isBattleOver) return;
    
    const result = performOpponentAttack(player, opponent1, addComment);
    
    setPlayer(result.updatedPlayer);
    
    setTimeout(() => {
      setIsPlayerTurn(true);
      setActionInProgress(false);
    }, 800);
  }, [player, opponent1, isBattleOver, addComment, setPlayer, setIsPlayerTurn, setActionInProgress]);

  // Handle soso heal logic
  const handleSosoHeal = useCallback(() => {
    if (isBattleOver) return;
    
    const result = performSosoHeal(opponent1, addComment);
    
    setOpponent1(result.updatedOpponent);
    
    setTimeout(() => {
      setIsPlayerTurn(true);
      setActionInProgress(false);
    }, 800);
  }, [opponent1, isBattleOver, addComment, setOpponent1, setIsPlayerTurn, setActionInProgress]);

  // Apply battle effects (opponent turn, battle over check, soso heal mode)
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

  // Player actions (attack, special, run away, highball)
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

  // Handle character click to show character sheet
  const handleCharacterClick = useCallback((character: 'player' | 'opponent1' | 'opponent2') => {
    setCurrentCharacterSheet(character);
    setShowCharacterSheet(true);
  }, [setCurrentCharacterSheet, setShowCharacterSheet]);

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
    setShowCharacterSheet,
    actionInProgress // Export this to BattleActions if needed
  };
};
