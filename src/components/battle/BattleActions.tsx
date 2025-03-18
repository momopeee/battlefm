
import React, { useRef, useEffect } from 'react';
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
  // Sound effect URLs
  const attackSoundUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/abdeae92-2100-414d-abbd-b08bb5b71d39/%E9%87%8D%E3%81%84%E3%83%91%E3%83%B3%E3%83%811.mp3?table=block&id=1ba25ac2-cb4e-80e0-9924-ed0a24a6f198&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742335200000&signature=3scJJIs_9S0rpK5FvRWDYu_BemoFRrSPwDnaAN3qHXA";
  const specialSoundUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/2c5b6d49-e046-4e08-8dd6-6ae18027a4b8/%E7%88%86%E7%99%BA4.mp3?table=block&id=1ba25ac2-cb4e-80b6-8ab8-d0fb2af8a014&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742335200000&signature=4qs0cIAra3X4KC_InULFtCZQf9TWhvB3_63i-9ArV8M";
  const runAwaySoundUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/4f645f2c-f0b8-448b-8d50-456bfdb5784d/%E9%80%83%E8%B5%B0.mp3?table=block&id=1ba25ac2-cb4e-80de-baa2-f9f7e72e4251&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742335200000&signature=bwt1GZVK2kiStSTBTUx_qh_aZoqv3EEP7KDtg-9fVC8";
  const highballSoundUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/d464a1a7-f003-4989-a25e-1c171564db92/%E3%82%B0%E3%83%A9%E3%82%B9%E3%81%AB%E6%B0%B4%E3%82%92%E6%B3%A8%E3%81%90.mp3?table=block&id=1ba25ac2-cb4e-8048-97ee-d8e9d2325185&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742335200000&signature=bmXB17hsna7yGoHG8heWNyXecwz20H2HXZCh9EBIVfM";

  // Sound effect state
  const [currentSound, setCurrentSound] = React.useState<string | null>(null);

  // Function to handle button animation on click
  const handleButtonAnimation = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.classList.remove('animate');
    void btn.offsetWidth; // Reflowを起こし再アニメーション可能にする
    btn.classList.add('animate');
    setTimeout(() => btn.classList.remove('animate'), 700);
  };

  // Combined click handler for animation, sound and action
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, action: () => void, soundUrl: string) => {
    handleButtonAnimation(e);
    setCurrentSound(soundUrl); // Play the sound effect
    
    // Reset sound after a short delay to allow it to play again on next click
    setTimeout(() => {
      setCurrentSound(null);
    }, 1000);
    
    action();
  };

  return (
    <>
      {/* Sound effect player */}
      {currentSound && (
        <AudioPlayer 
          src={currentSound} 
          loop={false} 
          autoPlay={true} 
          volume={0.7}
        />
      )}
      
      <div className="grid grid-cols-4 gap-2 mb-2">
        <button 
          onClick={(e) => handleButtonClick(e, onAttack, attackSoundUrl)} 
          disabled={!isPlayerTurn || isBattleOver}
          className={`battle-action-button text-xs whitespace-nowrap ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
        >
          こうげき
        </button>
        
        <button 
          onClick={(e) => handleButtonClick(e, onSpecial, specialSoundUrl)} 
          disabled={!isPlayerTurn || isBattleOver || !specialAttackAvailable}
          className={`battle-action-button text-xs whitespace-nowrap ${!isPlayerTurn || isBattleOver || !specialAttackAvailable ? 'opacity-60' : ''} ${specialAttackAvailable ? 'bg-pink-500 hover:bg-pink-600' : ''}`}
        >
          とくぎ
        </button>
        
        <button 
          onClick={(e) => handleButtonClick(e, onRunAway, runAwaySoundUrl)} 
          disabled={!isPlayerTurn || isBattleOver}
          className={`battle-action-button text-xs whitespace-nowrap ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
        >
          にげる
        </button>
        
        <button 
          onClick={(e) => handleButtonClick(e, onHighball, highballSoundUrl)} 
          disabled={!isPlayerTurn || isBattleOver}
          className={`battle-action-button text-xs whitespace-nowrap ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
        >
          ハイボール
        </button>
      </div>
    </>
  );
};

export default BattleActions;
