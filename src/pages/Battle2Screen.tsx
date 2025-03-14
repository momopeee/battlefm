
import React from 'react';
import { useApp } from '@/context/AppContext';
import CommentArea from '@/components/CommentArea';
import CharacterSheet from '@/components/CharacterSheet';
import AudioPlayer from '@/components/AudioPlayer';
import BgmPlayer from '@/components/BgmPlayer';
import { Volume2, VolumeX } from 'lucide-react';

// Import the new components
import PlayerInfo from '@/components/battle/PlayerInfo';
import CharacterPortraits from '@/components/battle/CharacterPortraits';
import GaugesDisplay from '@/components/battle/GaugesDisplay';
import BattleActions from '@/components/battle/BattleActions';
import CommentInput from '@/components/battle/CommentInput';
import { useBattleLogic } from '@/hooks/useBattleLogic';

const Battle2Screen: React.FC = () => {
  const { bgmEnabled, toggleBgm } = useApp();
  const {
    player,
    opponent1,
    battleTimer,
    isBattleOver,
    soundEffect,
    isPlayerTurn,
    attackCount,
    sosoHealMode,
    specialAttackAvailable,
    comments,
    handlePlayerAttack,
    handlePlayerSpecial,
    handleRunAway,
    handleHighball,
    handleCharacterClick,
    showCharacterSheet,
    currentCharacterSheet,
    setShowCharacterSheet,
    actionInProgress
  } = useBattleLogic();

  return (
    <div 
      className="min-h-screen flex flex-col h-screen p-4 text-white"
      style={{ 
        background: 'linear-gradient(180deg, rgba(212, 50, 144, 1), rgba(119, 3, 175, 1))',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif'
      }}
    >
      {/* BGM Player */}
      <BgmPlayer src="/audios/battle.mp3" />
      
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
          actionInProgress={actionInProgress}
          specialAttackAvailable={specialAttackAvailable}
          onAttack={handlePlayerAttack}
          onSpecial={handlePlayerSpecial}
          onRunAway={handleRunAway}
          onHighball={handleHighball}
        />
        
        {/* Comment input - always at bottom */}
        <CommentInput />
      </div>
      
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
      
      {/* Audio Player */}
      {soundEffect && <AudioPlayer src={soundEffect} />}
    </div>
  );
};

export default Battle2Screen;
