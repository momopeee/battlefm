
import React, { useEffect, useState, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import CommentArea from '@/components/CommentArea';
import CharacterSheet from '@/components/CharacterSheet';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AudioPlayer from '@/components/AudioPlayer';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileContainer from '@/components/MobileContainer';

// Import the components
import PlayerInfo from '@/components/battle/PlayerInfo';
import CharacterPortraits from '@/components/battle/CharacterPortraits';
import GaugesDisplay from '@/components/battle/GaugesDisplay';
import BattleActions from '@/components/battle/BattleActions';
import CommentInput from '@/components/battle/CommentInput';
import { useBattleLogic } from '@/hooks/useBattleLogic';
import { BATTLE_BGM, SOSO_SPECIAL_BGM, VICTORY_BGM, DEFEAT_BGM, BUTTON_SOUND } from '@/constants/audioUrls';

const Battle1Screen: React.FC = () => {
  const { bgmEnabled, toggleBgm } = useApp();
  const isMobile = useIsMobile();
  const [buttonSound, setButtonSound] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  
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
    battleResult
  } = useBattleLogic();

  // Memoize the current BGM to prevent unnecessary re-renders
  const getCurrentBgm = useCallback(() => {
    if (battleResult === 'victory') {
      console.log('Playing victory BGM');
      return VICTORY_BGM;
    } else if (battleResult === 'defeat') {
      console.log('Playing defeat BGM');
      return DEFEAT_BGM;
    } else if (sosoHealMode) {
      console.log('Playing Soso special BGM');
      return SOSO_SPECIAL_BGM;
    } else {
      console.log('Playing normal battle BGM');
      return BATTLE_BGM;
    }
  }, [battleResult, sosoHealMode]);

  const currentBgm = getCurrentBgm();
  
  // Track when the BGM changes to force AudioPlayer to reset
  const [bgmKey, setBgmKey] = useState(Date.now());
  
  useEffect(() => {
    // When the BGM source changes, update the key to force AudioPlayer to reset
    setBgmKey(Date.now());
    console.log(`BGM changed to: ${currentBgm}`);
    
    // Preload important audio files
    const preloadAudios = [BATTLE_BGM, SOSO_SPECIAL_BGM, VICTORY_BGM, DEFEAT_BGM, BUTTON_SOUND];
    preloadAudios.forEach(url => {
      const audio = new Audio();
      audio.src = url;
      console.log(`Preloading audio: ${url}`);
    });
  }, [currentBgm]);

  // Helper function to handle button clicks with sound
  const playButtonSoundAndDoAction = (action: () => void) => {
    if (actionInProgress) return;
    
    setActionInProgress(true);
    setButtonSound(BUTTON_SOUND);
    
    // Wait for sound to start playing before action
    setTimeout(() => {
      action();
      // Reset after action
      setTimeout(() => {
        setButtonSound(null);
        setActionInProgress(false);
      }, 500);
    }, 200);
  };
  
  // Wrap the skip handler with sound
  const handleSkipWithSound = () => {
    playButtonSoundAndDoAction(handleSkip);
  };

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
        {/* Background Music with key to force refresh when source changes */}
        <AudioPlayer 
          src={currentBgm} 
          loop={battleResult === null} 
          autoPlay={true} 
          volume={0.7}
          id={`battle1-bgm-${bgmKey}`}
          key={`bgm-${bgmKey}`}
        />
        
        {/* Button sound effect player */}
        {buttonSound && (
          <AudioPlayer 
            src={buttonSound} 
            loop={false} 
            autoPlay={true} 
            volume={0.7}
            id="button-sound" 
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
            onClick={handleSkipWithSound}
            disabled={actionInProgress}
            className={`absolute bottom-16 sm:bottom-20 right-3 sm:right-6 z-20 bg-purple-600 hover:bg-purple-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md animate-pulse flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${actionInProgress ? 'opacity-70' : ''}`}
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
