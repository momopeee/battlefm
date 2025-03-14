
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
  setPlayer: (player: Character) => void;
  setOpponent: (opponent: Character) => void;
  setIsPlayerTurn: (isPlayerTurn: boolean) => void;
  setAttackCount: (count: number) => void;
  setSpecialAttackAvailable: (available: boolean) => void;
  setHighballMode: (mode: boolean) => void;
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
  setPlayer,
  setOpponent,
  setIsPlayerTurn,
  setAttackCount,
  setSpecialAttackAvailable,
  setHighballMode,
  addComment
}: UsePlayerActionsProps) => {
  
  // Handle player attack
  const handlePlayerAttack = useCallback(() => {
    if (isBattleOver || !isPlayerTurn) return;
    
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
      setIsPlayerTurn(false);
    }
  }, [
    player, 
    opponent, 
    isBattleOver, 
    isPlayerTurn, 
    highballMode, 
    attackCount, 
    specialAttackAvailable,
    setPlayer,
    setOpponent,
    setIsPlayerTurn,
    setAttackCount,
    setSpecialAttackAvailable,
    setHighballMode,
    addComment
  ]);

  // Handle player special attack
  const handlePlayerSpecial = useCallback(() => {
    if (isBattleOver || !isPlayerTurn || !specialAttackAvailable) return;
    
    // Perform special attack
    const result = performPlayerSpecial(player, opponent, addComment);
    
    setOpponent(result.updatedOpponent);
    
    // Reset special attack availability and count
    setSpecialAttackAvailable(false);
    setAttackCount(0);
    
    // End player's turn
    if (result.endTurn) {
      setIsPlayerTurn(false);
    }
  }, [
    player, 
    opponent, 
    isBattleOver, 
    isPlayerTurn, 
    specialAttackAvailable,
    setOpponent,
    setIsPlayerTurn,
    setAttackCount,
    setSpecialAttackAvailable,
    addComment
  ]);

  // Handle running away
  const handleRunAway = useCallback(() => {
    if (isBattleOver || !isPlayerTurn) return;
    
    // Perform run away action
    const result = performRunAway(player, addComment);
    
    setPlayer(result.updatedPlayer);
    
    // End player's turn
    if (result.endTurn) {
      setIsPlayerTurn(false);
    }
  }, [
    player, 
    isBattleOver, 
    isPlayerTurn,
    setPlayer,
    setIsPlayerTurn,
    addComment
  ]);

  // Handle drinking highball
  const handleHighball = useCallback(() => {
    if (isBattleOver || !isPlayerTurn) return;
    
    // Perform highball action
    const result = performHighball(player, addComment);
    
    setPlayer(result.updatedPlayer);
    setHighballMode(result.highballMode);
    
    // End player's turn
    if (result.endTurn) {
      setIsPlayerTurn(false);
    }
  }, [
    player, 
    isBattleOver, 
    isPlayerTurn,
    setPlayer,
    setIsPlayerTurn,
    setHighballMode,
    addComment
  ]);

  return {
    handlePlayerAttack,
    handlePlayerSpecial,
    handleRunAway,
    handleHighball
  };
};
