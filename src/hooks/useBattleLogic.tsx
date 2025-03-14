
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

  // Use the battle initialization hook
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

  // Define opponent handler functions
  const handleOpponentAttack = useCallback(() => {
    if (isBattleOver) return;
    
    // Perform opponent attack
    const result = performOpponentAttack(player, opponent1, addComment);
    
    setPlayer(result.updatedPlayer);
    
    // Start player's turn
    if (result.endTurn) {
      setIsPlayerTurn(true);
    }
  }, [player, opponent1, isBattleOver, addComment, setPlayer, setIsPlayerTurn]);

  const handleSosoHeal = useCallback(() => {
    if (isBattleOver) return;
    
    // Perform soso heal
    const result = performSosoHeal(opponent1, addComment);
    
    setOpponent1(result.updatedOpponent);
    
    // Start player's turn
    if (result.endTurn) {
      setIsPlayerTurn(true);
    }
  }, [opponent1, isBattleOver, addComment, setOpponent1, setIsPlayerTurn]);

  // Use the battle effects hook
  useBattleEffects({
    player,
    opponent1,
    battleTimer,
    isPlayerTurn,
    isBattleStarted,
    isBattleOver,
    sosoHealMode,
    setSosoHealMode,
    setIsBattleOver,
    addComment,
    setSoundEffect,
    handleOpponentAttack,
    handleSosoHeal
  });

  // Use the player actions hook
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
    setPlayer,
    setOpponent: setOpponent1,
    setIsPlayerTurn,
    setAttackCount,
    setSpecialAttackAvailable,
    setHighballMode,
    addComment
  });

  // Handle character sheet display
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
