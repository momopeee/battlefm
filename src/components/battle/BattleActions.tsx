
import React, { useRef, useEffect, useState } from 'react';
import AudioPlayer from '@/components/AudioPlayer';

// New audio URLs for button clicks
const ATTACK_SOUND_URL = "https://tangerine-valkyrie-189847.netlify.app/3-a-kougeki.mp3";
const SPECIAL_SOUND_URL = "https://tangerine-valkyrie-189847.netlify.app/3-b-tokugi.mp3";
const RUN_AWAY_SOUND_URL = "https://tangerine-valkyrie-189847.netlify.app/3-c-nigeru.mp3";
const HIGHBALL_SOUND_URL = "https://tangerine-valkyrie-189847.netlify.app/3-d-highball.mp3";

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

  // Function to handle button animation on click
  const handleButtonAnimation = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.classList.remove('animate');
    void btn.offsetWidth; // Reflowを起こし再アニメーション可能にする
    btn.classList.add('animate');
    setTimeout(() => btn.classList.remove('animate'), 700);
  };

  // Combined click handler for animation, sound, and action
  const handleAttackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleButtonAnimation(e);
    setSoundToPlay({ src: ATTACK_SOUND_URL, key: Date.now() });
    console.log("Playing attack sound");
    onAttack();
  };

  const handleSpecialClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleButtonAnimation(e);
    setSoundToPlay({ src: SPECIAL_SOUND_URL, key: Date.now() });
    console.log("Playing special sound");
    onSpecial();
  };

  const handleRunAwayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleButtonAnimation(e);
    setSoundToPlay({ src: RUN_AWAY_SOUND_URL, key: Date.now() });
    console.log("Playing run away sound");
    onRunAway();
  };

  const handleHighballClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleButtonAnimation(e);
    setSoundToPlay({ src: HIGHBALL_SOUND_URL, key: Date.now() });
    console.log("Playing highball sound");
    onHighball();
  };

  // Reset sound after playing
  useEffect(() => {
    if (soundToPlay.src) {
      const timer = setTimeout(() => {
        setSoundToPlay({ src: null, key: soundToPlay.key });
      }, 1500); // Longer timeout to ensure sound completes
      return () => clearTimeout(timer);
    }
  }, [soundToPlay]);

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
        />
      )}
      
      <div className="grid grid-cols-4 gap-2 mb-2">
        <button 
          onClick={handleAttackClick} 
          disabled={!isPlayerTurn || isBattleOver}
          className={`battle-action-button text-[11px] whitespace-nowrap ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
        >
          こうげき
        </button>
        
        <button 
          onClick={handleSpecialClick} 
          disabled={!isPlayerTurn || isBattleOver || !specialAttackAvailable}
          className={`battle-action-button text-[11px] whitespace-nowrap ${!isPlayerTurn || isBattleOver || !specialAttackAvailable ? 'opacity-60' : ''} ${specialAttackAvailable ? 'bg-pink-500 hover:bg-pink-600' : ''}`}
        >
          とくぎ
        </button>
        
        <button 
          onClick={handleRunAwayClick} 
          disabled={!isPlayerTurn || isBattleOver}
          className={`battle-action-button text-[11px] whitespace-nowrap ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
        >
          にげる
        </button>
        
        <button 
          onClick={handleHighballClick} 
          disabled={!isPlayerTurn || isBattleOver}
          className={`battle-action-button text-[11px] whitespace-nowrap ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
        >
          ハイボール
        </button>
      </div>
    </>
  );
};

export default BattleActions;
