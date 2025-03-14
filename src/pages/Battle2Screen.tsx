
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
  const [yujiInSpecialMode, setYujiInSpecialMode] = useState(false);
  const [specialModeTimer, setSpecialModeTimer] = useState(0);
  const [specialModeActive, setSpecialModeActive] = useState(false);
  
  // Reset battle state on component mount
  useEffect(() => {
    clearComments();
    setPlayerHp(player.currentHp);
    setOpponentHp(opponent2.currentHp);
    setAttackCount(0);
    setSpecialAttackAvailable(false);
    setYujiSpecialMode(false);
    setYujiInSpecialMode(false);
    setSpecialModeTimer(0);
    setSpecialModeActive(false);
    
    // Initial system message
    setTimeout(() => {
      addComment('システム', '第二戦！とおる VS ゆうじ＠陽気なおじさん', true);
      addComment('ゆうじ', 'ようこそ！やまにぃのマネージャー面接へ！実践形式で早速やってみましょう！');
    }, 1000);
  }, []);
  
  // Yuji's attack comments
  const yujiAttackComments = [
    "しいたけ しか勝たん！！俺はしいたけ占いしか信じてないんすよ～",
    "年収1000万目指します、まじで",
    "「やればやるほど、楽しくなっていく」今まさにそんな状態！",
    "佐川の集荷呼ぶだけでこんなに難しいなんて・・・",
    "僕は常にかゆいところに手が届く存在でありたい",
    "2025年以降の目標を立てて、めっちゃワクワクした！",
    "今日の予定？タイミー"
  ];
  
  // Victory comments array
  const victoryComments = [
    "とおるが勝利した、ゆうじは拗ねてタムタムにLINEをした",
    "タムタムからの返事がない、ゆうじはリコさんにLINEをした",
    "リコさんからの返事がない",
    "ゆうじは殻に閉じこもってしまった",
    "その後、風のうわさでゆうじが米国大統領に当選したと聞いた",
    "とおるはゆうじを倒した。",
    "でも本当は、ゆうじを倒したくなかった。",
    "永遠にゆうじとの戯れをつづけたかった。",
    "だが、とおるはゆうじを倒してしまった。",
    "この戦いに勝利者はいない",
    "とおるは一人涙して、今日もハイボールを飲む、とおるの心に7兆のダメージ"
  ];
  
  // Defeat comments array
  const defeatComments = [
    "とおるが敗北した、ゆうじは調子にのってしまった",
    "とおるは5億の経験値を得た",
    "とおるは敗北からも学べる男だった",
    "とおるはレベルが7000上がった",
    "だが、ゆうじはどんどん悪い方向に成長した",
    "とおるは危機感を覚えた",
    "あの時俺が本気でぶん殴って目を覚まさせてやればこんなことには・・・",
    "とおるは悔やんだ、そしてハイボールを飲んだ",
    "夜空に輝く星の瞬きが、今日だけはいつもよりも多く感じた"
  ];
  
  // Handle character sheet display
  const handleCharacterClick = (character: 'player' | 'opponent1' | 'opponent2') => {
    setCurrentCharacterSheet(character);
    setShowCharacterSheet(true);
  };
  
  // Check for Yuji's special mode activation
  useEffect(() => {
    if (opponentHp <= 30 && !yujiInSpecialMode && !isBattleOver && !specialModeActive) {
      // Activate Yuji's special mode
      activateYujiSpecialMode();
    }
  }, [opponentHp, yujiInSpecialMode, isBattleOver, specialModeActive]);
  
  // Manage Yuji's special mode timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (specialModeActive && !isBattleOver) {
      interval = setInterval(() => {
        setSpecialModeTimer(prev => {
          const newTime = prev + 1;
          if (newTime >= 40) {
            // End special mode after 40 seconds
            setSpecialModeActive(false);
            addComment('システム', 'ゆうじ確変モードが終了した', true);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [specialModeActive, isBattleOver]);
  
  // Activate Yuji's special mode
  const activateYujiSpecialMode = () => {
    setYujiInSpecialMode(true);
    setYujiSpecialMode(true);
    
    addComment('ゆうじ', 'もう一回デザフェス出るから、みんなお金で応援して！！お願い！！');
    
    setTimeout(() => {
      addComment('システム', 'ゆうじはクラウドファンディングを発動した', true);
      addComment('システム', 'ゆうじのHPゲージが満タンになった', true);
      
      // Restore Yuji's HP
      setOpponentHp(opponent2.maxHp);
      
      setTimeout(() => {
        addComment('システム', 'ゆうじ確変モードに突入', true);
        addComment('システム', 'ゆうじは特性「のれんに腕押し」を発動した', true);
        setSpecialModeActive(true);
      }, 1000);
    }, 1000);
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
      // Check if Yuji is in special mode
      if (specialModeActive) {
        addComment('システム', 'ゆうじはのれんに腕押しを発動した。とおるの言葉は響かない。ゆうじは0ダメージを受けた。', true);
      } else {
        setOpponentHp(Math.max(0, opponentHp - damage));
        addComment('とおる', `経営参謀として的確な分析攻撃！ ${damage}ポイントのダメージ！`);
      }
      
      // Update attack count for special meter
      const newAttackCount = attackCount + 1;
      setAttackCount(newAttackCount);
      if (newAttackCount >= 3) {
        setSpecialAttackAvailable(true);
      }
      
      // Check if opponent defeated
      if (opponentHp - damage <= 0 && !specialModeActive) {
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
      // Check if Yuji is in special mode
      if (specialModeActive) {
        addComment('システム', 'ゆうじはのれんに腕押しを発動した。とおるの言葉は響かない。ゆうじは0ダメージを受けた。', true);
      } else {
        setOpponentHp(Math.max(0, opponentHp - damage));
        addComment('とおる', `特殊技『経営分析』発動！相手の弱点を突く！ ${damage}ポイントの大ダメージ！`);
      }
      
      // Check if opponent defeated
      if (opponentHp - damage <= 0 && !specialModeActive) {
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
    
    // Special attack if in special mode
    if (specialModeActive) {
      setSoundEffect('/audios/enemy_special.mp3');
      
      // Get random attack comment
      const attackComment = yujiAttackComments[Math.floor(Math.random() * yujiAttackComments.length)];
      addComment('ゆうじ', attackComment);
      
      // Calculate special mode damage (higher)
      const damage = Math.floor(Math.random() * (opponent2.attackMax + 10 - opponent2.attackMin) + opponent2.attackMin);
      
      setTimeout(() => {
        setPlayerHp(Math.max(0, playerHp - damage));
        
        addComment('システム', `確変モード中！ゆうじの言葉が突き刺さる！ ${damage}ポイントの大ダメージ！`, true);
        
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
    } else if (opponentHp < opponent2.maxHp * 0.3 && !yujiInSpecialMode) {
      // This would be for first activation, but we already handle it in useEffect
      // Keeping this condition branch for clarity
      setTimeout(() => {
        setIsPlayerTurn(true);
        setAttackInProgress(false);
      }, 1000);
    } else {
      // Regular attack
      setSoundEffect('/audios/enemy_attack.mp3');
      
      // Get random attack comment
      const attackComment = yujiAttackComments[Math.floor(Math.random() * yujiAttackComments.length)];
      
      // Calculate damage
      const min = opponent2.attackMin;
      const max = opponent2.attackMax;
      const damage = Math.floor(Math.random() * (max - min + 1)) + min;
      
      setTimeout(() => {
        setPlayerHp(Math.max(0, playerHp - damage));
        
        addComment('ゆうじ', attackComment);
        addComment('システム', `ゆうじの陽気なトークが突き刺さる！ ${damage}ポイントのダメージ！`, true);
        
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
      setOpponentHp(Math.min(opponent2.maxHp, opponentHp + healAmount));
      addComment('システム', `ゆうじのHPが${healAmount}回復した！陽気さが増した！`, true);
    }, 1000);
  };
  
  // Display victory comments sequentially
  const showVictoryComments = () => {
    victoryComments.forEach((comment, index) => {
      setTimeout(() => {
        addComment('システム', comment, true);
        
        // After all comments are shown, transition to ending
        if (index === victoryComments.length - 1) {
          setTimeout(() => {
            navigate('/endingA');
          }, 3000);
        }
      }, index * 3000); // Show each comment with a 3-second delay
    });
  };
  
  // Display defeat comments sequentially
  const showDefeatComments = () => {
    defeatComments.forEach((comment, index) => {
      setTimeout(() => {
        addComment('システム', comment, true);
        
        // After all comments are shown, transition to ending
        if (index === defeatComments.length - 1) {
          setTimeout(() => {
            navigate('/endingC');
          }, 3000);
        }
      }, index * 3000); // Show each comment with a 3-second delay
    });
  };
  
  // Handle victory
  const handleVictory = () => {
    setIsBattleOver(true);
    setBattleResult('victory');
    setSoundEffect('/audios/syouri.mp3');
    showVictoryComments();
  };
  
  // Handle defeat
  const handleDefeat = () => {
    setIsBattleOver(true);
    setBattleResult('defeat');
    setSoundEffect('/audios/orehamou.mp3');
    showDefeatComments();
  };
  
  // Check for battle end conditions
  useEffect(() => {
    if (playerHp <= 0 && !isBattleOver) {
      handleDefeat();
    } else if (opponentHp <= 0 && !specialModeActive && !isBattleOver) {
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
      
      {/* Yuji special mode indicator - Updated text here */}
      {specialModeActive && (
        <div className="absolute top-1/4 left-0 right-0 flex justify-center">
          <div className="animate-pulse text-yellow-300 text-xl font-bold bg-black/50 px-4 py-2 rounded-full">
            ゆうじ、クラファン中！！
          </div>
        </div>
      )}
      
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
