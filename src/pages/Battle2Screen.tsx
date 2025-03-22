
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import CommentArea from '@/components/CommentArea';
import CharacterSheet from '@/components/CharacterSheet';
import AudioPlayer from '@/components/AudioPlayer';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileContainer from '@/components/MobileContainer';
import { useIsMobile } from '@/hooks/use-mobile';

// Import the battle components
import CharacterPortraits from '@/components/battle/CharacterPortraits';
import GaugesDisplay from '@/components/battle/GaugesDisplay';
import BattleActions from '@/components/battle/BattleActions';
import CommentInput from '@/components/battle/CommentInput';
import PlayerInfo from '@/components/battle/PlayerInfo';

// Import audio constants
import { 
  BATTLE_BGM, 
  YUJI_SPECIAL_BGM, 
  VICTORY_BGM, 
  DEFEAT_BGM, 
  BUTTON_SOUND,
  ATTACK_SOUND,
  SPECIAL_SOUND,
  RUN_AWAY_SOUND,
  HIGHBALL_SOUND
} from '@/constants/audioUrls';

// Player attack comments for Yuji battle - 文字化け修正
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

// UPDATED: Yuji's special attack comments - 文字化け修正
const yujiSpecialComments = [
  "やまにいは僕の事いじめたいだけですよね、ひどいです",
  "じゅんさんも本当にひどいです",
  "ぜつぼうさんがコラボに上がった時、もう99人コラボやめようと思いました",
  "みんな僕をいじめたいだけだよね、別にいいけど",
  "もういいですよ、何を言われても今まで通りやるだけ",
  "やまにいの言葉よりしいたけ占いのが深いんだよね",
  "式場の利益よりもプランナーの地位向上のが大事なんです。それが分からない式場は全部だめですよ"
];

// Define the missing arrays - 文字化け修正
const yujiAttackComments = [
  "経営を成功させるには、本当に良いもの、良いリソース、良い人材を持つことが大事です",
  "経営の何がわからないのかわからないってのが経営なんですよぉ〜",
  "経営を上手くやるには、波長の合う人とやるのがいちばんですね〜",
  "売上を上げるには、まずは表に出て顔と名前を売るのが大事ですよ",
  "ビジネスを成長させるには友達の数を増やすことですね",
  "やまにーの言うことは難しすぎて、僕には理解できないんですよぉ〜",
  "経営は楽しくやるのが一番大事です",
  "すべての決断はコスパで判断するのがいいですよ",
  "成功するにはポジティブであることが大事です",
  "失敗しても気にしない、前向きな姿勢こそがビジネスの秘訣です"
];

// Define victory and defeat comment arrays
const victoryComments = [
  "とおるはゆうじの経営論を打ち砕いた！",
  "ゆうじはとおるの言葉を受け入れ、考えを改めることを決意した。",
  "「やまにぃ... 僕、これからは本当の意味で人の役に立てる経営者になります...」",
  "とおるはゆうじに勝利した！",
  "次の相手は...",
  "まだ見ぬ最後のボスが待ち受けている..."
];

const defeatComments = [
  "とおるはゆうじのポジティブさに負けてしまった...",
  "「やまにぃの言ってることが難しすぎるんですよぉ〜もっと簡単に言わないと伝わらないですよぉ〜」",
  "「僕は今まで通りやり続けますよ〜みんなが褒めてくれるから〜」",
  "とおるは敗北した...",
  "もう一度挑戦するか？"
];

