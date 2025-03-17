import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import CommentArea from '@/components/CommentArea';
import CharacterSheet from '@/components/CharacterSheet';
import AudioPlayer from '@/components/AudioPlayer';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import the battle components
import PlayerInfo from '@/components/battle/PlayerInfo';
import CharacterPortraits from '@/components/battle/CharacterPortraits';
import GaugesDisplay from '@/components/battle/GaugesDisplay';
import BattleActions from '@/components/battle/BattleActions';
import CommentInput from '@/components/battle/CommentInput';

// Player attack comments for Yuji battle
const playerAttackComments = [
  "ゆうじは人の相談にのってはいけない人間だと確信している",
  "正論を言われた時に、拗ねて逃げていては成長に繋がらないだろ",
  "もっと漢として、大地に根を張って、自信をもって堂々としろ！",
  "自分に反抗しない人を探して、適当にアドバイスをするのは相手の方に失礼だ！",
  "タムタムやリコさんに逃げるな！！",
  "ゆうじはじゅんさんにちゃんと謝罪すべきですね",
  "クラファンとかやる前に、自分の強みと弱みを理解して、サービスの解像度を上げなさい",
  "テクノロジーで急速に変化する世界の中で、この先何が自分の優位性になるのか考えろ",
  "妄想でストーリーを作らず、根拠に基づいたデータに沿ってもう一度考え直せ！",
  "それっぽいものを作ってもダメだ、目の前の相手をしっかり見ろ"
];

