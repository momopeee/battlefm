
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import AudioPlayer from '@/components/AudioPlayer';
import CharacterPortraits from '@/components/battle/CharacterPortraits';
import GaugesDisplay from '@/components/battle/GaugesDisplay';
import BattleActions from '@/components/battle/BattleActions';
import PlayerInfo from '@/components/battle/PlayerInfo';
import CommentArea from '@/components/CommentArea';
import CommentInput from '@/components/battle/CommentInput';
import CharacterSheet from '@/components/CharacterSheet';
import useBattleLogic from '@/hooks/useBattleLogic';

const Battle2Screen: React.FC = () => {
  const navigate = useNavigate();
  const { 
    player, 
    opponent2,
    bgmEnabled,
    battleTimer,
    showCharacterSheet,
    setShowCharacterSheet,
    setPlayer,
    clearComments,
    addComment
  } = useApp();
  
  const {
    playerHp,
    opponentHp,
    attackCount,
    specialAttackAvailable,
    isPlayerTurn,
    yujiSpecialMode,
    attackInProgress,
    setPlayerHp,
    setOpponentHp,
    handleAttack,
    handleSpecialAttack,
    handleDefend
  } = useBattleLogic(player, opponent2, 'battle2');
  
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Reset battle state on component mount
  useEffect(() => {
    clearComments();
    setPlayerHp(player.currentHp);
    setOpponentHp(opponent2.currentHp);
    
    // Initial system message
    setTimeout(() => {
      addComment('システム', '第二戦！とおる VS ゆうじ＠陽気なおじさん', true);
      addComment('ゆうじ', 'ようこそ！やまにぃのマネージャー面接へ！実践形式で早速やってみましょう！');
    }, 1000);
    
    return () => {
      // Clean up any battle state
    };
  }, []);
  
  // Check for battle end conditions
  useEffect(() => {
    if (playerHp <= 0) {
      setBattleResult('defeat');
      setShowResults(true);
      
      // Navigate to ending screen after delay
      setTimeout(() => {
        navigate('/endingB');
      }, 15000);
    } else if (opponentHp <= 0) {
      setBattleResult('victory');
      setShowResults(true);
      
      // Navigate to ending screen after delay
      setTimeout(() => {
        navigate('/endingA');
      }, 15000);
    }
  }, [playerHp, opponentHp, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white font-hiragino relative">
      {/* Background audio */}
      <AudioPlayer src="/audios/battle.mp3" loop autoPlay />
      
      {/* Battle timer and info display */}
      <div className="p-2 border-b border-gray-700 flex justify-between items-center">
        <div className="text-sm">バトル時間: {battleTimer}秒</div>
        <PlayerInfo attackCount={attackCount} specialAttackAvailable={specialAttackAvailable} />
      </div>
      
      {/* Main battle area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Battle visuals */}
        <div className="w-full md:w-2/3 p-4 flex flex-col">
          {/* Character portraits */}
          <CharacterPortraits 
            player={player} 
            opponent={opponent2} 
            isPlayerTurn={isPlayerTurn}
            attackInProgress={attackInProgress}
            showSpecialAttack={yujiSpecialMode}
          />
          
          {/* HP gauges */}
          <GaugesDisplay 
            player={player}
            opponent={opponent2}
            playerHp={playerHp}
            opponentHp={opponentHp}
          />
          
          {/* Battle actions */}
          <BattleActions
            onAttack={handleAttack}
            onSpecialAttack={handleSpecialAttack}
            onDefend={handleDefend}
            specialAttackAvailable={specialAttackAvailable}
            isPlayerTurn={isPlayerTurn}
            attackInProgress={attackInProgress}
            battleResult={battleResult}
          />
        </div>
        
        {/* Right side - Comments */}
        <div className="w-full md:w-1/3 border-t md:border-t-0 md:border-l border-gray-700 flex flex-col">
          <CommentArea />
          <CommentInput isDisabled={!!battleResult || attackInProgress} />
        </div>
      </div>
      
      {/* Character sheet modal */}
      {showCharacterSheet && (
        <CharacterSheet onClose={() => setShowCharacterSheet(false)} />
      )}
      
      {/* Battle results overlay */}
      {showResults && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center p-8 rounded-lg">
            <h2 className="text-4xl font-bold mb-4">
              {battleResult === 'victory' ? (
                <span className="text-battle-gameclear">勝利！</span>
              ) : (
                <span className="text-battle-gameover">敗北...</span>
              )}
            </h2>
            <p className="text-xl mb-8">
              {battleResult === 'victory' 
                ? 'とおるはゆうじの陽気なおじさんに勝利した！'
                : 'とおるはゆうじの陽気なおじさんに敗北した...'}
            </p>
            <div className="animate-pulse text-gray-400">
              画面遷移中...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Battle2Screen;
