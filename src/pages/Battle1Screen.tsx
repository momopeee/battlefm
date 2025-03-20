
import React from 'react';
import { useApp } from '@/context/AppContext';
import CommentArea from '@/components/CommentArea';
import CharacterSheet from '@/components/CharacterSheet';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AudioPlayer from '@/components/AudioPlayer';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileContainer from '@/components/MobileContainer';

// Import the new components
import PlayerInfo from '@/components/battle/PlayerInfo';
import CharacterPortraits from '@/components/battle/CharacterPortraits';
import GaugesDisplay from '@/components/battle/GaugesDisplay';
import BattleActions from '@/components/battle/BattleActions';
import CommentInput from '@/components/battle/CommentInput';
import { useBattleLogic } from '@/hooks/useBattleLogic';

const Battle1Screen: React.FC = () => {
  const { bgmEnabled, toggleBgm } = useApp();
  const isMobile = useIsMobile();
  
  const {
    player,
    opponent1,
    battleTimer,
    isBattleOver,
    isPlayerTurn,
    attackCount,
    sosoHealMode,
    specialAttackAvailable,
    comments,
    showSkipButton,
    handlePlayerAttack,
    handlePlayerSpecial,
    handleRunAway,
    handleHighball,
    handleCharacterClick,
    showCharacterSheet,
    currentCharacterSheet,
    setShowCharacterSheet,
    handleSkip,
    battleResult,
    soundEffect
  } = useBattleLogic();

  // BGM URLs
  const battleBgmUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/25dcdcc6-7a5a-47a2-9406-e65a76e382ba/toru.mp3?table=block&id=1ba25ac2-cb4e-8044-92be-e2545318adf3&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742335200000&signature=MHFbJx9mCs0X6KbOv59pptHsCjNnl8kiLkpKAHHl-_U";
  const victoryBgmUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/a44a510a-0da9-46d6-9d70-ddeb68b9f3c0/syouri.mp3?table=block&id=1ba25ac2-cb4e-8053-b5be-d99d848c557b&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742335200000&signature=MedUZRSs0R4-GLmakmxYgAZ_HxcnwR6meCjmouLfKVE";
  const defeatBgmUrl = "https://soundcloud.com/davis-momoyama/orehamou/s-q3IJA3aoBNH?in=davis-momoyama/sets/battlefm/s-NbrA67b7tx5";
  // New BGM for Soso's special skill
  const sosoSpecialBgmUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/1c45cbeb-2096-44c9-bb81-88def03f8f3c/%E3%81%98%E3%81%8D%E3%81%9D%E3%81%86%E3%81%9D%E3%81%86.mp3?table=block&id=1bb25ac2-cb4e-80bc-a1b1-f329bfa138f5&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742508000000&signature=6P7r540RJ3gTPZwAhXxoSN6yiQCsgL0z1OxYDhi-y0U";

  // Get the current BGM based on battle state
  const currentBgm = battleResult === 'victory' 
    ? victoryBgmUrl 
    : battleResult === 'defeat' 
      ? defeatBgmUrl 
      : sosoHealMode
        ? sosoSpecialBgmUrl
        : battleBgmUrl;

  return (
    <MobileContainer
      backgroundGradient="linear-gradient(180deg, rgba(212, 50, 144, 1), rgba(119, 3, 175, 1))"
    >
      <div 
        className="flex flex-col h-full p-2 sm:p-4 text-white relative"
        style={{ 
          background: 'linear-gradient(180deg, rgba(212, 50, 144, 1), rgba(119, 3, 175, 1))',
          fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Background Music */}
        <AudioPlayer 
          src={currentBgm} 
          loop={battleResult === null} 
          autoPlay={true} 
        />

        {/* Sound Effects */}
        {soundEffect && (
          <AudioPlayer 
            src={soundEffect} 
            loop={false} 
            autoPlay={true} 
            volume={0.7}
          />
        )}
        
        {/* Top section with title and timer */}
        <PlayerInfo 
          name="とおる＠経営参謀" 
          icon={player.icon}
          battleTimer={battleTimer}
        />
        
        {/* Health and special gauges */}
        <GaugesDisplay 
          player={player}
          opponent={opponent1}
          attackCount={attackCount}
          sosoHealMode={sosoHealMode}
        />
        
        {/* Character portraits */}
        <CharacterPortraits 
          player={player}
          opponent={opponent1}
          onCharacterClick={handleCharacterClick}
          sosoHealMode={sosoHealMode}
        />
        
        {/* Comments area with responsive height */}
        <div className="flex-1 mb-1 sm:mb-2 h-[20vh] sm:h-[25vh] overflow-hidden">
          <CommentArea comments={comments} />
        </div>
        
        {/* Battle actions at bottom */}
        <div className="mt-auto">
          {/* Battle actions buttons */}
          <BattleActions 
            isPlayerTurn={isPlayerTurn}
            isBattleOver={isBattleOver}
            specialAttackAvailable={specialAttackAvailable}
            onAttack={handlePlayerAttack}
            onSpecial={handlePlayerSpecial}
            onRunAway={handleRunAway}
            onHighball={handleHighball}
          />
          
          {/* Comment input - always at bottom */}
          <CommentInput />
        </div>
        
        {/* Skip Button - Fixed positioning to be inside the container on desktop */}
        {showSkipButton && (
          <Button
            onClick={handleSkip}
            className="absolute bottom-16 sm:bottom-20 right-3 sm:right-6 z-20 bg-purple-600 hover:bg-purple-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md animate-pulse flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            style={{ position: 'absolute' }} // Ensure it's absolutely positioned within container
          >
            <SkipForward size={isMobile ? 16 : 20} />
            スキップ
          </Button>
        )}
        
        {/* BGM Toggle Button */}
        <button
          onClick={toggleBgm}
          className="absolute top-3 sm:top-6 right-3 sm:right-6 z-20 bg-white/10 backdrop-blur-sm p-2 sm:p-3 rounded-full hover:bg-white/20 transition-colors"
        >
          {bgmEnabled ? 
            <Volume2 size={isMobile ? 20 : 24} color="white" /> : 
            <VolumeX size={isMobile ? 20 : 24} color="white" />
          }
        </button>
        
        {/* Character Sheet Popup */}
        {showCharacterSheet && (
          <CharacterSheet 
            character={currentCharacterSheet} 
            onClose={() => setShowCharacterSheet(false)} 
          />
        )}
      </div>
    </MobileContainer>
  );
};

export default Battle1Screen;
