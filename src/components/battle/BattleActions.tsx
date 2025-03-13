
import React from 'react';

interface BattleActionsProps {
  isPlayerTurn: boolean;
  isBattleOver: boolean;
  specialAttackAvailable: boolean;
  onAttack: () => void;
  onSpecial: () => void;
  onRunAway: () => void;
  onHighball: () => void;
}

const BattleActions: React.FC<BattleActionsProps> = ({
  isPlayerTurn,
  isBattleOver,
  specialAttackAvailable,
  onAttack,
  onSpecial,
  onRunAway,
  onHighball
}) => {
  return (
    <div className="grid grid-cols-4 gap-2 mb-2">
      <button 
        onClick={onAttack} 
        disabled={!isPlayerTurn || isBattleOver}
        className={`battle-action-button text-xs ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
      >
        こうげき
      </button>
      
      <button 
        onClick={onSpecial} 
        disabled={!isPlayerTurn || isBattleOver || !specialAttackAvailable}
        className={`battle-action-button text-xs ${!isPlayerTurn || isBattleOver || !specialAttackAvailable ? 'opacity-60' : ''}`}
      >
        とくぎ
      </button>
      
      <button 
        onClick={onRunAway} 
        disabled={!isPlayerTurn || isBattleOver}
        className={`battle-action-button text-xs ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
      >
        にげる
      </button>
      
      <button 
        onClick={onHighball} 
        disabled={!isPlayerTurn || isBattleOver}
        className={`battle-action-button text-xs ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
      >
        ハイボール
      </button>
    </div>
  );
};

export default BattleActions;
