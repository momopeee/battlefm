
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
import { useBattleLogic } from '@/hooks/useBattleLogic';

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
    addComment,
    comments,
    currentCharacterSheet,
    yujiSpecialMode
  } = useApp();
  
  const {
    playerHp,
    opponentHp,
    attackCount,
    specialAttackAvailable,
    isPlayerTurn,
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
        <div className="text-sm">
          攻撃回数: {attackCount} | 特殊攻撃: {specialAttackAvailable ? '使用可能' : '充電中'}
        </div>
      </div>
      
      {/* Main battle area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Battle visuals */}
        <div className="w-full md:w-2/3 p-4 flex flex-col">
          {/* Character portraits */}
          <div className="flex justify-between mb-4">
            <div className={`transition-all duration-300 ${isPlayerTurn ? 'scale-110' : 'opacity-70'}`}>
              <img 
                src={player.icon} 
                alt={player.name} 
                className="w-32 h-32 object-cover rounded-lg shadow-lg"
              />
              <p className="text-center mt-2">{player.name}</p>
            </div>
            
            <div className={`transition-all duration-300 ${!isPlayerTurn ? 'scale-110' : 'opacity-70'}`}>
              <img 
                src={opponent2.icon} 
                alt={opponent2.name} 
                className={`w-32 h-32 object-cover rounded-lg shadow-lg ${attackInProgress || yujiSpecialMode ? 'animate-pulse' : ''}`}
              />
              <p className="text-center mt-2">{opponent2.name}</p>
            </div>
          </div>
          
          {/* HP gauges */}
          <div className="mb-6">
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>{player.name} HP</span>
                <span>{playerHp} / {player.maxHp}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-green-500 h-4 rounded-full transition-all duration-300" 
                  style={{ width: `${(playerHp / player.maxHp) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>{opponent2.name} HP</span>
                <span>{opponentHp} / {opponent2.maxHp}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-red-500 h-4 rounded-full transition-all duration-300" 
                  style={{ width: `${(opponentHp / opponent2.maxHp) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Battle actions */}
          <div className="mt-auto">
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={handleAttack}
                disabled={!isPlayerTurn || attackInProgress || !!battleResult}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                攻撃
              </button>
              
              <button
                onClick={handleSpecialAttack}
                disabled={!isPlayerTurn || attackInProgress || !specialAttackAvailable || !!battleResult}
                className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                特殊攻撃
              </button>
              
              <button
                onClick={handleDefend}
                disabled={!isPlayerTurn || attackInProgress || !!battleResult}
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                防御
              </button>
            </div>
          </div>
        </div>
        
        {/* Right side - Comments */}
        <div className="w-full md:w-1/3 border-t md:border-t-0 md:border-l border-gray-700 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {comments.map((comment, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg ${
                  comment.isSystem 
                    ? 'bg-gray-700 text-center' 
                    : 'bg-gray-800'
                }`}
              >
                {!comment.isSystem && (
                  <div className="font-bold mb-1">{comment.author}</div>
                )}
                <div className={comment.isSystem ? 'text-yellow-300 font-bold' : ''}>{comment.text}</div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-700 p-4">
            <input
              type="text"
              placeholder={!!battleResult || attackInProgress ? "コメント入力不可" : "コメントを入力..."}
              disabled={!!battleResult || attackInProgress}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim() !== '') {
                  addComment('とおる', (e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Character sheet modal */}
      {showCharacterSheet && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">キャラクター情報</h2>
            
            {currentCharacterSheet === 'player' && (
              <div>
                <div className="flex items-center mb-4">
                  <img src={player.icon} alt={player.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
                  <div>
                    <h3 className="text-xl font-bold">{player.name}</h3>
                    <p>HP: {player.maxHp}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p>攻撃力: {player.attackMin}～{player.attackMax}</p>
                  <p>特殊攻撃: {player.specialPower}</p>
                  <p>特性: 経営参謀としての分析力を活かした助言で相手の弱点を突く</p>
                </div>
              </div>
            )}
            
            {currentCharacterSheet === 'opponent2' && (
              <div>
                <div className="flex items-center mb-4">
                  <img src={opponent2.icon} alt={opponent2.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
                  <div>
                    <h3 className="text-xl font-bold">{opponent2.name}</h3>
                    <p>HP: {opponent2.maxHp}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p>攻撃力: {opponent2.attackMin}～{opponent2.attackMax}</p>
                  <p>特殊攻撃: {opponent2.specialPower}</p>
                  <p>特性: 陽気なキャラクターと無限のトークで相手を疲弊させる</p>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setShowCharacterSheet(false)}
              className="mt-6 w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-md"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
      
      {/* Battle results overlay */}
      {showResults && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center p-8 rounded-lg">
            <h2 className="text-4xl font-bold mb-4">
              {battleResult === 'victory' ? (
                <span className="text-green-500">勝利！</span>
              ) : (
                <span className="text-red-500">敗北...</span>
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
