
import React, { useRef, useEffect } from 'react';

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
  // Sound effect URLs
  const attackSoundUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/abdeae92-2100-414d-abbd-b08bb5b71d39/%E9%87%8D%E3%81%84%E3%83%91%E3%83%B3%E3%83%811.mp3?table=block&id=1ba25ac2-cb4e-80e0-9924-ed0a24a6f198&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742335200000&signature=3scJJIs_9S0rpK5FvRWDYu_BemoFRrSPwDnaAN3qHXA";
  const specialSoundUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/2c5b6d49-e046-4e08-8dd6-6ae18027a4b8/%E7%88%86%E7%99%BA4.mp3?table=block&id=1ba25ac2-cb4e-80b6-8ab8-d0fb2af8a014&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742335200000&signature=4qs0cIAra3X4KC_InULFtCZQf9TWhvB3_63i-9ArV8M";
  const runAwaySoundUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/4f645f2c-f0b8-448b-8d50-456bfdb5784d/%E9%80%83%E8%B5%B0.mp3?table=block&id=1ba25ac2-cb4e-80de-baa2-f9f7e72e4251&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742335200000&signature=bwt1GZVK2kiStSTBTUx_qh_aZoqv3EEP7KDtg-9fVC8";
  
  // Audio elements refs
  const attackAudioRef = useRef<HTMLAudioElement | null>(null);
  const specialAudioRef = useRef<HTMLAudioElement | null>(null);
  const runAwayAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio elements
  useEffect(() => {
    attackAudioRef.current = new Audio(attackSoundUrl);
    specialAudioRef.current = new Audio(specialSoundUrl);
    runAwayAudioRef.current = new Audio(runAwaySoundUrl);
    
    // Clean up on unmount
    return () => {
      if (attackAudioRef.current) {
        attackAudioRef.current.pause();
        attackAudioRef.current = null;
      }
      if (specialAudioRef.current) {
        specialAudioRef.current.pause();
        specialAudioRef.current = null;
      }
      if (runAwayAudioRef.current) {
        runAwayAudioRef.current.pause();
        runAwayAudioRef.current = null;
      }
    };
  }, []);
  
  // Function to handle button animation on click
  const handleButtonAnimation = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.classList.remove('animate');
    void btn.offsetWidth; // Reflowを起こし再アニメーション可能にする
    btn.classList.add('animate');
    setTimeout(() => btn.classList.remove('animate'), 700);
  };

  // Function to play sound
  const playSound = (audioRef: React.RefObject<HTMLAudioElement>) => {
    if (audioRef.current) {
      // Reset audio to beginning if it's already playing
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error("Audio playback prevented by browser:", error);
      });
    }
  };

  // Combined click handler for animation, sound, and action
  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>, 
    action: () => void, 
    audioRef: React.RefObject<HTMLAudioElement>
  ) => {
    handleButtonAnimation(e);
    if (isPlayerTurn && !isBattleOver) {
      playSound(audioRef);
    }
    action();
  };

  return (
    <div className="grid grid-cols-4 gap-2 mb-2">
      <button 
        onClick={(e) => handleButtonClick(e, onAttack, attackAudioRef)} 
        disabled={!isPlayerTurn || isBattleOver}
        className={`battle-action-button text-[11px] whitespace-nowrap ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
      >
        こうげき
      </button>
      
      <button 
        onClick={(e) => handleButtonClick(e, onSpecial, specialAudioRef)} 
        disabled={!isPlayerTurn || isBattleOver || !specialAttackAvailable}
        className={`battle-action-button text-[11px] whitespace-nowrap ${!isPlayerTurn || isBattleOver || !specialAttackAvailable ? 'opacity-60' : ''} ${specialAttackAvailable ? 'bg-pink-500 hover:bg-pink-600' : ''}`}
      >
        とくぎ
      </button>
      
      <button 
        onClick={(e) => handleButtonClick(e, onRunAway, runAwayAudioRef)} 
        disabled={!isPlayerTurn || isBattleOver}
        className={`battle-action-button text-[11px] whitespace-nowrap ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
      >
        にげる
      </button>
      
      <button 
        onClick={(e) => handleButtonClick(e, onHighball, attackAudioRef)} 
        disabled={!isPlayerTurn || isBattleOver}
        className={`battle-action-button text-[11px] whitespace-nowrap ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
      >
        ハイボール
      </button>
    </div>
  );
};

export default BattleActions;
