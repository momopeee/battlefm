
import React from 'react';
import { useApp } from '@/context/AppContext';
import CommentArea from '@/components/CommentArea';
import CharacterSheet from '@/components/CharacterSheet';
import AudioPlayer from '@/components/AudioPlayer';
import { Volume2, VolumeX } from 'lucide-react';

// Import the battle components
import PlayerInfo from '@/components/battle/PlayerInfo';
import CharacterPortraits from '@/components/battle/CharacterPortraits';
import GaugesDisplay from '@/components/battle/GaugesDisplay';
import BattleActions from '@/components/battle/BattleActions';
import CommentInput from '@/components/battle/CommentInput';
import { useBattle2Logic } from '@/hooks/useBattle2Logic';

const Battle2Screen: React.FC = () => {
  const { bgmEnabled, toggleBgm } = useApp();
  const {
    player,
    opponent2,
    battleTimer,
    isBattleOver,
    soundEffect,
    isPlayerTurn,
    attackCount,
    specialAttackAvailable,
    yujiSpecialMode,
    comments,
    handlePlayerAttack,
    handlePlayerSpecial,
    handleRunAway,
    handleHighball,
    handleCharacterClick,
    showCharacterSheet,
    currentCharacterSheet,
    setShowCharacterSheet
  } = useBattle2Logic();

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
      {/* Top section with title and timer */}
      <PlayerInfo 
        name={player.name} 
        icon={player.icon}
        battleTimer={battleTimer}
        battleTitle="陽気なおじさんゆうじ！"
      />
      
      {/* Health and special gauges */}
      <GaugesDisplay 
        player={player}
        opponent={opponent2}
        attackCount={attackCount}
        sosoHealMode={false}
      />
      
      {/* Character portraits */}
      <CharacterPortraits 
        player={player}
        opponent={opponent2}
        onCharacterClick={handleCharacterClick}
        sosoHealMode={false}
      />
      
      {/* Yuji special mode indicator */}
      {yujiSpecialMode && (
        <div className="absolute top-32 left-0 right-0 text-center z-50">
          <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse">
            ゆうじ確変中
          </span>
        </div>
      )}
      
      {/* Comments area with fixed height */}
      <div className="flex-1 mb-2 h-[40vh] overflow-hidden">
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
