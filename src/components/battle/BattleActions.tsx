
import React, { useRef, useEffect, useState } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import { ATTACK_SOUND, SPECIAL_SOUND, RUN_AWAY_SOUND, HIGHBALL_SOUND } from '@/constants/audioUrls';

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
  // State to track which sound to play - using unique key to force rerender
  const [soundToPlay, setSoundToPlay] = useState<{ src: string | null, key: number }>({ 
    src: null, 
    key: 0 
  });
  
  // Track if action is in progress to prevent double-clicks
  const [actionInProgress, setActionInProgress] = useState(false);

  // Function to handle button animation on click
  const handleButtonAnimation = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.classList.remove('animate');
    void btn.offsetWidth; // Force reflow to enable re-animation
    btn.classList.add('animate');
    setTimeout(() => btn.classList.remove('animate'), 700);
  };

  // Helper function to handle all battle actions
  const handleActionWithSound = (e: React.MouseEvent<HTMLButtonElement>, soundSrc: string, action: () => void) => {
    if (actionInProgress) return;
    
    handleButtonAnimation(e);
    setSoundToPlay({ src: soundSrc, key: Date.now() });
    setActionInProgress(true);
    
    // Small delay to make sure sound starts playing before action
    setTimeout(() => {
      action();
      // Reset action in progress after a delay
      setTimeout(() => setActionInProgress(false), 500);
    }, 100);
  };

  // Combined click handlers with sound and action
  const handleAttackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleActionWithSound(e, ATTACK_SOUND, onAttack);
  };

  const handleSpecialClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleActionWithSound(e, SPECIAL_SOUND, onSpecial);
  };

  const handleRunAwayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleActionWithSound(e, RUN_AWAY_SOUND, onRunAway);
  };

  const handleHighballClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleActionWithSound(e, HIGHBALL_SOUND, onHighball);
  };

  // Reset sound after playing
  useEffect(() => {
    if (soundToPlay.src) {
      const timer = setTimeout(() => {
        setSoundToPlay({ src: null, key: soundToPlay.key });
      }, 2000); // Longer timeout to ensure sound completes
      return () => clearTimeout(timer);
    }
  }, [soundToPlay]);

  // Handle sound effect completion
  const handleSoundEnded = () => {
    console.log(`Sound effect completed`);
  };

  return (
    <>
      {/* Sound effect player */}
      {soundToPlay.src && (
        <AudioPlayer 
          src={soundToPlay.src} 
          loop={false} 
          autoPlay={true} 
          volume={0.7} 
          key={`sound-effect-${soundToPlay.key}`} 
          id="battle-action-sound"
          onEnded={handleSoundEnded}
        />
      )}
      
      <div className="grid grid-cols-4 gap-2 mb-2">
        <button 
          onClick={handleAttackClick} 
          disabled={!isPlayerTurn || isBattleOver || actionInProgress}
          className={`battle-action-button text-[11px] whitespace-nowrap ${(!isPlayerTurn || isBattleOver || actionInProgress) ? 'opacity-60' : ''}`}
        >
          こうげき
        </button>
        
        <button 
          onClick={handleSpecialClick} 
          disabled={!isPlayerTurn || isBattleOver || !specialAttackAvailable || actionInProgress}
          className={`battle-action-button text-[11px] whitespace-nowrap ${(!isPlayerTurn || isBattleOver || !specialAttackAvailable || actionInProgress) ? 'opacity-60' : ''} ${specialAttackAvailable ? 'bg-pink-500 hover:bg-pink-600' : ''}`}
        >
          とくぎ
        </button>
        
        <button 
          onClick={handleRunAwayClick} 
          disabled={!isPlayerTurn || isBattleOver || actionInProgress}
          className={`battle-action-button text-[11px] whitespace-nowrap ${(!isPlayerTurn || isBattleOver || actionInProgress) ? 'opacity-60' : ''}`}
        >
          にげる
        </button>
        
        <button 
          onClick={handleHighballClick} 
          disabled={!isPlayerTurn || isBattleOver || actionInProgress}
          className={`battle-action-button text-[11px] whitespace-nowrap ${(!isPlayerTurn || isBattleOver || actionInProgress) ? 'opacity-60' : ''}`}
        >
          ハイボール
        </button>
      </div>
    </>
  );
};

export default BattleActions;
