
import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

// Attack comments for player
const playerAttackComments = [
  "漢たるもの、背中で語れ！！",
  "ぅぅぅぅぅぅおおぉぉおぉぉ！！！",
  "もうテキトーでいいや！！",
  "でもやっぱ本気で行くわ！！",
  "うーーーっす！！",
  "みんないつもありがとう！！",
  "基礎的コンテンツの大切さ！！",
  "面白さとわかりやすさを両立！！",
  "実は◯◯なんだよね！！",
  "ふざけてないよ、真剣だよ！！"
];

// Special attack comments for player
const playerSpecialComments = [
  "俺の人生は常にスペシャルウィーク！！",
  "全集中！！痛風の呼吸！！",
  "漢たるもの、背中で語れ！！！ぅぅぅぅううおおおおおお！！！！くらえ！円月殺法！！！"
];

// Attack comments for opponent2 (yuji)
const opponent2AttackComments = [
  "今日もいい天気ですねぇ",
  "ところでこの前ね、お孫さんが...",
  "わしらの若い頃はねぇ",
  "ゆうじさんに任せなさい！",
  "まぁまぁ、そう怒らないで",
  "昔話をしましょうかねぇ",
  "人生山あり谷ありですよ",
  "若い者には負けませんよ",
  "昔取った杵柄ってやつですよ"
];

