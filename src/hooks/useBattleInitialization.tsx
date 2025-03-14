
import { useEffect } from 'react';
import { Character } from '@/context/CharacterContext';

interface UseBattleInitializationProps {
  player: Character;
  opponent: Character;
  setPlayer: (player: Character) => void;
  setOpponent: (opponent: Character) => void;
  clearComments: () => void;
  resetBattleTimer: () => void;
  startBattleTimer: () => void;
  setAttackCount: (count: number) => void;
  setSpecialAttackAvailable: (available: boolean) => void;
  setHighballMode: (mode: boolean) => void;
  setSosoHealMode: (mode: boolean) => void;
  addComment: (author: string, text: string, isSystem?: boolean) => void;
  setIsBattleStarted: (started: boolean) => void;
}

export const useBattleInitialization = ({
  player,
  opponent,
  setPlayer,
  setOpponent,
  clearComments,
  resetBattleTimer,
  startBattleTimer,
  setAttackCount,
  setSpecialAttackAvailable,
  setHighballMode,
  setSosoHealMode,
  addComment,
  setIsBattleStarted
}: UseBattleInitializationProps) => {
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
    
    setOpponent({
      ...opponent,
      currentHp: opponent.maxHp
    });
    
    setAttackCount(0);
    setSpecialAttackAvailable(false);
    setHighballMode(false);
    setSosoHealMode(false);
    
    addComment("システム", "バトル開始！ さよならクソリプそーそー！", true);
  }, []); // Empty dependency array means this runs once on mount
};
