
import React from 'react';
import { useApp } from '@/context/AppContext';
import CommentArea from '@/components/CommentArea';
import CharacterSheet from '@/components/CharacterSheet';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AudioPlayer from '@/components/AudioPlayer';

// Import the new components
import PlayerInfo from '@/components/battle/PlayerInfo';
import CharacterPortraits from '@/components/battle/CharacterPortraits';
import GaugesDisplay from '@/components/battle/GaugesDisplay';
import BattleActions from '@/components/battle/BattleActions';
import CommentInput from '@/components/battle/CommentInput';
import { useBattleLogic } from '@/hooks/useBattleLogic';

const Battle1Screen: React.FC = () => {
  const { bgmEnabled, toggleBgm } = useApp();
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
    handleSkip
  } = useBattleLogic();

  return (
    <div 
      className="min-h-screen flex flex-col h-screen p-4 text-white relative"
      style={{ 
        background: 'linear-gradient(180deg, rgba(212, 50, 144, 1), rgba(119, 3, 175, 1))',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif',
        width: '1080px',
        height: '1920px',
        maxWidth: '100vw',
        maxHeight: '100vh',
        margin: '0 auto'
      }}
    >
      {/* Top section with title and timer */}
      <PlayerInfo 
        name={player.name} 
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
      
      {/* Comments area with fixed height */}
      <div className="flex-1 mb-2 h-[25vh] overflow-hidden">
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
          className="fixed bottom-20 right-6 z-20 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md animate-pulse flex items-center gap-2"
        >
          <SkipForward size={20} />
          スキップ
        </Button>
      )}
      
      {/* BGM Toggle Button */}
      <button
        onClick={toggleBgm}
        className="fixed top-6 right-6 z-20 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
      >
        {bgmEnabled ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color="white" />}
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
