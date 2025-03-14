
import { useEffect } from 'react';
import { useUI } from '@/context/UIContext';
import { Character } from '@/context/CharacterContext';
import { handleVictory, handleDefeat } from '@/utils/battleResults';

interface UseBattleEffectsProps {
  player: Character;
  opponent1: Character;  // Renamed from opponent1 to opponent for clarity
  battleTimer: number;
  isPlayerTurn: boolean;
  isBattleStarted: boolean;
  isBattleOver: boolean;
  sosoHealMode: boolean;
  actionInProgress: boolean;
  setSosoHealMode: (mode: boolean) => void;
  setIsBattleOver: (isOver: boolean) => void;
  addComment: (author: string, text: string, isSystem?: boolean) => void;
  setSoundEffect: (sound: string | null) => void;
  handleOpponentAttack: () => void;
  handleSosoHeal: () => void;
  setActionInProgress: (inProgress: boolean) => void;
}

export const useBattleEffects = ({
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
}: UseBattleEffectsProps) => {
  const { handleScreenTransition } = useUI();

  // Handle opponent's turn
  useEffect(() => {
    let opponentTimer: NodeJS.Timeout;
    
    if (!isPlayerTurn && isBattleStarted && !isBattleOver && !actionInProgress) {
      opponentTimer = setTimeout(() => {
        setActionInProgress(true);
        
        if (sosoHealMode) {
          handleSosoHeal();
        } else {
          handleOpponentAttack();
        }
      }, 1500);
      
      return () => clearTimeout(opponentTimer);
    }
  }, [isPlayerTurn, isBattleStarted, isBattleOver, sosoHealMode, actionInProgress, handleOpponentAttack, handleSosoHeal, setActionInProgress]);

  // Add a safety effect to reset actionInProgress if battle is over
  useEffect(() => {
    if (isBattleOver) {
      setActionInProgress(false);
    }
  }, [isBattleOver, setActionInProgress]);

  // Check for battle over conditions
  useEffect(() => {
    if ((player.currentHp <= 0 || opponent1.currentHp <= 0) && !isBattleOver && isBattleStarted) {
      setIsBattleOver(true);
      setActionInProgress(false);
      
      if (player.currentHp <= 0) {
        // Player lost
        handleDefeat(addComment, setSoundEffect, handleScreenTransition);
      } else if (opponent1.currentHp <= 0) {
        // Player won
        handleVictory(addComment, setSoundEffect, handleScreenTransition);
      }
    }
  }, [player.currentHp, opponent1.currentHp, isBattleOver, isBattleStarted, setIsBattleOver, addComment, setSoundEffect, handleScreenTransition, setActionInProgress]);

  // Activate soso heal mode after 30 seconds - use ref to track if already activated
  useEffect(() => {
    if (battleTimer >= 30 && !sosoHealMode && !isBattleOver) {
      setSosoHealMode(true);
      addComment("システム", "そーそーのとくぎがはつどうした！", true);
    }
  }, [battleTimer, sosoHealMode, isBattleOver, addComment, setSosoHealMode]);
};
