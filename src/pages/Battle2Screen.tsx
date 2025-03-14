
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Battle2Screen: React.FC = () => {
  const navigate = useNavigate();
  const { 
    player, 
    opponent2, 
    bgmEnabled, 
    toggleBgm,
    battleTimer,
    comments,
    attackCount,
    specialAttackAvailable, 
    yujiSpecialMode,
    showCharacterSheet,
    currentCharacterSheet,
    setShowCharacterSheet,
    setCurrentCharacterSheet,
    addComment,
    clearComments,
    setAttackCount,
    setSpecialAttackAvailable,
    setYujiSpecialMode
  } = useApp();
  
  // Battle state
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [playerHp, setPlayerHp] = useState(player.currentHp);
  const [opponentHp, setOpponentHp] = useState(opponent2.currentHp);
  const [attackInProgress, setAttackInProgress] = useState(false);
  const [soundEffect, setSoundEffect] = useState<string | null>(null);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);
  
  // Reset battle state on component mount
  useEffect(() => {
    clearComments();
    setPlayerHp(player.currentHp);
    setOpponentHp(opponent2.currentHp);
    setAttackCount(0);
    setSpecialAttackAvailable(false);
    
    // Initial system message
    setTimeout(() => {
      addComment('システム', '第二戦！とおる VS ゆうじ＠陽気なおじさん', true);
      addComment('ゆうじ', 'ようこそ！やまにぃのマネージャー面接へ！実践形式で早速やってみましょう！');
    }, 1000);
  }, []);
  
  // Handle character sheet display
  const handleCharacterClick = (character: 'player' | 'opponent1' | 'opponent2') => {
    setCurrentCharacterSheet(character);
    setShowCharacterSheet(true);
  };
  
  // Player attack function
  const handlePlayerAttack = () => {
    if (!isPlayerTurn || attackInProgress || isBattleOver) return;
    
    setAttackInProgress(true);
    setSoundEffect('/audios/attack.mp3');
    
    // Calculate damage
    const min = player.attackMin;
    const max = player.attackMax;
    const damage = Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Apply damage with delay for animation
    setTimeout(() => {
      setOpponentHp(prevHp => Math.max(0, prevHp - damage));
      
      // Update attack count for special meter
      setAttackCount(prevCount => prevCount + 1);
      if (attackCount + 1 >= 3) {
        setSpecialAttackAvailable(true);
      }
      
      // Add battle comments
      addComment('とおる', `経営参謀として的確な分析攻撃！ ${damage}ポイントのダメージ！`);
      
      // Check if opponent defeated
      if (opponentHp - damage <= 0) {
        handleVictory();
      } else {
        // Enemy turn
        setTimeout(() => {
          setIsPlayerTurn(false);
          setAttackInProgress(false);
          handleEnemyAttack();
        }, 1000);
      }
    }, 500);
  };
  
  // Player special attack
  const handlePlayerSpecial = () => {
    if (!isPlayerTurn || attackInProgress || !specialAttackAvailable || isBattleOver) return;
    
    setAttackInProgress(true);
    setSoundEffect('/audios/special.mp3');
    setSpecialAttackAvailable(false);
    setAttackCount(0);
    
    // Special attack damage
    const damage = player.specialPower;
    
    setTimeout(() => {
      setOpponentHp(prevHp => Math.max(0, prevHp - damage));
      
      // Add battle comments
      addComment('とおる', `特殊技『経営分析』発動！相手の弱点を突く！ ${damage}ポイントの大ダメージ！`);
      
      // Check if opponent defeated
      if (opponentHp - damage <= 0) {
        handleVictory();
      } else {
        // Enemy turn
        setTimeout(() => {
          setIsPlayerTurn(false);
          setAttackInProgress(false);
          handleEnemyAttack();
        }, 1000);
      }
    }, 500);
  };
  
  // Handle enemy attack
  const handleEnemyAttack = () => {
    if (isBattleOver) return;
    
    setAttackInProgress(true);
    
    // Special attack if HP is low
    if (opponentHp < opponent2.maxHp * 0.3 && !yujiSpecialMode) {
      setSoundEffect('/audios/enemy_special.mp3');
      setYujiSpecialMode(true);
      
      addComment('ゆうじ', '陽気なおじさんスペシャル！おじさんトークタイム！');
      
      setTimeout(() => {
        const damage = opponent2.specialPower;
        setPlayerHp(prevHp => Math.max(0, prevHp - damage));
        
        addComment('ゆうじ', '「私のウェディングプランナーとしての経験からいうと〜」');
        
        // Check if player defeated
        if (playerHp - damage <= 0) {
          handleDefeat();
        } else {
          // Player's turn
          setTimeout(() => {
            setIsPlayerTurn(true);
            setAttackInProgress(false);
          }, 1000);
        }
      }, 1500);
    } else {
      // Regular attack
      setSoundEffect('/audios/enemy_attack.mp3');
      
      // Calculate damage
      const min = opponent2.attackMin;
      const max = opponent2.attackMax;
      const damage = Math.floor(Math.random() * (max - min + 1)) + min;
      
      setTimeout(() => {
        setPlayerHp(prevHp => Math.max(0, prevHp - damage));
        
        addComment('ゆうじ', `陽気な営業トーク攻撃！ ${damage}ポイントのダメージ！`);
        
        // Check if player defeated
        if (playerHp - damage <= 0) {
          handleDefeat();
        } else {
          // Player's turn
          setTimeout(() => {
            setIsPlayerTurn(true);
            setAttackInProgress(false);
          }, 1000);
        }
      }, 500);
    }
  };
  
  // Handle running away
  const handleRunAway = () => {
    if (!isPlayerTurn || attackInProgress || isBattleOver) return;
    
    addComment('システム', 'とおるは逃げ出した！しかしゆうじのトークに囲まれて逃げられない！', true);
  };
  
  // Handle highball offer
  const handleHighball = () => {
    if (!isPlayerTurn || attackInProgress || isBattleOver) return;
    
    addComment('とおる', 'ハイボール飲みませんか？');
    addComment('ゆうじ', 'おっ！いいねぇ～。ハイボール大好き！');
    
    // Heal opponent slightly
    setTimeout(() => {
      const healAmount = 5;
      setOpponentHp(prev => Math.min(opponent2.maxHp, prev + healAmount));
      addComment('システム', `ゆうじのHPが${healAmount}回復した！陽気さが増した！`, true);
    }, 1000);
  };
  
  // Handle victory
  const handleVictory = () => {
    setIsBattleOver(true);
    setBattleResult('victory');
    addComment('システム', 'とおるの勝利！マネージャー面接に合格しました！', true);
    addComment('ゆうじ', 'おー！すごいすごい！やまにぃのマネージャーにピッタリだね！');
    
    // Navigate to ending
    setTimeout(() => {
      navigate('/endingA');
    }, 15000);
  };
  
  // Handle defeat
  const handleDefeat = () => {
    setIsBattleOver(true);
    setBattleResult('defeat');
    addComment('システム', 'とおるの敗北...マネージャー面接に落ちました...', true);
    addComment('ゆうじ', 'うーん、残念！もう少し接客スキルを磨こう！また挑戦してね！');
    
    // Navigate to ending
    setTimeout(() => {
      navigate('/endingB');
    }, 15000);
  };
  
  // Check for battle end conditions
  useEffect(() => {
    if (playerHp <= 0 && !isBattleOver) {
      handleDefeat();
    } else if (opponentHp <= 0 && !isBattleOver) {
      handleVictory();
    }
  }, [playerHp, opponentHp]);

  return (
    <div 
      className="min-h-screen flex flex-col h-screen p-4 text-white"
      style={{ 
        background: 'linear-gradient(180deg, rgba(0, 153, 198, 1), rgba(12, 33, 133, 1))',
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
      />
      
      {/* Health and special gauges */}
      <GaugesDisplay 
        player={{...player, currentHp: playerHp}}
        opponent={{...opponent2, currentHp: opponentHp}}
        attackCount={attackCount}
        sosoHealMode={false}
      />
      
      {/* Character portraits */}
      <CharacterPortraits 
        player={{...player, currentHp: playerHp}}
        opponent={{...opponent2, currentHp: opponentHp}}
        onCharacterClick={handleCharacterClick}
        sosoHealMode={false}
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
      
      {/* Battle results overlay */}
      {battleResult && (
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
