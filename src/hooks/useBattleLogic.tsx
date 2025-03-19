import { useState, useEffect } from 'react';
import { useApp, Character } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

// Attack comments for player
const playerAttackComments = [
  "さよならワンマン経営！",
  "経営チームを作るんだ！",
  "基礎的人間能力が大事だ！",
  "短期より中長期の持続可能性！",
  "光あれば影あり…だが攻める！",
  "とりあえず寝ないことを決めた",
  "３億円の個人保証にハンコを押して腹をくくった",
  "変化を受け入れる企業と個人にコミットします",
  "経営者の人生観を大切にし、社員さんの一人一人の価値観やポテンシャルも大切にする",
  "自分の考えもしっかりと持った強い通訳者として経営者と社員の間に入る",
  "最小エネルギーで最大効果を狙える戦略を好む",
  "短期利益だけじゃなく中長期的な視点で永続的な利益を重視する",
  "お金だけでなく人の心を大切にする",
  "基本笑顔で優しく、安全安心な場を大切にするが、時には厳しくもあり",
  "ロジックと感覚（お客さんの感覚）の両方を同じくらい大切にする",
  "これからの時代は基礎的人間能力と基礎的ビジネス能力を伸ばす時代",
  "スペシャリストになるな、ジェネラリストを目指せ！！"
];

// Special attack comments for player
const playerSpecialComments = [
  "自分の想いの赴くままに目の前の事を全力で楽しんでたらこんな変態になりました",
  "ファンキーな世の中になっても生きていける基礎的人間能力と基礎的仕事能力を手に入れよう",
  "漢たるもの、背中で語れ！！！ぅぅぅぅううおおおおおお！！！！くらえ！円月殺法！！！"
];

// Attack comments for opponent1 (soso)
const opponent1AttackComments = [
  "消費税一律30%とかにすれば全て解決する",
  "マジでこいつのフォロワヤバイ奴しかおらんな",
  "国民皆保険ごとなくせよバカやろう💢",
  "貧乏な移民を追い出し、金持ちにビザを買わせる",
  "真面目に働いていれば万作にはならない",
  "なかなか一つにまとまらない経済学者がほぼ全員反対するもの: 軽減税率",
  "老人が全て〇ねば全部解決するのに",
  "そろそろ米国株開いたかな？",
  "上原には本当にいいご飯屋さんが多くて嬉しい"
];

// NEW: Soso's special attack (collaboration) comments
const sosoCollaborationComments = [
  "やまねさんの言ってる事は本当にその通りで、だからこそ老人を日本から排除しないといけないと思うんですよ",
  "らむださん、どう思います？今ねてました？",
  "山根さんあんな事言ってるけどことことだったらどうする？",
  "ごもっともですけど、60代以上の医療費は一回2億支払わないと受けれないようにしてもいいと思うんですよ"
];

