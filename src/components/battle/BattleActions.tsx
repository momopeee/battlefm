
import React, { useRef, useEffect, useState } from 'react';
import AudioPlayer from '@/components/AudioPlayer';

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
  // Audio URLs for button clicks
  const attackSoundUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/abdeae92-2100-414d-abbd-b08bb5b71d39/%E9%87%8D%E3%81%84%E3%83%91%E3%83%B3%E3%83%811.mp3?table=block&id=1ba25ac2-cb4e-80e0-9924-ed0a24a6f198&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742508000000&signature=7WjQ7ESvhUSBQOJh8Nt3kVQtomoy2tBxAfHvlmQ4KS8&downloadName=%E9%87%8D%E3%81%84%E3%83%91%E3%83%B3%E3%83%811.mp3";
  const specialSoundUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/2c5b6d49-e046-4e08-8dd6-6ae18027a4b8/%E7%88%86%E7%99%BA4.mp3?table=block&id=1ba25ac2-cb4e-80b6-8ab8-d0fb2af8a014&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742508000000&signature=x9TLrUjs2E4nzcQoTL-GpboK8Xg6c_phPfifR6jmRFg&downloadName=%E7%88%86%E7%99%BA4.mp3";
  const runAwaySoundUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/4f645f2c-f0b8-448b-8d50-456bfdb5784d/%E9%80%83%E8%B5%B0.mp3?table=block&id=1ba25ac2-cb4e-80de-baa2-f9f7e72e4251&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742508000000&signature=Vew8Jvfv5--7TdBz1-ncCz0gra2kd8gA6FhOV6uxLWQ&downloadName=%E9%80%83%E8%B5%B0.mp3";
  const highballSoundUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/d464a1a7-f003-4989-a25e-1c171564db92/%E3%82%B0%E3%83%A9%E3%82%B9%E3%81%AB%E6%B0%B4%E3%82%92%E6%B3%A8%E3%81%90.mp3?table=block&id=1ba25ac2-cb4e-8048-97ee-d8e9d2325185&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742508000000&signature=ghJit1q5IKzZSfrx3QMg3tRJDVvtgntEvKce1rcsI_U&downloadName=%E3%82%B0%E3%83%A9%E3%82%B9%E3%81%AB%E6%B0%B4%E3%82%92%E6%B3%A8%E3%81%90.mp3";
  
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
    setSoundToPlay({ src: attackSoundUrl, key: Date.now() });
    console.log("Playing attack sound");
    onAttack();
  };

  const handleSpecialClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleButtonAnimation(e);
    setSoundToPlay({ src: specialSoundUrl, key: Date.now() });
    console.log("Playing special sound");
    onSpecial();
  };

  const handleRunAwayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleButtonAnimation(e);
    setSoundToPlay({ src: runAwaySoundUrl, key: Date.now() });
    console.log("Playing run away sound");
    onRunAway();
  };

  const handleHighballClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleButtonAnimation(e);
    setSoundToPlay({ src: highballSoundUrl, key: Date.now() });
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
