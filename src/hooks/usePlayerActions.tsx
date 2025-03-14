import { useCallback } from 'react';
import { Character } from '@/context/CharacterContext';
import { 
  performPlayerAttack, 
  performPlayerSpecial, 
  performRunAway, 
  performHighball
} from '@/utils/battleActions';

interface UsePlayerActionsProps {
  player: Character;
  opponent: Character;
  isBattleOver: boolean;
  isPlayerTurn: boolean;
  highballMode: boolean;
  attackCount: number;
  specialAttackAvailable: boolean;
  actionInProgress: boolean;
  setPlayer: (player: Character) => void;
  setOpponent: (opponent: Character) => void;
  setIsPlayerTurn: (isPlayerTurn: boolean) => void;
  setAttackCount: (count: number) => void;
  setSpecialAttackAvailable: (available: boolean) => void;
  setHighballMode: (mode: boolean) => void;
  setActionInProgress: (inProgress: boolean) => void;
  addComment: (author: string, text: string, isSystem?: boolean) => void;
}

export const usePlayerActions = ({
  player,
  opponent,
  isBattleOver,
  isPlayerTurn,
  highballMode,
  attackCount,
  specialAttackAvailable,
  actionInProgress,
  setPlayer,
  setOpponent,
  setIsPlayerTurn,
  setAttackCount,
  setSpecialAttackAvailable,
  setHighballMode,
  setActionInProgress,
  addComment
}: UsePlayerActionsProps) => {
  
  // Handle player attack
  const handlePlayerAttack = useCallback(() => {
    if (isBattleOver || !isPlayerTurn || actionInProgress) return;
    
    // Set action in progress to prevent multiple actions
    setActionInProgress(true);
    
    // Increase attack count for special attack
    const newAttackCount = attackCount + 1;
    setAttackCount(newAttackCount);
    
    // Enable special attack after 3 regular attacks
    if (newAttackCount >= 3 && !specialAttackAvailable) {
      setSpecialAttackAvailable(true);
    }
    
    // Perform the attack
    const result = performPlayerAttack(player, opponent, highballMode, addComment);
    
    setPlayer(result.updatedPlayer);
    setOpponent(result.updatedOpponent);
    
    // Reset highball mode if it was active
    if (highballMode) {
      setHighballMode(false);
    }
    
    // End player's turn
    if (result.endTurn) {
      // Small delay to ensure UI updates and animations complete
      setTimeout(() => {
        setIsPlayerTurn(false);
      }, 500);
    } else {
      // If for some reason the turn doesn't end, reset the action flag
      setTimeout(() => {
        setActionInProgress(false);
      }, 500);
    }
  }, [
    player, 
    opponent, 
    isBattleOver, 
    isPlayerTurn, 
    highballMode, 
    attackCount, 
    specialAttackAvailable,
    actionInProgress,
    setPlayer,
    setOpponent,
    setIsPlayerTurn,
    setAttackCount,
    setSpecialAttackAvailable,
    setHighballMode,
    setActionInProgress,
    addComment
  ]);

  // Handle player special attack
  const handlePlayerSpecial = useCallback(() => {
    if (isBattleOver || !isPlayerTurn || !specialAttackAvailable || actionInProgress) return;
    
    // Set action in progress
    setActionInProgress(true);
    
    // Perform special attack
    const result = performPlayerSpecial(player, opponent, addComment);
    
    setOpponent(result.updatedOpponent);
    
    // Reset special attack availability and count
    setSpecialAttackAvailable(false);
    setAttackCount(0);
    
    // End player's turn
    if (result.endTurn) {
      // Small delay to ensure UI updates and animations complete
      setTimeout(() => {
        setIsPlayerTurn(false);
      }, 500);
    } else {
      // If for some reason the turn doesn't end, reset the action flag
      setTimeout(() => {
        setActionInProgress(false);
      }, 500);
    }
  }, [
    player, 
    opponent, 
    isBattleOver, 
    isPlayerTurn, 
    specialAttackAvailable,
    actionInProgress,
    setOpponent,
    setIsPlayerTurn,
    setAttackCount,
    setSpecialAttackAvailable,
    setActionInProgress,
    addComment
  ]);

  // Handle running away
  const handleRunAway = useCallback(() => {
    if (isBattleOver || !isPlayerTurn || actionInProgress) return;
    
    // Set action in progress
    setActionInProgress(true);
    
    // Perform run away action
    const result = performRunAway(player, addComment);
    
    setPlayer(result.updatedPlayer);
    
    // End player's turn
    if (result.endTurn) {
      // Small delay to ensure UI updates and animations complete
      setTimeout(() => {
        setIsPlayerTurn(false);
      }, 500);
    } else {
      // If for some reason the turn doesn't end, reset the action flag
      setTimeout(() => {
        setActionInProgress(false);
      }, 500);
    }
  }, [
    player, 
    isBattleOver, 
    isPlayerTurn,
    actionInProgress,
    setPlayer,
    setIsPlayerTurn,
    setActionInProgress,
    addComment
  ]);

  // Handle drinking highball
  const handleHighball = useCallback(() => {
    if (isBattleOver || !isPlayerTurn || actionInProgress) return;
    
    // Set action in progress
    setActionInProgress(true);
    
    // Perform highball action
    const result = performHighball(player, addComment);
    
    setPlayer(result.updatedPlayer);
    setHighballMode(result.highballMode);
    
    // End player's turn
    if (result.endTurn) {
      // Small delay to ensure UI updates and animations complete
      setTimeout(() => {
        setIsPlayerTurn(false);
      }, 500);
    } else {
      // If for some reason the turn doesn't end, reset the action flag
      setTimeout(() => {
        setActionInProgress(false);
      }, 500);
    }
  }, [
    player, 
    isBattleOver, 
    isPlayerTurn,
    actionInProgress,
    setPlayer,
    setIsPlayerTurn,
    setHighballMode,
    setActionInProgress,
    addComment
  ]);

  return {
    handlePlayerAttack,
    handlePlayerSpecial,
    handleRunAway,
    handleHighball
  };
};
