
import { useState, useEffect } from 'react';
import { useApp, Character } from '@/context/AppContext';

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

// Attack comments for opponent2 (yuji)
const opponent2AttackComments = [
  "しいたけ しか勝たん！！俺はしいたけ占いしか信じてないんすよ～",
  "年収1000万目指します、まじで",
  "「やればやるほど、楽しくなっていく」今まさにそんな状態！",
  "佐川の集荷呼ぶだけでこんなに難しいなんて・・・",
  "僕は常にかゆいところに手が届く存在でありたい",
  "2025年以降の目標を立てて、めっちゃワクワクした！",
  "今日の予定？タイミー"
];

export const useBattle2Logic = () => {
  const { 
    player, setPlayer,
    opponent2, setOpponent2,
    battleTimer,
    resetBattleTimer,
    startBattleTimer,
    comments, addComment, clearComments,
    specialAttackAvailable, setSpecialAttackAvailable,
    attackCount, setAttackCount,
    highballMode, setHighballMode,
    yujiSpecialMode, setYujiSpecialMode,
    showCharacterSheet, setShowCharacterSheet,
    currentCharacterSheet, setCurrentCharacterSheet,
    handleScreenTransition
  } = useApp();

  const [isBattleOver, setIsBattleOver] = useState(false);
  const [soundEffect, setSoundEffect] = useState<string | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isBattleStarted, setIsBattleStarted] = useState(false);
  const [yujiSpecialTimerId, setYujiSpecialTimerId] = useState<NodeJS.Timeout | null>(null);

  // Initialize battle when component mounts
  useEffect(() => {
    clearComments();
    resetBattleTimer();
    startBattleTimer();
    setIsBattleStarted(true);
    
    // Reset player and opponent stats
    setPlayer({
      ...player,
      currentHp: player.maxHp
    });
    
    setOpponent2({
      ...opponent2,
      currentHp: opponent2.maxHp
    });
    
    setAttackCount(0);
    setSpecialAttackAvailable(false);
    setHighballMode(false);
    setYujiSpecialMode(false);
    
    addComment("システム", "バトル開始！ 陽気なおじさんゆうじ！", true);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle opponent's turn
  useEffect(() => {
    if (!isPlayerTurn && isBattleStarted && !isBattleOver) {
      const opponentTimer = setTimeout(() => {
        handleOpponentAction();
      }, 1500);
      
      return () => clearTimeout(opponentTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayerTurn, isBattleStarted, isBattleOver, yujiSpecialMode]);

  // Check for battle over conditions
  useEffect(() => {
    if ((player.currentHp <= 0 || opponent2.currentHp <= 0) && !isBattleOver) {
      setIsBattleOver(true);
      
      if (player.currentHp <= 0) {
        // Player lost
        handleDefeat();
      } else if (opponent2.currentHp <= 0) {
        // Player won
        handleVictory();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.currentHp, opponent2.currentHp]);

  // Check for yuji special mode trigger
  useEffect(() => {
    if (opponent2.currentHp <= 30 && !yujiSpecialMode && !isBattleOver) {
      triggerYujiSpecial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opponent2.currentHp]);

  // Clean up the timer when component unmounts
  useEffect(() => {
    return () => {
      if (yujiSpecialTimerId) {
        clearTimeout(yujiSpecialTimerId);
      }
    };
  }, [yujiSpecialTimerId]);

  // Handle player attack
  const handlePlayerAttack = () => {
    if (isBattleOver || !isPlayerTurn) return;
    
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
    
    // Check if opponent is in special mode
    if (yujiSpecialMode) {
      addComment("システム", "ゆうじはのれんに腕押しを発動した。とおるの言葉は響かない。ゆうじは0ダメージを受けた。", true);
    } else {
      addComment("システム", `とおるの攻撃、ゆうじは${damage}のダメージを受けた`, true);
      
      // Apply damage to opponent
      setOpponent2({
        ...opponent2,
        currentHp: Math.max(0, opponent2.currentHp - damage)
      });
    }
    
    // End player's turn
    setIsPlayerTurn(false);
  };

  // Handle player special attack
  const handlePlayerSpecial = () => {
    if (isBattleOver || !isPlayerTurn || !specialAttackAvailable) return;
    
    // Get random special attack comment
    const specialComment = playerSpecialComments[Math.floor(Math.random() * playerSpecialComments.length)];
    
    // Calculate damage (higher than regular attack)
    const damage = Math.floor(Math.random() * (player.specialPower - 30 + 1)) + 30;
    
    // Add attack comments
    addComment(player.name, specialComment);
    
    // Check if opponent is in special mode
    if (yujiSpecialMode) {
      addComment("システム", "ゆうじはのれんに腕押しを発動した。とおるの言葉は響かない。ゆうじは0ダメージを受けた。", true);
    } else {
      addComment("システム", `とおるのとくぎ！ゆうじは${damage}のダメージを受けた！`, true);
      
      // Apply damage to opponent
      setOpponent2({
        ...opponent2,
        currentHp: Math.max(0, opponent2.currentHp - damage)
      });
    }
    
    // Reset special attack availability and count
    setSpecialAttackAvailable(false);
    setAttackCount(0);
    
    // End player's turn
    setIsPlayerTurn(false);
  };

  // Handle running away
  const handleRunAway = () => {
    if (isBattleOver || !isPlayerTurn) return;
    
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

  // Handle opponent's action
  const handleOpponentAction = () => {
    if (isBattleOver) return;
    
    if (yujiSpecialMode) {
      // In special mode, Yuji sometimes heals instead of attacking
      if (Math.random() < 0.3) {
        // Healing action
        addComment(opponent2.name, "クラファンの支援者のみなさんありがとう！！");
        addComment("システム", "ゆうじのHPが10回復した！", true);
        
        // Heal opponent
        setOpponent2({
          ...opponent2,
          currentHp: Math.min(opponent2.maxHp, opponent2.currentHp + 10)
        });
      } else {
        // Normal attack
        handleOpponentAttack();
      }
    } else {
      // Regular attack
      handleOpponentAttack();
    }
    
    // Start player's turn
    setIsPlayerTurn(true);
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
  };

  // Trigger Yuji's special mode
  const triggerYujiSpecial = () => {
    // Add special mode comments
    addComment(opponent2.name, "もう一回デザフェス出るから、みんなお金で応援して！！お願い！！");
    addComment("システム", "ゆうじはクラウドファンディングを発動した", true);
    addComment("システム", "ゆうじのHPゲージが満タンになった", true);
    addComment("システム", "ゆうじ確変モードに突入", true);
    addComment("システム", "ゆうじは特性「のれんに腕押し」を発動した", true);
    
    // Restore opponent's HP
    setOpponent2({
      ...opponent2,
      currentHp: opponent2.maxHp
    });
    
    // Enable special mode
    setYujiSpecialMode(true);
    
    // Set a timer to disable special mode after 40 seconds
    const timerId = setTimeout(() => {
      setYujiSpecialMode(false);
      addComment("システム", "ゆうじの確変モードが解除された！", true);
    }, 40000);
    
    setYujiSpecialTimerId(timerId);
  };

  // Handle victory
  const handleVictory = () => {
    setSoundEffect("/audios/syouri.mp3");
    
    // Add victory comments
    addComment("システム", "とおるが勝利した、ゆうじは拗ねてタムタムにLINEをした", true);
    
    // Display victory messages with delays
    setTimeout(() => addComment("システム", "タムタムからの返事がない、ゆうじはリコさんにLINEをした", true), 3000);
    setTimeout(() => addComment("システム", "リコさんからの返事がない", true), 6000);
    setTimeout(() => addComment("システム", "ゆうじは殻に閉じこもってしまった", true), 9000);
    setTimeout(() => addComment("システム", "その後、風のうわさでゆうじが米国大統領に当選したと聞いた", true), 12000);
    setTimeout(() => addComment("システム", "とおるはゆうじを倒した。", true), 15000);
    setTimeout(() => addComment("システム", "でも本当は、ゆうじを倒したくなかった。", true), 18000);
    setTimeout(() => addComment("システム", "永遠にゆうじとの戯れをつづけたかった。", true), 21000);
    setTimeout(() => addComment("システム", "だが、とおるはゆうじを倒してしまった。", true), 24000);
    setTimeout(() => addComment("システム", "この戦いに勝利者はいない", true), 27000);
    setTimeout(() => addComment("システム", "とおるは一人涙して、今日もハイボールを飲む、とおるの心に7兆のダメージ", true), 30000);
    
    // Transition to ending A screen after delay
    setTimeout(() => {
      handleScreenTransition('endingA');
    }, 35000);
  };

  // Handle defeat
  const handleDefeat = () => {
    setSoundEffect("/audios/orehamou.mp3");
    
    // Add defeat comments
    addComment("システム", "とおるが敗北した、ゆうじは調子にのってしまった", true);
    
    // Display defeat messages with delays
    setTimeout(() => addComment("システム", "とおるは5億の経験値を得た", true), 3000);
    setTimeout(() => addComment("システム", "とおるは敗北からも学べる男だった", true), 6000);
    setTimeout(() => addComment("システム", "とおるはレベルが7000上がった", true), 9000);
    setTimeout(() => addComment("システム", "だが、ゆうじはどんどん悪い方向に成長した", true), 12000);
    setTimeout(() => addComment("システム", "とおるは危機感を覚えた", true), 15000);
    setTimeout(() => addComment("システム", "あの時俺が本気でぶん殴って目を覚まさせてやればこんなことには・・・", true), 18000);
    setTimeout(() => addComment("システム", "とおるは悔やんだ、そしてハイボールを飲んだ", true), 21000);
    setTimeout(() => addComment("システム", "夜空に輝く星の瞬きが、今日だけはいつもよりも多く感じた", true), 24000);
    
    // Transition to ending C screen after delay
    setTimeout(() => {
      handleScreenTransition('endingC');
    }, 30000);
  };

  // Handle character sheet display
  const handleCharacterClick = (character: 'player' | 'opponent1' | 'opponent2') => {
    if (character === 'opponent1') {
      character = 'opponent2'; // Make sure we show the right character sheet
    }
    setCurrentCharacterSheet(character);
    setShowCharacterSheet(true);
  };

  return {
    player,
    opponent2,
    battleTimer,
    isBattleOver,
    soundEffect,
    isPlayerTurn,
    attackCount,
    specialAttackAvailable,
    yujiSpecialMode,
    highballMode,
    showCharacterSheet,
    currentCharacterSheet,
    comments,
    handlePlayerAttack,
    handlePlayerSpecial,
    handleRunAway,
    handleHighball,
    handleCharacterClick,
    setShowCharacterSheet
  };
};