export const useBattleLogic = () => {
  const { 
    player, setPlayer,
    opponent1, setOpponent1,
    battleTimer,
    resetBattleTimer,
    startBattleTimer,
    comments, addComment, clearComments,
    specialAttackAvailable, setSpecialAttackAvailable,
    attackCount, setAttackCount,
    highballMode, setHighballMode,
    sosoHealMode, setSosoHealMode,
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
  
  // NEW: Flag to track if the special skill message has been displayed
  const [specialSkillMessageDisplayed, setSpecialSkillMessageDisplayed] = useState(false);

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
      attackMin: 15,  // Set attack min to 15
      attackMax: 30,  // Set attack max to 30
      specialPower: 50 // Special attack power to 30-50
    });
    
    setOpponent1({
      ...opponent1,
      currentHp: opponent1.maxHp
    });
    
    setAttackCount(0);
    setSpecialAttackAvailable(false);
    setHighballMode(false);
    setSosoHealMode(false);
    setTransitionScheduled(false);
    setIsPlayerVictory(null);
    setShowSkipButton(false);
    setSpecialSkillMessageDisplayed(false); // Reset special skill message flag
    
    addComment("システム", "バトル開始！ さよならクソリプそーそー！", true);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle opponent's turn
  useEffect(() => {
    if (!isPlayerTurn && isBattleStarted && !isBattleOver) {
      const opponentTimer = setTimeout(() => {
        if (sosoHealMode) {
          handleSosoHeal();
        } else {
          handleOpponentAttack();
        }
      }, 1500);
      
      return () => clearTimeout(opponentTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayerTurn, isBattleStarted, isBattleOver, sosoHealMode]);

  // Check for battle over conditions
  useEffect(() => {
    if ((player.currentHp <= 0 || opponent1.currentHp <= 0) && !isBattleOver && !transitionScheduled) {
      setIsBattleOver(true);
      
      if (player.currentHp <= 0) {
        // Player lost
        setIsPlayerVictory(false);
        handleDefeat();
      } else if (opponent1.currentHp <= 0) {
        // Player won
        setIsPlayerVictory(true);
        handleVictory();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.currentHp, opponent1.currentHp]);

  // UPDATED: Activate soso heal mode when HP falls below 30 (changed from 20) and display special skill message once
  useEffect(() => {
    if (opponent1.currentHp <= 30 && !sosoHealMode && !isBattleOver && !specialSkillMessageDisplayed) {
      setSosoHealMode(true);
      setSpecialSkillMessageDisplayed(true); // Mark that we've displayed the special skill message
      
      // Display the skill activation message sequence
      addComment("システム", "そーそーがとくぎ「強制コラボ召喚」を発動した", true);
      
      // To ensure messages display in order with some delay
      setTimeout(() => {
        addComment(opponent1.name, "あー、生きるのってむずかしいんだよなー、株クラのみんなも上がろうよ", false);
      }, 1000);
      
      setTimeout(() => {
        addComment("システム", "ラムダがコラボに参加した、松嶋ことがコラボに参加した", true);
      }, 2000);
    }
  }, [opponent1.currentHp, sosoHealMode, isBattleOver, specialSkillMessageDisplayed, addComment, opponent1.name]);

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
      console.log("Skipping to victory1 screen");
      handleScreenTransition('victory1');
      navigate('/victory1');
    } else if (isPlayerVictory === false) {
      console.log("Skipping to result1 screen");
      handleScreenTransition('result1');
      navigate('/result1');
    }
  };

  // Handle player attack - damage range 15-30
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
    
    // Normal attack damage calculation - 15 to 30 damage
    damage = Math.floor(Math.random() * (player.attackMax - player.attackMin + 1)) + player.attackMin;
    
    // Add attack comments
    addComment(player.name, attackComment);
    addComment("システム", `とおるの攻撃、そーそ��は${damage}のダメージを受けた`, true);
    
    // Apply damage to opponent
    setOpponent1({
      ...opponent1,
      currentHp: Math.max(0, opponent1.currentHp - damage)
    });
    
    // End player's turn
    setIsPlayerTurn(false);
  };

  // Handle player special attack - 30 to 50 damage
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
    addComment("システム", `とおるのとくぎ！そーそーは${damage}のダメージを受けた！`, true);
    
    // Apply damage to opponent
    setOpponent1({
      ...opponent1,
      currentHp: Math.max(0, opponent1.currentHp - damage)
    });
    
    // Reset special attack availability and count
    setSpecialAttackAvailable(false);
    setAttackCount(0);
    
    // End player's turn
    setIsPlayerTurn(false);
  };

  // Handle running away - updated with new comment
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

  // Handle drinking highball - updated with proper HP check and state handling
  const handleHighball = () => {
    if (isBattleOver || !isPlayerTurn) return;
    
    // Play highball sound
    setSoundEffect(highballSoundUrl);
    
    // Check if player's HP is less than half
    if (player.currentHp < player.maxHp / 2) {
      // Full recovery when HP is low
      addComment(player.name, "ぐびぐび、うへぇ～、もう一杯お願いします。メガで。");
      addComment("システム", "一周まわって、とおるは力がみなぎってきた。\nとおるの体力は全回復した", true);
      
      // Restore player's HP with proper state update
      const newHp = player.maxHp;
      setPlayer({
        ...player,
        currentHp: newHp
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
      
      // Player damages himself with proper state update
      const newHp = Math.max(0, player.currentHp - 10);
      setPlayer({
        ...player,
        currentHp: newHp
      });
      
      // Set highball mode if drinking made player confused
      if (effectIdx === 2) {
        setHighballMode(true);
      }
      
      // Check for defeat using the new HP value
      if (newHp <= 0) {
        handleDefeat();
        return;
      }
    }
    
    // End player's turn
    setIsPlayerTurn(false);
  };

  // Handle opponent's attack
  const handleOpponentAttack = () => {
    if (isBattleOver) return;
    
    // Get random attack comment
    const attackComment = opponent1AttackComments[Math.floor(Math.random() * opponent1AttackComments.length)];
    
    // Calculate damage
    const damage = Math.floor(Math.random() * (opponent1.attackMax - opponent1.attackMin + 1)) + opponent1.attackMin;
    
    // Add attack comments
    addComment(opponent1.name, attackComment);
    addComment("システム", `そーそーの攻撃、とおるは${damage}のダメージを受けた`, true);
    
    // Apply damage to player
    setPlayer({
      ...player,
      currentHp: Math.max(0, player.currentHp - damage)
    });
    
    // Start player's turn
    setIsPlayerTurn(true);
  };

  // UPDATED: Handle soso heal with new behavior - now also attacks player
  const handleSosoHeal = () => {
    if (isBattleOver) return;
    
    // Get random collaboration comment
    const collaborationComment = sosoCollaborationComments[Math.floor(Math.random() * sosoCollaborationComments.length)];
    
    // Add collaboration comment
    addComment(opponent1.name, collaborationComment);
    
    // Heal amount and attack damage calculations
    const healAmount = 20;
    const damageToPlayer = Math.floor(Math.random() * (opponent1.attackMax - opponent1.attackMin + 1)) + opponent1.attackMin;
    
    // Add system comments for both healing and attacking
    addComment("システム", `そーそーの体力が${healAmount}回復した`, true);
    addComment("システム", `同時に、とおるは${damageToPlayer}のダメージを受けた`, true);
    
    // Heal opponent by 20 points
    setOpponent1({
      ...opponent1,
      currentHp: Math.min(opponent1.maxHp, opponent1.currentHp + healAmount),
      // Increase attack power by 5 in special mode
      attackMin: opponent1.attackMin + 5,
      attackMax: opponent1.attackMax + 5
    });
    
    // Apply damage to player
    const newPlayerHp = Math.max(0, player.currentHp - damageToPlayer);
    setPlayer({
      ...player,
      currentHp: newPlayerHp
    });
    
    // Check if this attack defeated the player
    if (newPlayerHp <= 0 && !isBattleOver) {
      // We'll handle the defeat on the next render via the useEffect that checks hp
    } else {
      // Start player's turn if battle continues
      setIsPlayerTurn(true);
    }
  };

  const handleVictory = () => {
    // Mark that we've already scheduled a transition
    setTransitionScheduled(true);
    setBattleResult('victory');
    setSoundEffect(victorySoundUrl);
    
    // Add victory comments
    addComment("システム", "とおるが勝利した、そーそーは破れかぶれになってクソリプを量産してしまった", true);
    
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
    
    // Final message and screen transition with clear console logs for debugging
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
          console.log("Executing automatic victory transition to victory1");
          handleScreenTransition('victory1');
          navigate('/victory1');
        }
      }, 20000); // 20 seconds automatic redirect
      
      setRedirectTimer(timer);
    }, 12000);
  };

  // Handle defeat - updated to redirect to result1 screen
  const handleDefeat = () => {
    // Mark that we've already scheduled a transition
    setTransitionScheduled(true);
    setBattleResult('defeat');
    setSoundEffect(defeatSoundUrl);
    
    // Add defeat comments
    addComment("システム", "とおるが敗北した、そーそーは歯止めが利かなくなってしまった", true);
    
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
    
    // Final messages and screen transition with clear console logs for debugging
    setTimeout(() => {
      addComment("システム", "とおるは敗北の美酒の効果で痛風が悪化した、530000のダメージ", true);
      
      setTimeout(() => {
        addComment("システム", "ライブが終了しました", true);
        console.log("Scheduling defeat transition to result1 in 20 seconds...");
        
        // Show skip button after 15 seconds
        setTimeout(() => {
          setShowSkipButton(true);
        }, 1000);
        
        // Set up a 20-second timer for automatic redirect to result1 instead of endingB
        const timer = setTimeout(() => {
          if (!transitionScheduled) {
            console.log("Executing automatic defeat transition to result1");
            handleScreenTransition('result1');
            navigate('/result1');
          }
        }, 20000); // 20 seconds automatic redirect
        
        setRedirectTimer(timer);
      }, 3000);
    }, 15000);
  };

  // Handle character sheet display
  const handleCharacterClick = (character: 'player' | 'opponent1' | 'opponent2') => {
    setCurrentCharacterSheet(character);
    setShowCharacterSheet(true);
  };

  return {
    player,
    opponent1,
    battleTimer,
    isBattleOver,
    isPlayerTurn,
    attackCount,
    sosoHealMode,
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
