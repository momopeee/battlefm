
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
  // Function to handle button animation on click
  const handleButtonAnimation = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.classList.remove('animate');
    void btn.offsetWidth; // Trigger reflow to enable re-animation
    btn.classList.add('animate');
    
    // Use setTimeout to remove the animation class after it completes
    setTimeout(() => {
      if (btn) btn.classList.remove('animate');
    }, 700);
  };

  // Combined click handler for animation and action
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, action: () => void) => {
    handleButtonAnimation(e);
    
    // Call the action after a slight delay to let the animation start
    // This ensures the action is still called even if the animation is interrupted
    setTimeout(() => {
      action();
    }, 50);
  };

  return (
    <div className="grid grid-cols-4 gap-2 mb-2">
      <button 
        onClick={(e) => handleButtonClick(e, onAttack)} 
        disabled={!isPlayerTurn || isBattleOver}
        className={`battle-action-button text-xs whitespace-nowrap ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
      >
        こうげき
      </button>
      
      <button 
        onClick={(e) => handleButtonClick(e, onSpecial)} 
        disabled={!isPlayerTurn || isBattleOver || !specialAttackAvailable}
        className={`battle-action-button text-xs whitespace-nowrap ${!isPlayerTurn || isBattleOver || !specialAttackAvailable ? 'opacity-60' : ''} ${specialAttackAvailable ? 'bg-pink-500 hover:bg-pink-600' : ''}`}
      >
        とくぎ
      </button>
      
      <button 
        onClick={(e) => handleButtonClick(e, onRunAway)} 
        disabled={!isPlayerTurn || isBattleOver}
        className={`battle-action-button text-xs whitespace-nowrap ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
      >
        にげる
      </button>
      
      <button 
        onClick={(e) => handleButtonClick(e, onHighball)} 
        disabled={!isPlayerTurn || isBattleOver}
        className={`battle-action-button text-xs whitespace-nowrap ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
      >
        ハイボール
      </button>
    </div>
  );
};

export default BattleActions;
