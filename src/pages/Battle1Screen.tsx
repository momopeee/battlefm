
import React from 'react';
import { useApp } from '@/context/AppContext';
import CommentArea from '@/components/CommentArea';
import CharacterSheet from '@/components/CharacterSheet';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AudioPlayer from '@/components/AudioPlayer';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const specialSkillBgmUrl = "https://cdncf.stand.fm/audios/01JFDDJRX8ZXW8VF97A98JE1VE.m4a";
  const victoryBgmUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/9982b577-fb1e-4011-9436-3e13286c44f3/%E9%81%94%E6%88%90%EF%BC%81_M299.mp3?table=block&id=1ba25ac2-cb4e-807d-9743-e96dc72d32a7&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742335200000&signature=yOX7oAp8IASCZBmVVeEBx07VyPdpWWDhsgRqWF_QQjU";
  const defeatBgmUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/e30ccbfa-dce6-4565-846f-299249020356/%E8%A6%87%E8%80%85%E3%81%A8%E5%91%BC%E3%81%B0%E3%82%8C%E3%81%9F%E6%95%97%E5%8C%97%E8%80%85%E3%81%AE%E6%97%A5%E5%B8%B8.mp3?table=block&id=1ba25ac2-cb4e-80ee-8559-fdcf6a1de25a&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742335200000&signature=S3FDTFsyARhC_rBvbBLjYidq9_I_yPs0Dvi_2AqTw8s";

  // Get the current BGM based on battle state
  const currentBgm = battleResult === 'victory' 
    ? victoryBgmUrl 
    : battleResult === 'defeat' 
      ? defeatBgmUrl 
      : sosoHealMode
        ? specialSkillBgmUrl
        : battleBgmUrl;

  return (
    <div 
      className="min-h-screen flex flex-col h-screen p-2 sm:p-4 text-white relative"
      style={{ 
        background: 'linear-gradient(180deg, rgba(212, 50, 144, 1), rgba(119, 3, 175, 1))',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif',
        width: '100%',
        maxWidth: '1080px',
        height: '100vh',
        maxHeight: '100vh',
        margin: '0 auto'
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
      
      {/* Skip Button - Only shown when battle is over and after delay */}
      {showSkipButton && (
        <Button
          onClick={handleSkip}
          className="fixed bottom-16 sm:bottom-20 right-3 sm:right-6 z-20 bg-purple-600 hover:bg-purple-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md animate-pulse flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
        >
          <SkipForward size={isMobile ? 16 : 20} />
          スキップ
        </Button>
      )}
      
      {/* BGM Toggle Button */}
      <button
        onClick={toggleBgm}
        className="fixed top-3 sm:top-6 right-3 sm:right-6 z-20 bg-white/10 backdrop-blur-sm p-2 sm:p-3 rounded-full hover:bg-white/20 transition-colors"
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
  );
};

export default Battle1Screen;
