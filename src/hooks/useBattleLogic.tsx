
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Screen } from '@/context/AppContext';

export const useBattleLogic = () => {
  const navigate = useNavigate();
  const { 
    player, 
    opponent1, 
    opponent2,
    bgmEnabled, 
    toggleBgm,
    battleTimer,
    startBattleTimer,
    pauseBattleTimer,
    currentScreen,
    handleScreenTransition,
    comments,
    addComment,
    clearComments,
    attackCount,
    setAttackCount,
    specialAttackAvailable,
    setSpecialAttackAvailable,
    highballMode,
    setHighballMode,
    sosoHealMode,
    setSosoHealMode,
    yujiSpecialMode,
    setYujiSpecialMode,
    showCharacterSheet,
    setShowCharacterSheet,
    currentCharacterSheet,
    setCurrentCharacterSheet,
    resetBattleState
  } = useApp();
  
  // Battle state
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [playerHp, setPlayerHp] = useState(player.currentHp);
  const [opponentHp, setOpponentHp] = useState(opponent1.currentHp);
  const [attackInProgress, setAttackInProgress] = useState(false);
  const [soundEffect, setSoundEffect] = useState<string | null>(null);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);

  // Reset battle state on component mount and start timer
  useEffect(() => {
    clearComments();
    setPlayerHp(player.currentHp);
    setOpponentHp(currentScreen === 'battle1' ? opponent1.currentHp : opponent2.currentHp);
    setAttackCount(0);
    setSpecialAttackAvailable(false);
    setHighballMode(false);
    setSosoHealMode(false);
    setYujiSpecialMode(false);
    
    // Start the battle timer when component mounts
    startBattleTimer();
    
    // Initial system message
    setTimeout(() => {
      const opponentName = currentScreen === 'battle1' ? 'そーそー＠狂犬ツイート' : 'ゆうじ＠陽気なおじさん';
      addComment('システム', `第${currentScreen === 'battle1' ? '一' : '二'}戦！とおる VS ${opponentName}`, true);
      
      if (currentScreen === 'battle1') {
        addComment('そーそー＠狂犬ツイート', 'おっしゃこら！かかってこいや！');
      } else {
        addComment('ゆうじ＠陽気なおじさん', 'どうも～陽気なおじさんでお馴染み、ゆうじです。今日はやまにぃに経営とは何かについて僕なりに指南していきますよ～！');
      }
    }, 1000);
    
    // Cleanup function - pause timer when component unmounts
    return () => {
      pauseBattleTimer();
      
      // Clear any pending redirect timers
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, []);
  
  // Victory comments array based on current battle
  const victoryComments = currentScreen === 'battle1' ? [
    "そーそーは狂犬ツイートをやめた",
    "そーそーはおとなしくなった",
    "そーそーはただの犬になった",
    "そーそーは散歩にいった",
    "そーそーは二度と狂犬ツイートをしなかった",
    "とおるはそーそーを倒した。",
    "でも本当は、そーそーと仲良くなりたかった。",
    "永遠にそーそーと戯れたかった。",
    "だが、とおるはそーそーを倒してしまった。",
    "この戦いに勝利者はいない",
    "とおるは一人涙して、今日もハイボールを飲む、とおるの心に7兆のダメージ"
  ] : [
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
  
  // Defeat comments array based on current battle
  const defeatComments = currentScreen === 'battle1' ? [
    "とおるは敗北した、そーそーの狂犬ツイートは止まらない",
    "そーそーは狂犬ツイートをやめない",
    "そーそーはもっと狂犬になった",
    "そーそーは街を破壊し始めた",
    "そーそーは世界を破壊し始めた",
    "とおるは5億の経験値を得た",
    "とおるは敗北からも学べる男だった",
    "とおるはレベルが7000上がった",
    "だが、そーそーはどんどん悪い方向に成長した",
    "とおるは危機感を覚えた",
    "あの時俺が本気でぶん殴って目を覚まさせてやればこんなことには・・・",
    "とおるは悔やんだ、そしてハイボールを飲んだ",
    "夜空に輝く星の瞬きが、今日だけはいつもよりも多く感じた"
  ] : [
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
      setOpponentHp(Math.max(0, opponentHp - damage));
      addComment('システム', `とおるの言葉が突き刺さる！ ${damage}ポイントのダメージ！`, true);
      
      // Update attack count for special meter
      const newAttackCount = attackCount + 1;
      setAttackCount(newAttackCount);
      if (newAttackCount >= 3) {
        setSpecialAttackAvailable(true);
      }
      
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
    setSosoHealMode(true);
    
    addComment('とおる＠経営参謀', '奥義！ハイボールストリーム！！');
    
    // Special attack damage
    const damage = player.specialPower;
    
    setTimeout(() => {
      setOpponentHp(Math.max(0, opponentHp - damage));
      addComment('システム', `とおるの必殺技が炸裂！ ${damage}ポイントの大ダメージ！`, true);
      
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
    
    // Soso heal mode timeout
    setTimeout(() => {
      setSosoHealMode(false);
    }, 5000);
  };
  
  // Handle enemy attack
  const handleEnemyAttack = () => {
    if (isBattleOver) return;
    
    setAttackInProgress(true);
    setSoundEffect('/audios/enemy_attack.mp3');
    
    // Calculate damage
    const min = currentScreen === 'battle1' ? opponent1.attackMin : opponent2.attackMin;
    const max = currentScreen === 'battle1' ? opponent1.attackMax : opponent2.attackMax;
    const damage = Math.floor(Math.random() * (max - min + 1)) + min;
    
    setTimeout(() => {
      setPlayerHp(Math.max(0, playerHp - damage));
      
      if (currentScreen === 'battle1') {
        addComment('そーそー＠狂犬ツイート', 'アホ！カス！死ね！');
        addComment('システム', `そーそーの狂犬ツイートが突き刺さる！ ${damage}ポイントのダメージ！`, true);
      } else {
        addComment('ゆうじ＠陽気なおじさん', 'しいたけ しか勝たん！！俺はしいたけ占いしか信じてないんすよ～');
        addComment('システム', `ゆうじの陽気なトークが突き刺さる！ ${damage}ポイントのダメージ！`, true);
      }
      
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
  };
  
  // Handle running away
  const handleRunAway = () => {
    if (!isPlayerTurn || attackInProgress || isBattleOver) return;
    
    addComment('とおる＠経営参謀', "逃げよう...");
    
    setTimeout(() => {
      addComment('システム', "しかし、そこには壁があった！\nとおるは逃げることができなかった", true);
      
      // Enemy turn
      setIsPlayerTurn(false);
      setAttackInProgress(false);
      handleEnemyAttack();
    }, 500);
  };
  
  // Handle highball offer
  const handleHighball = () => {
    if (!isPlayerTurn || attackInProgress || isBattleOver) return;
    
    setHighballMode(true);
    addComment('とおる＠経営参謀', 'ぐびぐび、ぷはー！');
    
    setTimeout(() => {
      addComment('システム', "とおるはハイボールを飲んだ\nMPが5回復した", true);
      setHighballMode(false);
      
      // Enemy turn
      setIsPlayerTurn(false);
      setAttackInProgress(false);
      handleEnemyAttack();
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
      // Pause the battle timer before redirecting
      pauseBattleTimer();
      
      if (currentScreen === 'battle1') {
        handleScreenTransition('victory1');
        navigate('/victory1');
      } else {
        handleScreenTransition('victory2');
        navigate('/victory2');
      }
    }, 20000);
    
    setRedirectTimer(timer);
    
    // Show skip button after some delay
    setTimeout(() => {
      setShowSkipButton(true);
    }, 15000);
  };
  
  // Handle defeat with automatic redirection
  const handleDefeat = () => {
    setIsBattleOver(true);
    setBattleResult('defeat');
    setSoundEffect('/audios/orehamou.mp3');
    showDefeatComments();
    
    // Set up automatic redirection after 20 seconds
    const timer = setTimeout(() => {
      // Pause the battle timer before redirecting
      pauseBattleTimer();
      
      // Redirect to the appropriate result screen based on current battle
      if (currentScreen === 'battle1') {
        handleScreenTransition('result1');
        navigate('/result1');
      } else {
        // For battle2, store defeat status for EndingC screen
        sessionStorage.setItem('fromDefeat', 'true');
        handleScreenTransition('result2');
        navigate('/result2');
      }
    }, 20000);
    
    setRedirectTimer(timer);
    
    // Show skip button after 15 seconds
    setTimeout(() => {
      setShowSkipButton(true);
    }, 15000);
  };
  
  // Handle skip button click
  const handleSkip = () => {
    if (!isBattleOver) return;
    
    // Cancel any pending timers
    if (redirectTimer) {
      clearTimeout(redirectTimer);
      setRedirectTimer(null);
    }
    
    // Pause the battle timer
    pauseBattleTimer();
    
    // Use default routes based on battle result
    if (battleResult === 'victory') {
      if (currentScreen === 'battle1') {
        handleScreenTransition('victory1');
        navigate('/victory1');
      } else {
        handleScreenTransition('victory2');
        navigate('/victory2');
      }
    } else if (battleResult === 'defeat') {
      // Update to redirect to result screens on defeat
      if (currentScreen === 'battle1') {
        handleScreenTransition('result1');
        navigate('/result1');
      } else {
        // For battle2, store defeat status for EndingC screen
        sessionStorage.setItem('fromDefeat', 'true');
        handleScreenTransition('result2');
        navigate('/result2');
      }
    }
  };
  
  // Check for battle end conditions
  useEffect(() => {
    if (playerHp <= 0 && !isBattleOver) {
      handleDefeat();
    } else if (opponentHp <= 0 && !isBattleOver) {
      handleVictory();
    }
  }, [playerHp, opponentHp]);
  
  return {
    player,
    opponent1,
    opponent2,
    battleTimer,
    isBattleOver,
    isPlayerTurn,
    attackCount,
    sosoHealMode,
    specialAttackAvailable,
    comments,
    showSkipButton,
    showCharacterSheet,
    currentCharacterSheet,
    battleResult,
    soundEffect,
    handlePlayerAttack,
    handlePlayerSpecial,
    handleRunAway,
    handleHighball,
    handleCharacterClick,
    setShowCharacterSheet,
    handleSkip
  };
};
