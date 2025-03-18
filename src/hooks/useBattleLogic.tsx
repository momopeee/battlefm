import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Screen } from '@/context/AppContext';

export const useBattleLogic = () => {
  const navigate = useNavigate();
  const { 
    player, 
    setPlayer, 
    opponent1, 
    setOpponent1,
    opponent2,
    setOpponent2,
    battleTimer,
    startBattleTimer,
    pauseBattleTimer,
    resetBattleTimer,
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
    currentScreen,
    handleScreenTransition,
    showCharacterSheet,
    setShowCharacterSheet,
    currentCharacterSheet,
    setCurrentCharacterSheet
  } = useApp();
  
  // Battle state
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [playerHp, setPlayerHp] = useState(player.currentHp);
  const [opponentHp, setOpponentHp] = useState(currentScreen === 'battle1' ? opponent1.currentHp : opponent2.currentHp);
  const [attackInProgress, setAttackInProgress] = useState(false);
  const [soundEffect, setSoundEffect] = useState<string | null>(null);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);
  const [isHighballConfused, setIsHighballConfused] = useState(false);
  
  // Reset player HP and set current HP on component mount or when maxHp changes
  useEffect(() => {
    const selectedOpponent = currentScreen === 'battle1' ? opponent1 : opponent2;
    setPlayerHp(player.currentHp);
    setOpponentHp(selectedOpponent.currentHp);
    
    // Start battle timer
    startBattleTimer();
    
    // Add initial system message
    if (comments.length === 0) {
      const opponentName = currentScreen === 'battle1' ? 'そーそー＠狂犬ツイート' : 'ゆうじ＠陽気なおじさん';
      setTimeout(() => {
        addComment('システム', `バトル開始！とおる VS ${opponentName}`, true);
      }, 500);
    }
    
    // Cleanup on unmount
    return () => {
      pauseBattleTimer();
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [player.maxHp, currentScreen]);
  
  // Update the current opponent based on the current screen
  const currentOpponent = currentScreen === 'battle1' ? opponent1 : opponent2;
  
  // Player attack comments for each battle
  const sosoAttackComments = [
    "スタエフに黒い噂が絶えないのは、そーそーがクソリプを付けまくっているせいだ",
    "テイルズオブジアビスに何百時間費やしたのなら、もっとSEOやGoogleアナリティクスに時間を使え！",
    "起業家なら自分に厳しくあれ！！ベストセラーを生み出す漫画家の思考法を見習え！！",
    "作家性に溺れるな！お前はクリエイターじゃない、起業家なんだ！",
    "いい加減本業に集中しろ！",
    "「しょうじき、むり」じゃなくて「ぜったい、やる！」と言え！",
    "ひろゆきが正しいと思うなら、お前は永遠に成長しない",
    "スタンドエフエムが好きなだけで、売上が上がると勘違いするな！",
    "もっとベネフィットを考えて、「何が売れるか？」で考えろ！"
  ];

  const yujiAttackComments = [
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
  
  // Player special attack comments for each battle
  const sosoSpecialComments = [
    "そーそー、お前はツイッターで毒を吐くな！！自分を成長させる時間に当てろ！！お前の骨は俺が拾う！！！",
    "クソリプを付けるエネルギーで新サービス開発しろ！！そうすればスタエフはもっとよくなる、俺がそーその骨は拾ってやる！！",
    "そーその毒は必要ない！！優しくて温かいスタエフが大好きなそーその顔が見たいんだ！！その骨は俺が拾う！！！"
  ];

  const yujiSpecialComments = [
    "パッションは大事だ、でもパッションだけじゃ薄っぺらい詐欺師と何も変わらないだろ！ゆうじが守りたいものを思い出して、正面からぶつかっていけ！骨は俺が拾う！！",
    "俺達はゆうじが大好きだからいろいろ言うんだ、耳が痛い事もあるだろう、だが逃げるな！何があってもお前の骨は俺が拾う！！！",
    "自らアドバイスを求めたなら、その相手には進捗の報告を怠るな！！俺達はいい、友達だから報告が無くても\"ゆうじは最低だ！！\"で済ませて、その後も仲良く出来る。だが、他の人は違う、一度不義理をしたら一生相手にされないし、下手したら敵になって戻ってくる。良く考えて行動し、軽はずみで他人を使い捨てにするな！！"
  ];
  
  // Victory and defeat comments for each battle
  const sosoVictoryComments = [
    "とおるが勝利した！",
    "そーそーのキーボードは鍵のかかった机の引き出しに片付けられた",
    "そして、そーそーのXアカウントに二段階認証が設定された",
    "ログインの暗唱を忘れたそーそーが嘆いている",
    "そーそーは「いつもブラウザにログインしてるから〜」とか言い訳をしている",
    "とおるは「心配するな！これも愛だ！骨は俺が拾う！」と優しい笑顔でそーそーに語りかけた",
    "そーそーのスマホには管理アプリが入り、毒ツイートには警告画面が表示されるようになった",
    "そーそーのキーボードは今日も泣いている",
    "だが、そーそーはクリエイティブな迷路から抜け出し、本業で大きな成功を収めた",
    "時々毒ツイートが恋しくなり、スタエフで毒を吐くために毎週金曜の夜には必ずライブをするようになった",
    "そこで、とおるが「そうじゃない！そこじゃない！」と叫ぶ",
    "でもみんな幸せであった"
  ];

  const sosoDefeatComments = [
    "とおるが敗北した、そーそーのツイッターが止まらない",
    "もはや誰も止められない",
    "そーそーの毒は加速していく",
    "でも心配いらない",
    "そーそーの毒は愛",
    "その毒さえ愛せるなら",
    "この世は天国",
    "だって、",
    "伝説の起業家になった今のそーそーは、かつての毒ツイートを全て愛の文字に変えた",
    "毒があったからこそ今の彼がある",
    "そして、",
    "今日もとおるとそーそーはスタエフで楽しくコラボ配信するのだった"
  ];

  const yujiVictoryComments = [
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

  const yujiDefeatComments = [
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

  // Enemy attack comments for each battle
  const sosoEnemyComments = [
    "くそが！お前馬鹿か？",
    "漫画家の考え方を勉強しろ！",
    "「しょうじき、むり」",
    "おれは作家なんだよ！",
    "スタエフのせいで作業が進まない！",
    "作家性だよ！わかる？",
    "お前、ひろゆきに論破されてほしいな",
    "それ、違うから",
    "そもそも売れないから！"
  ];

  const yujiEnemyComments = [
    "しいたけ しか勝たん！！俺はしいたけ占いしか信じてないんすよ～",
    "年収1000万目指します、まじで",
    "「やればやるほど、楽しくなっていく」今まさにそんな状態！",
    "佐川の集荷呼ぶだけでこんなに難しいなんて・・・",
    "僕は常にかゆいところに手が届く存在でありたい",
    "2025年以降の目標を立てて、めっちゃワクワクした！",
    "今日の予定？タイミー"
  ];
  
  // Handle character click
  const handleCharacterClick = (character: 'player' | 'opponent1' | 'opponent2') => {
    setCurrentCharacterSheet(character);
    setShowCharacterSheet(true);
  };
  
  // Handle player attack
  const handlePlayerAttack = () => {
    if (!isPlayerTurn || attackInProgress || isBattleOver) return;
    
    setAttackInProgress(true);
    setSoundEffect('/audios/attack.mp3');
    
    // Handle highball confusion
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
    
    // Get battle-specific attack comments array
    const attackComments = currentScreen === 'battle1' ? sosoAttackComments : yujiAttackComments;
    
    // Get random attack comment
    const randomIndex = Math.floor(Math.random() * attackComments.length);
    const attackComment = attackComments[randomIndex];
    
    addComment('とおる＠経営参謀', attackComment);
    
    // Calculate damage
    const min = player.attackMin;
    const max = player.attackMax;
    const damage = Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Special case for Soso's heal mode
    if (currentScreen === 'battle1' && sosoHealMode) {
      setTimeout(() => {
        addComment('システム', 'そーそーは毒を吸収してパワーアップした！\nそーそーのHPが回復した', true);
        
        // Opponent1 (Soso) heals instead of taking damage
        setOpponentHp(Math.min(opponent1.maxHp, opponentHp + 10));
        
        // Update attack count for special meter
        const newAttackCount = attackCount + 1;
        setAttackCount(newAttackCount);
        if (newAttackCount >= 3) {
          setSpecialAttackAvailable(true);
        }
        
        // Enemy turn
        setTimeout(() => {
          setIsPlayerTurn(false);
          setAttackInProgress(false);
          handleEnemyAttack();
        }, 1000);
      }, 500);
      
      return;
    }
    
    // Special case for Yuji's special mode in Battle2
    const isYujiSpecialMode = currentScreen === 'battle2' && yujiSpecialMode;
    
    // Apply damage with delay for animation
    setTimeout(() => {
      if (isYujiSpecialMode) {
        // Yuji's special mode reduces damage to 0
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
      if (opponentHp - damage <= 0 && !isYujiSpecialMode) {
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
  
  // Handle player special attack
  const handlePlayerSpecial = () => {
    if (!isPlayerTurn || attackInProgress || !specialAttackAvailable || isBattleOver) return;
    
    setAttackInProgress(true);
    setSoundEffect('/audios/special.mp3');
    setSpecialAttackAvailable(false);
    setAttackCount(0);
    
    // Get battle-specific special attack comments
    const specialComments = currentScreen === 'battle1' ? sosoSpecialComments : yujiSpecialComments;
    
    // Get random special attack comment
    const randomIndex = Math.floor(Math.random() * specialComments.length);
    const specialComment = specialComments[randomIndex];
    
    addComment('とおる＠経営参謀', specialComment);
    
    // Special attack damage - handle Yuji's special mode differently
    const isYujiSpecialMode = currentScreen === 'battle2' && yujiSpecialMode;
    const damage = isYujiSpecialMode ? 10 : player.specialPower;
    
    setTimeout(() => {
      if (currentScreen === 'battle1' && sosoHealMode) {
        // Turn off Soso's heal mode
        setSosoHealMode(false);
        addComment('システム', 'そーそーの毒吸収能力が無効化された！\nそーそーに50ポイントのダメージ！', true);
        setOpponentHp(Math.max(0, opponentHp - 50));
      } else if (isYujiSpecialMode) {
        // Yuji special mode reduces effectiveness
        setOpponentHp(Math.max(0, opponentHp - damage));
        addComment('システム', `とおるの必殺技が炸裂！ゆうじののれんに腕押しをわずかに通過した。 ${damage}ポイントのダメージ！`, true);
      } else {
        // Normal special attack
        setOpponentHp(Math.max(0, opponentHp - damage));
        addComment('システム', `とおるの必殺技が炸裂！ ${damage}ポイントの大ダメージ！`, true);
      }
      
      // Check if opponent defeated
      if (opponentHp - damage <= 0 || (currentScreen === 'battle1' && sosoHealMode && opponentHp - 50 <= 0)) {
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
    setSoundEffect('/audios/enemy_attack.mp3');
    
    // Get battle-specific enemy attack comments
    const enemyComments = currentScreen === 'battle1' ? sosoEnemyComments : yujiEnemyComments;
    
    // Get random enemy attack comment
    const randomIndex = Math.floor(Math.random() * enemyComments.length);
    const attackComment = enemyComments[randomIndex];
    const opponentName = currentScreen === 'battle1' ? 'そーそー＠狂犬ツイート' : 'ゆうじ＠陽気なおじさん';
    
    // Calculate damage - special for Yuji's special mode
    const isYujiSpecialMode = currentScreen === 'battle2' && yujiSpecialMode;
    const min = isYujiSpecialMode ? currentOpponent.attackMin * 2 : currentOpponent.attackMin;
    const max = isYujiSpecialMode ? currentOpponent.attackMax * 2 : currentOpponent.attackMax;
    const damage = Math.floor(Math.random() * (max - min + 1)) + min;
    
    setTimeout(() => {
      addComment(opponentName, attackComment);
      
      if (currentScreen === 'battle1' && opponentHp < opponent1.maxHp * 0.3 && !sosoHealMode) {
        // Activate Soso's heal mode when HP is low
        setSosoHealMode(true);
        addComment('システム', 'そーそーが毒を吸収するモードに移行した！\n攻撃するとそーそーのHPが回復してしまう！', true);
      }
      
      setTimeout(() => {
        setPlayerHp(Math.max(0, playerHp - damage));
        
        if (isYujiSpecialMode) {
          addComment('システム', `確変モード中！ゆうじの言葉が突き刺さる！ ${damage}ポイントの大ダメージ！`, true);
        } else if (currentScreen === 'battle1') {
          addComment('システム', `そーそーの毒舌が突き刺さる！ ${damage}ポイントのダメージ！`, true);
        } else {
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
      }, 1000);
    }, 500);
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
  
  // Handle highball
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
      
      // Enable highball mode (if needed for future features)
      setHighballMode(true);
      
      // End player's turn
      setTimeout(() => {
        setIsPlayerTurn(false);
        setAttackInProgress(false);
        handleEnemyAttack();
      }, 1000);
    }, 500);
  };
  
  // Show victory comments sequentially
  const showVictoryComments = () => {
    // Choose the right set of victory comments
    const victoryComments = currentScreen === 'battle1' ? sosoVictoryComments : yujiVictoryComments;
    
    victoryComments.forEach((comment, index) => {
      setTimeout(() => {
        addComment('システム', comment, true);
      }, index * 3000); // Show each comment with a 3-second delay
    });
  };
  
  // Show defeat comments sequentially
  const showDefeatComments = () => {
    // Choose the right set of defeat comments
    const defeatComments = currentScreen === 'battle1' ? sosoDefeatComments : yujiDefeatComments;
    
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
    
    // Set up automatic redirection after 30 seconds
    const timer = setTimeout(() => {
      // Pause the battle timer before redirecting
      pauseBattleTimer();
      
      // Redirect based on current screen
      const nextRoute = currentScreen === 'battle1' ? '/victory1' : '/victory2';
      handleScreenTransition(currentScreen === 'battle1' ? 'victory1' : 'victory2');
      navigate(nextRoute);
    }, 20000);
    
    setRedirectTimer(timer);
    
    // Show skip button after 10 seconds
    setTimeout(() => {
      setShowSkipButton(true);
    }, 10000);
  };
  
  // Handle defeat with automatic redirection
  const handleDefeat = () => {
    setIsBattleOver(true);
    setBattleResult('defeat');
    setSoundEffect('/audios/orehamou.mp3');
    showDefeatComments();
    
    // Set up automatic redirection after 30 seconds
    const timer = setTimeout(() => {
      // Pause the battle timer before redirecting
      pauseBattleTimer();
      
      // Redirect based on current screen to the result screens
      const nextRoute = currentScreen === 'battle1' ? '/result1' : '/result2';
      handleScreenTransition(currentScreen === 'battle1' ? 'result1' : 'result2');
      navigate(nextRoute);
    }, 20000);
    
    setRedirectTimer(timer);
    
    // Show skip button after 15 seconds
    setTimeout(() => {
      setShowSkipButton(true);
    }, 15000);
  };
  
  // Handle skip button click
  const handleSkip = (customRoute?: string) => {
    if (!isBattleOver) return;
    
    // Cancel any pending timers
    if (redirectTimer) {
      clearTimeout(redirectTimer);
      setRedirectTimer(null);
    }
    
    // Pause the battle timer
    pauseBattleTimer();
    
    // If custom route provided, use it
    if (customRoute) {
      const screenMap: Record<string, Screen> = {
        '/victory1': 'victory1',
        '/victory2': 'victory2',
        '/result1': 'result1',
        '/result2': 'result2'
      };
      
      const mappedScreen = screenMap[customRoute] as Screen;
      if (mappedScreen) {
        handleScreenTransition(mappedScreen);
      }
      
      navigate(customRoute);
      return;
    }
    
    // Otherwise use default routes based on battle result
    if (battleResult === 'victory') {
      const nextRoute = currentScreen === 'battle1' ? '/victory1' : '/victory2';
      handleScreenTransition(currentScreen === 'battle1' ? 'victory1' : 'victory2');
      navigate(nextRoute);
    } else if (battleResult === 'defeat') {
      // Update to redirect to result screens on defeat
      const nextRoute = currentScreen === 'battle1' ? '/result1' : '/result2';
      handleScreenTransition(currentScreen === 'battle1' ? 'result1' : 'result2');
      navigate(nextRoute);
    }
  };
  
  // Update player/opponent health in context when battle ends
  useEffect(() => {
    if (isBattleOver) {
      if (currentScreen === 'battle1') {
        // Update opponent1 and player health
        setOpponent1({
          ...opponent1,
          currentHp: opponentHp
        });
      } else if (currentScreen === 'battle2') {
        // Update opponent2 and player health
        setOpponent2({
          ...opponent2,
          currentHp: opponentHp
        });
      }
      
      // Update player health
      setPlayer({
        ...player,
        currentHp: playerHp
      });
    }
  }, [isBattleOver]);
  
  // Clean up redirect timer on component unmount
  useEffect(() => {
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [redirectTimer]);
  
  return {
    player: { ...player, currentHp: playerHp },
    opponent1: { ...opponent1, currentHp: currentScreen === 'battle1' ? opponentHp : opponent1.currentHp },
    opponent2: { ...opponent2, currentHp: currentScreen === 'battle2' ? opponentHp : opponent2.currentHp },
    battleTimer,
    isPlayerTurn,
    isBattleOver,
    attackCount,
    sosoHealMode,
    yujiSpecialMode,
    specialAttackAvailable,
    comments,
    showSkipButton,
    handlePlayerAttack,
    handlePlayerSpecial,
    handleRunAway,
    handleHighball,
    handleCharacterClick,
    showCharacterSheet: currentCharacterSheet !== null,
    currentCharacterSheet,
    setShowCharacterSheet: (show: boolean) => {
      if (!show) setCurrentCharacterSheet(null);
    },
    handleSkip,
    battleResult,
    soundEffect
  };
};