const Battle2Screen: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { 
    player, 
    opponent2, 
    bgmEnabled, 
    toggleBgm,
    battleTimer,
    startBattleTimer,
    pauseBattleTimer,
    resetBattleTimer,
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
    handleScreenTransition,
    setPlayer
  } = useApp();
  
  // Battle state
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isBattleOver, setIsBattleOver] = useState(false);
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
  const [currentBgm, setCurrentBgm] = useState<string>(BATTLE_BGM);
  
  // Reset battle state on component mount and start timer with fresh timer value
  useEffect(() => {
    clearComments();
    
    setPlayer(prev => ({
      ...prev,
      currentHp: 100
    }));
    
    resetBattleTimer();
    
    setOpponentHp(opponent2.currentHp);
    setAttackCount(0);
    setSpecialAttackAvailable(false);
    setYujiSpecialMode(false);
    setYujiInSpecialMode(false);
    setSpecialModeTimer(0);
    setSpecialModeActive(false);
    setIsHighballConfused(false);
    setCurrentBgm(BATTLE_BGM);
    
    startBattleTimer();
    
    setTimeout(() => {
      addComment('システム', '第二戦！とおる VS ゆうじ＠陽気なおじさん', true);
      addComment('ゆうじ＠陽気なおじさん', 'どうも～陽気なおじさんでお馴染み、ゆうじです。今日はやまにぃに経営とは何かについて僕なりに指南していきますよ～！');
    }, 1000);
    
    return () => {
      pauseBattleTimer();
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, []);
  
  // Handle character sheet display
  const handleCharacterClick = (character: 'player' | 'opponent1' | 'opponent2') => {
    setCurrentCharacterSheet(character);
    setShowCharacterSheet(true);
  };
  
  // Check for Yuji's special mode activation
  useEffect(() => {
    if (opponentHp <= 20 && !yujiInSpecialMode && !isBattleOver && !specialModeActive) {
      activateYujiSpecialMode();
    }
  }, [opponentHp, yujiInSpecialMode, isBattleOver, specialModeActive]);
  
  // Manage Yuji's special mode timer and BGM
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (specialModeActive && !isBattleOver) {
      // Set special mode BGM
      setCurrentBgm(YUJI_SPECIAL_BGM);
      
      interval = setInterval(() => {
        setSpecialModeTimer(prev => {
          const newTime = prev + 1;
          if (newTime >= 40) {
            setSpecialModeActive(false);
            addComment('システム', 'ゆうじ確変モードが終了した', true);
            // Return to normal BGM after special mode ends
            setCurrentBgm(BATTLE_BGM);
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
  
  // Update BGM when battle result changes
  useEffect(() => {
    if (battleResult === 'victory') {
      setCurrentBgm(VICTORY_BGM);
    } else if (battleResult === 'defeat') {
      setCurrentBgm(DEFEAT_BGM);
    }
  }, [battleResult]);
  
  // Display skip button after battle is over with some delay
  useEffect(() => {
    let skipButtonTimer: NodeJS.Timeout | null = null;
    
    if (isBattleOver && battleResult === 'victory') {
      skipButtonTimer = setTimeout(() => {
        setShowSkipButton(true);
      }, 10000);
    } else if (isBattleOver && battleResult === 'defeat') {
      skipButtonTimer = setTimeout(() => {
        setShowSkipButton(true);
      }, 15000);
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
      pauseBattleTimer();
    };
  }, [redirectTimer, pauseBattleTimer]);
  
  // UPDATED: Activate Yuji's special mode
  const activateYujiSpecialMode = () => {
    setYujiInSpecialMode(true);
    setYujiSpecialMode(true);
    
    addComment('ゆうじ＠陽気なおじさん', 'もう一回デザフェス出るから、みんなお金で応援して！！お願い！！');
    
    setTimeout(() => {
      addComment('システム', 'ゆうじはクラウドファンディングを発動した', true);
      addComment('システム', 'ゆうじのHPゲージが満タンになった', true);
      
      addComment('システム', 'ゆうじは特性「のれんに腕押し」を発動した', true);
      setSpecialModeActive(true);
      
      setOpponentHp(opponent2.maxHp);
      
    }, 1000);
  };
  
  // Skip to the appropriate ending screen - MODIFIED
  const handleSkip = () => {
    if (!isBattleOver) return;
    
    if (redirectTimer) {
      clearTimeout(redirectTimer);
      setRedirectTimer(null);
    }
    
    pauseBattleTimer();
    
    // Play button sound
    setSoundEffect(BUTTON_SOUND);
    
    if (battleResult === 'victory') {
      handleScreenTransition('victory2');
      navigate('/victory2');
    } else if (battleResult === 'defeat') {
      handleScreenTransition('result2');
      navigate('/result2');
    }
  };
  
  // Player attack function - UPDATED to use global state directly and correct sound path
  const handlePlayerAttack = () => {
    if (!isPlayerTurn || attackInProgress || isBattleOver) return;
    
    setAttackInProgress(true);
    setSoundEffect(ATTACK_SOUND);
    
    if (isHighballConfused) {
      addComment('とおる＠経営参謀', 'え？ちょっとまって、なに？なに？ちょっとまって？えっ？');
      
      setTimeout(() => {
        addComment('システム', '何を言っているのか分からない。とおるは酔っぱらっているようだ。\nとおるは10のダメージを受けた', true);
        
        setPlayer(prev => ({
          ...prev,
          currentHp: Math.max(0, prev.currentHp - 10)
        }));
        
        setIsHighballConfused(false);
        
        if (player.currentHp - 10 <= 0) {
          handleDefeat();
        } else {
          setTimeout(() => {
            setIsPlayerTurn(false);
            setAttackInProgress(false);
            handleEnemyAttack();
          }, 1000);
        }
      }, 500);
      
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * playerAttackComments.length);
    const attackComment = playerAttackComments[randomIndex];
    addComment('とおる＠経営参謀', attackComment);
    
    const min = player.attackMin;
    const max = player.attackMax;
    const damage = Math.floor(Math.random() * (max - min + 1)) + min;
    
    setTimeout(() => {
      if (specialModeActive) {
        const randomChance = Math.floor(Math.random() * 3) + 1;
        
        if (randomChance <= 2) {
          setOpponentHp(Math.max(0, opponentHp - 5));
          addComment('システム', 'ゆうじはのれんに腕押しを発動した。とおるの言葉は響かない。ゆうじは5ダメージしか受けなかった。', true);
        } else {
          setOpponentHp(Math.max(0, opponentHp - damage));
          addComment('システム', `さすがのゆうじも耳が痛い！！${damage}のダメージを受けた`, true);
        }
      } else {
        setOpponentHp(Math.max(0, opponentHp - damage));
        addComment('システム', `とおるの言葉が突き刺さる！ ${damage}ポイントのダメージ！`, true);
      }
      
      const newAttackCount = attackCount + 1;
      setAttackCount(newAttackCount);
      if (newAttackCount >= 3) {
        setSpecialAttackAvailable(true);
      }
      
      if (opponentHp - damage <= 0 && !specialModeActive) {
        handleVictory();
      } else {
        setTimeout(() => {
          setIsPlayerTurn(false);
          setAttackInProgress(false);
          handleEnemyAttack();
        }, 1000);
      }
    }, 500);
  };
  
  // Player special attack - UPDATED to use global state directly and correct sound path
  const handlePlayerSpecial = () => {
    if (!isPlayerTurn || attackInProgress || !specialAttackAvailable || isBattleOver) return;
    
    setAttackInProgress(true);
    setSoundEffect(SPECIAL_SOUND);
    setSpecialAttackAvailable(false);
    setAttackCount(0);
    
    const randomIndex = Math.floor(Math.random() * playerSpecialComments.length);
    const specialComment = playerSpecialComments[randomIndex];
    addComment('とおる＠経営参謀', specialComment);
    
    const damage = specialModeActive ? 10 : player.specialPower;
    
    setTimeout(() => {
      if (specialModeActive) {
        setOpponentHp(Math.max(0, opponentHp - damage));
        addComment('システム', `とおるの必殺技が炸裂！ゆうじののれんに腕押しをわずかに通過した。 ${damage}ポイントのダメージ！`, true);
      } else {
        setOpponentHp(Math.max(0, opponentHp - damage));
        addComment('システム', `とおるの必殺技が炸裂！ ${damage}ポイントの大ダメージ！`, true);
      }
      
      if (opponentHp - damage <= 0) {
        handleVictory();
      } else {
        setTimeout(() => {
          setIsPlayerTurn(false);
          setAttackInProgress(false);
          handleEnemyAttack();
        }, 1000);
      }
    }, 500);
  };
  
  // UPDATED: Handle enemy attack to use global state directly
  const handleEnemyAttack = () => {
    if (isBattleOver) return;
    
    setAttackInProgress(true);
    
    if (specialModeActive) {
      setSoundEffect(SPECIAL_SOUND);
      
      const specialComment = yujiSpecialComments[Math.floor(Math.random() * yujiSpecialComments.length)];
      addComment('ゆうじ＠陽気なおじさん', specialComment);
      
      const min = opponent2.attackMin;
      const max = opponent2.attackMax;
      const damage = Math.floor(Math.random() * (max - min + 1)) + min;
      
      setTimeout(() => {
        setPlayer(prev => ({
          ...prev,
          currentHp: Math.max(0, prev.currentHp - damage)
        }));
        
        addComment('システム', `ゆうじの言葉が突き刺さる！ ${damage}ポイントのダメージ！`, true);
        
        if (player.currentHp - damage <= 0) {
          handleDefeat();
        } else {
          setTimeout(() => {
            setIsPlayerTurn(true);
            setAttackInProgress(false);
          }, 1000);
        }
      }, 500);
    } else if (opponentHp < opponent2.maxHp * 0.3 && !yujiInSpecialMode) {
      setTimeout(() => {
        setIsPlayerTurn(true);
        setAttackInProgress(false);
      }, 1000);
    } else {
      setSoundEffect(ATTACK_SOUND);
      
      const attackComment = yujiAttackComments[Math.floor(Math.random() * yujiAttackComments.length)];
      
      const min = opponent2.attackMin;
      const max = opponent2.attackMax;
      const damage = Math.floor(Math.random() * (max - min + 1)) + min;
      
      setTimeout(() => {
        setPlayer(prev => ({
          ...prev,
          currentHp: Math.max(0, prev.currentHp - damage)
        }));
        
        addComment('ゆうじ＠陽気なおじさん', attackComment);
        addComment('システム', `ゆうじの陽気なトークが突き刺さる！ ${damage}ポイントのダメージ！`, true);
        
        if (player.currentHp - damage <= 0) {
          handleDefeat();
        } else {
          setTimeout(() => {
            setIsPlayerTurn(true);
            setAttackInProgress(false);
          }, 1000);
        }
      }, 500);
    }
  };
  
  // Handle running away - UPDATED to use global state
  const handleRunAway = () => {
    if (!isPlayerTurn || attackInProgress || isBattleOver) return;
    
    setSoundEffect(RUN_AWAY_SOUND);
    addComment('とおる＠経営参謀', "逃げよう...");
    
    setTimeout(() => {
      addComment('システム', "とおるは逃げようとしたが、漢として本当に逃げていいのか、逃げた先にいったい何がある？ここで逃げたら俺は一生逃げ続ける。不毛でも立ち向かわなければならない。無駄だとしても、踏ん張らなければあかん時があるやろ！！と思いなおし、自分の頬を思いっきりビンタした。とおるは10のダメージを受けた。", true);
      
      setPlayer(prev => ({
        ...prev,
        currentHp: Math.max(0, prev.currentHp - 10)
      }));
      
      if (player.currentHp - 10 <= 0) {
        handleDefeat();
      } else {
        setTimeout(() => {
          setIsPlayerTurn(false);
          setAttackInProgress(false);
          handleEnemyAttack();
        }, 1000);
      }
    }, 500);
  };
  
  // Handle highball offer - UPDATED to use global state directly
  const handleHighball = () => {
    if (!isPlayerTurn || attackInProgress || isBattleOver) return;
    
    setSoundEffect(HIGHBALL_SOUND);
    addComment('とおる＠経営参謀', 'ぐびぐび、うへぇ～、もう一杯お願いします。メガで。');
    
    setTimeout(() => {
      if (player.currentHp < player.maxHp / 2) {
        addComment('システム', "一周まわって、とおるは力がみなぎってきた。\nとおるの体力は全回復した", true);
        
        setPlayer(prev => ({
          ...prev,
          currentHp: prev.maxHp
        }));
      } else {
        const highballEffects = [
          "とおるはハイボールを飲んだ、\nとおるはトイレが近くなった。\nとおるは10のダメージを受けた",
          "とおるはハイボールを飲んだ、\nとおるは眠くなってしまった。\nとおるは10のダメージを受けた",
          "とおるはハイボールを飲んだ、\nとおるは何を言っているのかわからなくなった\nとおるは10のダメージを受けた。"
        ];
        
        const effectIdx = Math.floor(Math.random() * highballEffects.length);
        addComment('システム', highballEffects[effectIdx], true);
        
        setPlayer(prev => ({
          ...prev,
          currentHp: Math.max(0, prev.currentHp - 10)
        }));
        
        if (effectIdx === 2) {
          setIsHighballConfused(true);
        }
        
        if (player.currentHp - 10 <= 0) {
          handleDefeat();
          return;
        }
      }
      
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
      }, index * 3000);
    });
  };
  
  // Display defeat comments sequentially
  const showDefeatComments = () => {
    defeatComments.forEach((comment, index) => {
      setTimeout(() => {
        addComment('システム', comment, true);
      }, index * 3000);
    });
  };
  
  // Handle victory with automatic redirection
  const handleVictory = () => {
    setIsBattleOver(true);
    setBattleResult('victory');
    setCurrentBgm(VICTORY_BGM);
    setSoundEffect(BUTTON_SOUND);
    showVictoryComments();
    
    // Log information for debugging
    console.log('Victory trigger: Setting sound effect to', VICTORY_BGM);
    console.log('Scheduling victory transition in 30 seconds...');
    
    const timer = setTimeout(() => {
      pauseBattleTimer();
      console.log('Executing automatic victory transition to victory2');
      handleScreenTransition('victory2');
      navigate('/victory2');
    }, 30000);
    
    setRedirectTimer(timer);
  };
  
  // Handle defeat
  const handleDefeat = () => {
    setIsBattleOver(true);
    setBattleResult('defeat');
    setCurrentBgm(DEFEAT_BGM);
    setSoundEffect(BUTTON_SOUND);
    showDefeatComments();
    
    // Log information for debugging
    console.log('Defeat trigger: Setting sound effect to', DEFEAT_BGM);
    console.log('Scheduling defeat transition in 30 seconds...');
    
    const timer = setTimeout(() => {
      pauseBattleTimer();
      console.log('Executing automatic defeat transition to result2');
      handleScreenTransition('result2');
      navigate('/result2');
    }, 30000);
    
    setRedirectTimer(timer);
  };
  
  // Check for battle end conditions - Updated to use global state values
  useEffect(() => {
    if (player.currentHp <= 0 && !isBattleOver) {
      handleDefeat();
    } else if (opponentHp <= 0 && !specialModeActive && !isBattleOver) {
      handleVictory();
    }
  }, [player.currentHp, opponentHp, specialModeActive, isBattleOver]);

  const formatTime = (seconds: number): string => {
    if (seconds > 6000) {
      return "99:99";
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const battleBackgroundGradient = 'linear-gradient(180deg, rgba(0, 153, 198, 1), rgba(12, 33, 133, 1))';

  return (
    <MobileContainer backgroundGradient={battleBackgroundGradient}>
      <div 
        className="flex flex-col h-full p-2 sm:p-4 text-white relative"
        style={{ 
          background: battleBackgroundGradient,
          fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Main BGM - Using currentBgm state to handle all BGM state changes */}
        <AudioPlayer 
          src={currentBgm}
          loop={battleResult === null}
          autoPlay={true}
          volume={0.7}
          id="battle2-bgm"
          key={`battle-bgm-${currentBgm}`} // Force remount when BGM changes
        />

        {/* Sound Effects - Using unique keys to ensure they always play */}
        {soundEffect && (
          <AudioPlayer 
            src={soundEffect} 
            loop={false} 
            autoPlay={true} 
            volume={0.7}
            id="battle2-effect"
            key={`battle-effect-${Date.now()}`} // Use unique key for each sound effect
            onEnded={() => setSoundEffect(null)}
          />
        )}
        
        <PlayerInfo 
          name="とおる＠経営参謀" 
          icon={player.icon}
          battleTimer={battleTimer}
          title="さよなら！陽気なおじさん！！"
        />
        
        <GaugesDisplay 
          player={player}
          opponent={{...opponent2, currentHp: opponentHp}}
          attackCount={attackCount}
          sosoHealMode={false}
        />
        
        <CharacterPortraits 
          player={player}
          opponent={{...opponent2, currentHp: opponentHp}}
          onCharacterClick={handleCharacterClick}
          sosoHealMode={false}
        />
        
        {specialModeActive && (
          <div className="absolute top-1/4 left-0 right-0 flex justify-center">
            <div className="animate-pulse text-yellow-300 text-xl font-bold bg-black/50 px-4 py-2 rounded-full">
              ゆうじ、クラファン中！！
            </div>
          </div>
        )}
        
        <div className="flex-1 mb-1 sm:mb-2 h-[20vh] sm:h-[25vh] overflow-hidden">
          <CommentArea comments={comments} />
        </div>
        
        <div className="mt-auto">
          <BattleActions 
            isPlayerTurn={isPlayerTurn}
            isBattleOver={isBattleOver}
            specialAttackAvailable={specialAttackAvailable}
            onAttack={handlePlayerAttack}
            onSpecial={handlePlayerSpecial}
            onRunAway={handleRunAway}
            onHighball={handleHighball}
          />
          
          <CommentInput />
        </div>
        
        {showSkipButton && (
          <Button
            onClick={handleSkip}
            className="absolute bottom-16 sm:bottom-20 right-3 sm:right-6 z-20 bg-blue-600 hover:bg-blue-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md animate-pulse flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            style={{ position: 'absolute' }}
          >
            <SkipForward size={isMobile ? 16 : 20} />
            スキップ
          </Button>
        )}
        
        <button
          onClick={toggleBgm}
          className="absolute top-3 sm:top-6 right-3 sm:right-6 z-20 bg-white/10 backdrop-blur-sm p-2 sm:p-3 rounded-full hover:bg-white/20 transition-colors"
        >
          {bgmEnabled ? 
            <Volume2 size={isMobile ? 20 : 24} color="white" /> : 
            <VolumeX size={isMobile ? 20 : 24} color="white" />
          }
        </button>
        
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

export default Battle2Screen;