export const useBattle2Logic = () => {
  const { 
    player, setPlayer,
    opponent2, setOpponent2,
    battleTimer,
    resetBattleTimer,
    startBattleTimer,
    pauseBattleTimer,
    comments, addComment, clearComments,
    specialAttackAvailable, setSpecialAttackAvailable,
    attackCount, setAttackCount,
    highballMode, setHighballMode,
    yujiSpecialMode, setYujiSpecialMode,
    showCharacterSheet, setShowCharacterSheet,
    currentCharacterSheet, setCurrentCharacterSheet,
    handleScreenTransition
  } = useApp();

  const navigate = useNavigate();
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isBattleStarted, setIsBattleStarted] = useState(false);
  const [transitionScheduled, setTransitionScheduled] = useState(false);
  const [isPlayerVictory, setIsPlayerVictory] = useState<boolean | null>(null);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);
  const [soundEffect, setSoundEffect] = useState<string | null>(null);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);

  // Sound effect URLs
  const attackSoundUrl = "https://soundcloud.com/davis-momoyama/kougeki/s-To2wEpGbOXX?in=davis-momoyama/sets/battlefm/s-NbrA67b7tx5";
  const specialSoundUrl = "https://soundcloud.com/davis-momoyama/kougeki2/s-wj0EefmlUAf?in=davis-momoyama/sets/battlefm/s-NbrA67b7tx5";
  const runAwaySoundUrl = "https://on-jin.com/sound/ag/s2e75332cc5/se/z/ta_ta_nigeru01.mp3";
  const highballSoundUrl = "https://taira-komori.jpn.org/sound/eating01/gulp_down_water1.mp3";
  const victorySoundUrl = "https://soundcloud.com/davis-momoyama/syouri/s-u6HAdaFT0Sb?in=davis-momoyama/sets/battlefm/s-NbrA67b7tx5";
  const defeatSoundUrl = "https://soundcloud.com/davis-momoyama/orehamou/s-q3IJA3aoBNH?in=davis-momoyama/sets/battlefm/s-NbrA67b7tx5";

  // Reset sound effect after playing
  useEffect(() => {
    if (soundEffect) {
      const timer = setTimeout(() => {
        setSoundEffect(null);
      }, 2000); // Clear sound effect after 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [soundEffect]);

  // Initialize battle when component mounts
  useEffect(() => {
    clearComments();
    resetBattleTimer();
    startBattleTimer();
    setIsBattleStarted(true);
    
    // Reset player and opponent stats
    setPlayer({
      ...player,
      currentHp: player.maxHp,
      attackMin: 15,
      attackMax: 30,
      specialPower: 50
    });
    
    setOpponent2({
      ...opponent2,
      currentHp: opponent2.maxHp
    });
    
    setAttackCount(0);
    setSpecialAttackAvailable(false);
    setHighballMode(false);
    setYujiSpecialMode(false);
    setTransitionScheduled(false);
    setIsPlayerVictory(null);
    setShowSkipButton(false);
    
    addComment("システム", "バトル開始！ ゆうじ＠陽気なおじさん！", true);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle opponent's turn
  useEffect(() => {
    if (!isPlayerTurn && isBattleStarted && !isBattleOver) {
      const opponentTimer = setTimeout(() => {
        if (yujiSpecialMode) {
          handleYujiSpecial();
        } else {
          handleOpponentAttack();
        }
      }, 1500);
      
      return () => clearTimeout(opponentTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayerTurn, isBattleStarted, isBattleOver, yujiSpecialMode]);

  // Check for battle over conditions
  useEffect(() => {
    if ((player.currentHp <= 0 || opponent2.currentHp <= 0) && !isBattleOver && !transitionScheduled) {
      setIsBattleOver(true);
      
      if (player.currentHp <= 0) {
        // Player lost
        setIsPlayerVictory(false);
        handleDefeat();
      } else if (opponent2.currentHp <= 0) {
        // Player won
        setIsPlayerVictory(true);
        handleVictory();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.currentHp, opponent2.currentHp]);

  // Show skip button after delay
  useEffect(() => {
    let skipButtonTimer: NodeJS.Timeout | null = null;
    
    if (isBattleOver && isPlayerVictory === true) {
      skipButtonTimer = setTimeout(() => {
        setShowSkipButton(true);
      }, 10000); // 10 seconds delay for victory
    } else if (isBattleOver && isPlayerVictory === false) {
      skipButtonTimer = setTimeout(() => {
        setShowSkipButton(true);
      }, 15000); // 15 seconds delay for defeat
    }
    
    return () => {
      if (skipButtonTimer) clearTimeout(skipButtonTimer);
    };
  }, [isBattleOver, isPlayerVictory]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [redirectTimer]);

  // Activate yuji special mode when HP falls below 20
  useEffect(() => {
    if (opponent2.currentHp <= 20 && !yujiSpecialMode && !isBattleOver) {
      setYujiSpecialMode(true);
      addComment("システム", "ゆうじがとくぎ「長話」を発動した", true);
    }
  }, [opponent2.currentHp, yujiSpecialMode, isBattleOver, addComment]);

  // Skip to the appropriate ending screen
  const handleSkip = () => {
    if (!isBattleOver) return;
    
    // Cancel any pending timers/transitions
    setTransitionScheduled(true);
    if (redirectTimer) {
      clearTimeout(redirectTimer);
      setRedirectTimer(null);
    }
    
    // Transition to the appropriate screen based on battle outcome
    if (isPlayerVictory === true) {
      console.log("Skipping to victory2 screen");
      handleScreenTransition('victory2');
      navigate('/victory2');
    } else if (isPlayerVictory === false) {
      console.log("Skipping to result2 screen");
      handleScreenTransition('result2');
      navigate('/result2');
    }
  };

  // Handle player attack
  const handlePlayerAttack = () => {
    if (isBattleOver || !isPlayerTurn) return;
    
    // Play attack sound
    setSoundEffect(attackSoundUrl);
    
    // Increase attack count for special attack
    const newAttackCount = attackCount + 1;
    setAttackCount(newAttackCount);
    
    // Enable special attack after 3 regular attacks
    if (newAttackCount >= 3 && !specialAttackAvailable) {
      setSpecialAttackAvailable(true);
    }
    
    // Get random attack comment
    const attackComment = playerAttackComments[Math.floor(Math.random() * playerAttackComments.length)];
    
    // Calculate damage
    let damage;
    
    if (highballMode) {
      // Special handling for highball mode
      addComment(player.name, "え？ちょっとまって、なに？なに？ちょっとまって？えっ？");
      addComment("システム", "何を言っているのか分からない。とおるは酔っぱらっているようだ。\nとおるは10のダメージを受けた", true);
      
      // Player damages himself
      setPlayer({
        ...player,
        currentHp: Math.max(0, player.currentHp - 10)
      });
      
      // Reset highball mode
      setHighballMode(false);
      
      // End player's turn
      setIsPlayerTurn(false);
      return;
    }
    
    // Normal attack damage calculation
    damage = Math.floor(Math.random() * (player.attackMax - player.attackMin + 1)) + player.attackMin;
    
    // Add attack comments
    addComment(player.name, attackComment);
    addComment("システム", `とおるの攻撃、ゆうじは${damage}のダメージを受けた`, true);
    
    // Apply damage to opponent
    setOpponent2({
      ...opponent2,
      currentHp: Math.max(0, opponent2.currentHp - damage)
    });
    
    // End player's turn
    setIsPlayerTurn(false);
  };

  // Handle player special attack
  const handlePlayerSpecial = () => {
    if (isBattleOver || !isPlayerTurn || !specialAttackAvailable) return;
    
    // Play special attack sound
    setSoundEffect(specialSoundUrl);
    
    // Get random special attack comment
    const specialComment = playerSpecialComments[Math.floor(Math.random() * playerSpecialComments.length)];
    
    // Calculate damage (30-50 range)
    let damage = Math.floor(Math.random() * 21) + 30; // 30-50 damage
    
    // Add attack comments
    addComment(player.name, specialComment);
    addComment("システム", `とおるのとくぎ！ゆうじは${damage}のダメージを受けた！`, true);
    
    // Apply damage to opponent
    setOpponent2({
      ...opponent2,
      currentHp: Math.max(0, opponent2.currentHp - damage)
    });
    
    // Reset special attack availability and count
    setSpecialAttackAvailable(false);
    setAttackCount(0);
    
    // End player's turn
    setIsPlayerTurn(false);
  };

  // Handle running away
  const handleRunAway = () => {
    if (isBattleOver || !isPlayerTurn) return;
    
    // Play run away sound
    setSoundEffect(runAwaySoundUrl);
    
    // Add escape comment
    addComment(player.name, "逃げよう...");
    addComment("システム", "とおるは逃げようとしたが、漢として本当に逃げていいのか、逃げた先にいったい何がある？ここで逃げたら俺は一生逃げ続ける。不毛でも立ち向かわなければならない。無駄だとしても、踏ん張らなければあかん時があるやろ！！と思いなおし、自分の頬を思いっきりビンタした。とおるは10のダメージを受けた。", true);
    
    // Player damages himself
    setPlayer({
      ...player,
      currentHp: Math.max(0, player.currentHp - 10)
    });
    
    // End player's turn
    setIsPlayerTurn(false);
  };

  // Handle drinking highball
  const handleHighball = () => {
    if (isBattleOver || !isPlayerTurn) return;
    
    // Play highball sound
    setSoundEffect(highballSoundUrl);
    
    // Check if player's HP is less than half
    if (player.currentHp < player.maxHp / 2) {
      // Full recovery when HP is low
      addComment(player.name, "ぐびぐび、うへぇ～、もう一杯お願いします。メガで。");
      addComment("システム", "一周まわって、とおるは力がみなぎってきた。\nとおるの体力は全回復した", true);
      
      // Restore player's HP
      setPlayer({
        ...player,
        currentHp: player.maxHp
      });
    } else {
      // Normal highball effect
      addComment(player.name, "ぐびぐび、うへぇ～、もう一杯お願いします。メガで。");
      
      // Random highball effect
      const highballEffects = [
        "とおるはハイボールを飲んだ、\nとおるはトイレが近くなった。\nとおるは10のダメージを受けた",
        "とおるはハイボールを飲んだ、\nとおるは眠くなってしまった。\nとおるは10のダメージを受けた",
        "とおるはハイボールを飲んだ、\nとおるは何を言っているのかわからなくなった\nとおるは10のダメージを受けた。"
      ];
      
      const effectIdx = Math.floor(Math.random() * highballEffects.length);
      addComment("システム", highballEffects[effectIdx], true);
      
      // Player damages himself
      setPlayer({
        ...player,
        currentHp: Math.max(0, player.currentHp - 10)
      });
      
      // Set highball mode if drinking made player confused
      if (effectIdx === 2) {
        setHighballMode(true);
      }
    }
    
    // End player's turn
    setIsPlayerTurn(false);
  };

  // Handle opponent's attack
  const handleOpponentAttack = () => {
    if (isBattleOver) return;
    
    // Get random attack comment
    const attackComment = opponent2AttackComments[Math.floor(Math.random() * opponent2AttackComments.length)];
    
    // Calculate damage
    const damage = Math.floor(Math.random() * (opponent2.attackMax - opponent2.attackMin + 1)) + opponent2.attackMin;
    
    // Add attack comments
    addComment(opponent2.name, attackComment);
    addComment("システム", `ゆうじの攻撃、とおるは${damage}のダメージを受けた`, true);
    
    // Apply damage to player
    setPlayer({
      ...player,
      currentHp: Math.max(0, player.currentHp - damage)
    });
    
    // Start player's turn
    setIsPlayerTurn(true);
  };

  // Handle yuji special attack
  const handleYujiSpecial = () => {
    if (isBattleOver) return;
    
    // Add heal comments
    addComment(opponent2.name, "ところでわしの息子がねぇ、先日ね、またね、それがね...");
    addComment("システム", "ゆうじの長い長い話が始まった、とおるの集中力が削がれる", true);
    addComment("システム", "ゆうじの体力が10回復した", true);
    
    // Heal opponent
    setOpponent2({
      ...opponent2,
      currentHp: Math.min(opponent2.maxHp, opponent2.currentHp + 10)
    });
    
    // Start player's turn
    setIsPlayerTurn(true);
  };

  // Handle victory
  const handleVictory = () => {
    // Mark that we've already scheduled a transition
    setTransitionScheduled(true);
    setBattleResult('victory');
    setSoundEffect(victorySoundUrl);
    pauseBattleTimer();
    
    // Add victory comments
    addComment("システム", "とおるが勝利した、ゆうじは世間話を諦めた", true);
    
    // Queue up the victory messages with delays
    setTimeout(() => {
      addComment("システム", "とおるは400の経験値を得た、とおるはレベルが上がった", true);
    }, 3000);
    
    setTimeout(() => {
      addComment("システム", "とおるは祝いの美酒に酔いしれた", true);
    }, 6000);
    
    setTimeout(() => {
      addComment("システム", "とおるは祝いの美酒の効果で痛風が悪化した、80のダメージ", true);
    }, 9000);
    
    // Final message and screen transition
    setTimeout(() => {
      addComment("システム", "ライブが終了しました", true);
      console.log("Scheduling victory transition in 20 seconds...");
      
      // Show skip button after 10 seconds
      setTimeout(() => {
        setShowSkipButton(true);
      }, 1000);
      
      // Set up a 20-second timer for automatic redirect
      const timer = setTimeout(() => {
        if (!transitionScheduled) {
          console.log("Executing automatic victory transition to victory2");
          handleScreenTransition('victory2');
          navigate('/victory2');
        }
      }, 20000); // 20 seconds automatic redirect
      
      setRedirectTimer(timer);
    }, 12000);
  };

  // Handle defeat - redirect to result2 screen
  const handleDefeat = () => {
    // Mark that we've already scheduled a transition
    setTransitionScheduled(true);
    setBattleResult('defeat');
    setSoundEffect(defeatSoundUrl);
    pauseBattleTimer();
    
    // Add defeat comments
    addComment("システム", "とおるが敗北した、ゆうじの話を最後まで聞くことになった", true);
    
    setTimeout(() => {
      addComment("システム", "とおるは4000の経験値を得た", true);
    }, 3000);
    
    setTimeout(() => {
      addComment("システム", "とおるは敗北からも学べる男だった", true);
    }, 6000);
    
    setTimeout(() => {
      addComment("システム", "とおるはレベルが上がった", true);
    }, 9000);
    
    setTimeout(() => {
      addComment("システム", "とおるは敗北の美酒に酔いしれた", true);
    }, 12000);
    
    // Final messages and screen transition
    setTimeout(() => {
      addComment("システム", "とおるは敗北の美酒の効果で痛風が悪化した、530000のダメージ", true);
      
      setTimeout(() => {
        addComment("システム", "ライブが終了しました", true);
        console.log("Scheduling defeat transition to result2 in 20 seconds...");
        
        // Show skip button after 15 seconds
        setTimeout(() => {
          setShowSkipButton(true);
        }, 1000);
        
        // Set up a 20-second timer for automatic redirect
        const timer = setTimeout(() => {
          if (!transitionScheduled) {
            console.log("Executing automatic defeat transition to result2");
            handleScreenTransition('result2');
            navigate('/result2');
          }
        }, 20000); // 20 seconds automatic redirect
        
        setRedirectTimer(timer);
      }, 3000);
    }, 15000);
  };

  // Handle character sheet display
  const handleCharacterClick = (character: 'player' | 'opponent2') => {
    setCurrentCharacterSheet(character === 'opponent2' ? 'opponent2' : 'player');
    setShowCharacterSheet(true);
  };

  return {
    player,
    opponent: opponent2,
    battleTimer,
    isBattleOver,
    isPlayerTurn,
    attackCount,
    yujiSpecialMode,
    specialAttackAvailable,
    highballMode,
    showCharacterSheet,
    currentCharacterSheet,
    comments,
    showSkipButton,
    soundEffect,
    battleResult,
    handlePlayerAttack,
    handlePlayerSpecial,
    handleRunAway,
    handleHighball,
    handleCharacterClick,
    setShowCharacterSheet,
    handleSkip
  };
};

export default useBattle2Logic;