// Player special attack comments for Yuji battle
const playerSpecialComments = [
  "パッションは大事だ、でもパッションだけじゃ薄っぺらい詐欺師と何も変わらないだろ！ゆうじが守りたいものを思い出して、正面からぶつかっていけ！骨は俺が拾う！！",
  "俺達はゆうじが大好きだからいろいろ言うんだ、耳が痛い事もあるだろう、だが逃げるな！何があってもお前の骨は俺が拾う！！！",
  "自らアドバイスを求めたなら、その相手には進捗の報告を怠るな！！俺達はいい、友達だから報告が無くても\"ゆうじは最低だ！！\"で済ませて、その後も仲良く出来る。だが、他の人は違う、一度不義理をしたら一生相手にされないし、下手したら敵になって戻ってくる。良く考えて行動し、軽はずみで他人を使い捨てにするな！！"
];

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
    setYujiSpecialMode,
    handleScreenTransition
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
  const [isHighballConfused, setIsHighballConfused] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);
  
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
    setIsHighballConfused(false);
    
    // Initial system message
    setTimeout(() => {
      addComment('システム', '第二戦！とおる VS ゆうじ＠陽気なおじさん', true);
      addComment('ゆうじ＠陽気なおじさん', 'どうも～陽気なおじさんでお馴染み、ゆうじです。今日はやまにぃに経営とは何かについて僕なりに指南していきますよ～！');
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
    if (opponentHp <= 20 && !yujiInSpecialMode && !isBattleOver && !specialModeActive) {
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
  
  // Display skip button after battle is over with some delay
  useEffect(() => {
    let skipButtonTimer: NodeJS.Timeout | null = null;
    
    if (isBattleOver && battleResult === 'victory') {
      skipButtonTimer = setTimeout(() => {
        setShowSkipButton(true);
      }, 10000); // 10 seconds for victory
    } else if (isBattleOver && battleResult === 'defeat') {
      skipButtonTimer = setTimeout(() => {
        setShowSkipButton(true);
      }, 15000); // 15 seconds for defeat
    }
    
    return () => {
      if (skipButtonTimer) clearTimeout(skipButtonTimer);
    };
  }, [isBattleOver, battleResult]);

  // Clean up redirect timer on component unmount
  useEffect(() => {
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [redirectTimer]);
  
  // Activate Yuji's special mode
  const activateYujiSpecialMode = () => {
    setYujiInSpecialMode(true);
    setYujiSpecialMode(true);
    
    addComment('ゆうじ＠陽気なおじさん', 'もう一回デザフェス出るから、みんなお金で応援して！！お願い！！');
    
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
  
  // Skip to the appropriate ending screen
  const handleSkip = () => {
    if (!isBattleOver) return;
    
    // Cancel any pending timers
    if (redirectTimer) {
      clearTimeout(redirectTimer);
      setRedirectTimer(null);
    }
    
    if (battleResult === 'victory') {
      handleScreenTransition('victory2');
      navigate('/victory2');
    } else if (battleResult === 'defeat') {
      // Update to redirect to endingC instead of victory2 on defeat
      handleScreenTransition('endingC');
      navigate('/endingC');
    }
  };
  
  // Player attack function
  const handlePlayerAttack = () => {
    if (!isPlayerTurn || attackInProgress || isBattleOver) return;
    
    setAttackInProgress(true);
    setSoundEffect('/audios/attack.mp3');
    
    // Handle highball confusion first if active
    if (isHighballConfused) {
      addComment('とおる＠経営参謀', 'え？ちょっとまって、なに？なに？ちょっとまって？えっ？');
      
      setTimeout(() => {
        addComment('システム', '何を言っているのか分からない。とおるは酔っぱらっているようだ。\nとおるは10のダメージを受けた', true);
        
        // Player damages himself
        setPlayerHp(Math.max(0, playerHp - 10));
        setIsHighballConfused(false);
        
        // Check if player defeated himself
        if (playerHp - 10 <= 0) {
          handleDefeat();
        } else {
          // Enemy turn
          setTimeout(() => {
            setIsPlayerTurn(false);
            setAttackInProgress(false);
            handleEnemyAttack();
          }, 1000);
        }
      }, 500);
      
      return;
    }
    
    // Get random attack comment
    const randomIndex = Math.floor(Math.random() * playerAttackComments.length);
    const attackComment = playerAttackComments[randomIndex];
    addComment('とおる＠経営参謀', attackComment);
    
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
        addComment('システム', `とおるの言葉が突き刺さる！ ${damage}ポイントのダメージ！`, true);
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
    
    // Get random special attack comment
    const randomIndex = Math.floor(Math.random() * playerSpecialComments.length);
    const specialComment = playerSpecialComments[randomIndex];
    addComment('とおる＠経営参謀', specialComment);
    
    // Special attack damage
    const damage = player.specialPower;
    
    setTimeout(() => {
      // Check if Yuji is in special mode
      if (specialModeActive) {
        addComment('システム', 'ゆうじはのれんに腕押しを発動した。とおるの言葉は響かない。ゆうじは0ダメージを受けた。', true);
      } else {
        setOpponentHp(Math.max(0, opponentHp - damage));
        addComment('システム', `とおるの必殺技が炸裂！ ${damage}ポイントの大ダメージ！`, true);
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
      addComment('ゆうじ＠陽気なおじさん', attackComment);
      
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
        
        addComment('ゆうじ＠陽気なおじさん', attackComment);
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
    
    addComment('とおる＠経営参謀', "逃げよう...");
    
    setTimeout(() => {
      addComment('システム', "とおるは逃げようとしたが、漢として本当に逃げていいのか、逃げた先にいったい何がある？ここで逃げたら俺は一生逃げ続ける。不毛でも立ち向かわなければならない。無駄だとしても、踏ん張らなければあかん時があるやろ！！と思いなおし、自分の頬を思いっきりビンタした。とおるは10のダメージを受けた。", true);
      
      // Player damages himself
      setPlayerHp(Math.max(0, playerHp - 10));
      
      // Check if player defeated himself
      if (playerHp - 10 <= 0) {
        handleDefeat();
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
  
  // Handle highball offer
  const handleHighball = () => {
    if (!isPlayerTurn || attackInProgress || isBattleOver) return;
    
    addComment('とおる＠経営参謀', 'ぐびぐび、うへぇ～、もう一杯お願いします。メガで。');
    
    setTimeout(() => {
      // Check if player's HP is less than half
      if (playerHp < player.maxHp / 2) {
        // Full recovery when HP is low
        addComment('システム', "一周まわって、とおるは力がみなぎってきた。\nとおるの体力は全回復した", true);
        
        // Restore player's HP
        setPlayerHp(player.maxHp);
      } else {
        // Normal highball effect
        // Random highball effect
        const highballEffects = [
          "とおるはハイボールを飲んだ、\nとおるはトイレが近くなった。\nとおるは10のダメージを受けた",
          "とおるはハイボールを飲んだ、\nとおるは眠くなってしまった。\nとおるは10のダメージを受けた",
          "とおるはハイボールを飲んだ、\nとおるは何を言っているのかわからなくなった\nとおるは10のダメージを受けた。"
        ];
        
        const effectIdx = Math.floor(Math.random() * highballEffects.length);
        addComment('システム', highballEffects[effectIdx], true);
        
        // Player damages himself
        setPlayerHp(Math.max(0, playerHp - 10));
        
        // Set highball confusion if drinking made player confused
        if (effectIdx === 2) {
          setIsHighballConfused(true);
        }
        
        // Check if player defeated himself
        if (playerHp - 10 <= 0) {
          handleDefeat();
          return;
        }
      }
      
      // End player's turn
      setTimeout(() => {
        setIsPlayerTurn(false);
        setAttackInProgress(false);
        handleEnemyAttack();
      }, 1000);
    }, 500);
  };
  
  // Display victory comments sequentially
  const showVictoryComments = () => {
    victoryComments.forEach((comment, index) => {
      setTimeout(() => {
        addComment('システム', comment, true);
      }, index * 3000); // Show each comment with a 3-second delay
    });
  };
  
  // Display defeat comments sequentially
  const showDefeatComments = () => {
    defeatComments.forEach((comment, index) => {
      setTimeout(() => {
        addComment('システム', comment, true);
      }, index * 3000); // Show each comment with a 3-second delay
    });
  };
  
  // Handle victory with automatic redirection
  const handleVictory = () => {
    setIsBattleOver(true);
    setBattleResult('victory');
    setSoundEffect('/audios/syouri.mp3');
    showVictoryComments();
    
    // Set up automatic redirection after 20 seconds
    const timer = setTimeout(() => {
      handleScreenTransition('victory2');
      navigate('/victory2');
    }, 20000);
    
    setRedirectTimer(timer);
  };
  
  // Handle defeat with automatic redirection to endingC
  const handleDefeat = () => {
    setIsBattleOver(true);
    setBattleResult('defeat');
    setSoundEffect('/audios/orehamou.mp3');
    showDefeatComments();
    
    // Set up automatic redirection after 20 seconds
    const timer = setTimeout(() => {
      handleScreenTransition('endingC');
      navigate('/endingC');
    }, 20000);
    
    setRedirectTimer(timer);
  };
  
  // Check for battle end conditions
  useEffect(() => {
    if (playerHp <= 0 && !isBattleOver) {
      handleDefeat();
    } else if (opponentHp <= 0 && !specialModeActive && !isBattleOver) {
      handleVictory();
    }
  }, [playerHp, opponentHp]);

  // Format battle time as minutes:seconds
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="min-h-screen flex flex-col h-screen p-4 text-white relative"
      style={{ 
        background: 'linear-gradient(180deg, rgba(0, 153, 198, 1), rgba(12, 33, 133, 1))',
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
      
      {/* Skip Button - Only shown when battle is over */}
      {showSkipButton && (
        <Button
          onClick={handleSkip}
          className="fixed bottom-20 right-6 z-20 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md animate-pulse flex items-center gap-2"
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
      
      {/* Audio Player */}
      {soundEffect && <AudioPlayer src={soundEffect} />}
    </div>
  );
};

export default Battle2Screen;
