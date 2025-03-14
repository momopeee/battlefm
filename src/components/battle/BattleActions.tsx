
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
    // Remove any existing animation class
    btn.classList.remove('animate');
    // Force a reflow to ensure animation can be applied again
    void btn.offsetWidth;
    // Add animation class
    btn.classList.add('animate');
    
    // Clean up animation class after animation completes
    setTimeout(() => {
      if (btn && document.body.contains(btn)) {
        btn.classList.remove('animate');
      }
    }, 700);
  };

  return (
    <div className="grid grid-cols-4 gap-2 mb-2">
      <button 
        onClick={(e) => {
          if (isPlayerTurn && !isBattleOver) {
            handleButtonAnimation(e);
            onAttack();
          }
        }} 
        disabled={!isPlayerTurn || isBattleOver}
        className={`battle-action-button text-xs whitespace-nowrap ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
      >
        こうげき
      </button>
      
      <button 
        onClick={(e) => {
          if (isPlayerTurn && !isBattleOver && specialAttackAvailable) {
            handleButtonAnimation(e);
            onSpecial();
          }
        }} 
        disabled={!isPlayerTurn || isBattleOver || !specialAttackAvailable}
        className={`battle-action-button text-xs whitespace-nowrap ${!isPlayerTurn || isBattleOver || !specialAttackAvailable ? 'opacity-60' : ''} ${specialAttackAvailable ? 'bg-pink-500 hover:bg-pink-600' : ''}`}
      >
        とくぎ
      </button>
      
      <button 
        onClick={(e) => {
          if (isPlayerTurn && !isBattleOver) {
            handleButtonAnimation(e);
            onRunAway();
          }
        }} 
        disabled={!isPlayerTurn || isBattleOver}
        className={`battle-action-button text-xs whitespace-nowrap ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
      >
        にげる
      </button>
      
      <button 
        onClick={(e) => {
          if (isPlayerTurn && !isBattleOver) {
            handleButtonAnimation(e);
            onHighball();
          }
        }} 
        disabled={!isPlayerTurn || isBattleOver}
        className={`battle-action-button text-xs whitespace-nowrap ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
      >
        ハイボール
      </button>
    </div>
  );
};

export default BattleActions;
