import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import HPBar from '@/components/HPBar';
import SpecialGauge from '@/components/SpecialGauge';
import CommentArea from '@/components/CommentArea';
import CharacterSheet from '@/components/CharacterSheet';
import AudioPlayer from '@/components/AudioPlayer';
import { Volume2, VolumeX } from 'lucide-react';

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

const Battle1Screen: React.FC = () => {
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
    bgmEnabled, toggleBgm,
    showCharacterSheet, setShowCharacterSheet,
    currentCharacterSheet, setCurrentCharacterSheet,
    handleScreenTransition
  } = useApp();

  const [isBattleOver, setIsBattleOver] = useState(false);
  const [soundEffect, setSoundEffect] = useState<string | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isBattleStarted, setIsBattleStarted] = useState(false);

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
    
    setOpponent1({
      ...opponent1,
      currentHp: opponent1.maxHp
    });
    
    setAttackCount(0);
    setSpecialAttackAvailable(false);
    setHighballMode(false);
    setSosoHealMode(false);
    
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
    if ((player.currentHp <= 0 || opponent1.currentHp <= 0) && !isBattleOver) {
      setIsBattleOver(true);
      
      if (player.currentHp <= 0) {
        // Player lost
        handleDefeat();
      } else if (opponent1.currentHp <= 0) {
        // Player won
        handleVictory();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.currentHp, opponent1.currentHp]);

  // Update the HP threshold for soso heal mode
  useEffect(() => {
    if (opponent1.currentHp <= 10 && !sosoHealMode && !isBattleOver) {
      setSosoHealMode(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opponent1.currentHp]);

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
    addComment("システム", `とおるの攻撃、そーそーは${damage}のダメージを受けた`, true);
    
    // Apply damage to opponent
    setOpponent1({
      ...opponent1,
      currentHp: Math.max(0, opponent1.currentHp - damage)
    });
    
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

  // Handle soso heal with updated heal amount
  const handleSosoHeal = () => {
    if (isBattleOver) return;
    
    // Add heal comments
    addComment(opponent1.name, "あー、生きるってむずかしいんだよなー、株クラのみんな上がってきてよ");
    addComment("システム", "ラムダがコラボに参加した、松嶋ことがコラボに参加した。そーそーの体力が20回復した", true);
    
    // Heal opponent (changed from 30 to 20)
    setOpponent1({
      ...opponent1,
      currentHp: Math.min(opponent1.maxHp, opponent1.currentHp + 20)
    });
    
    // Reset heal mode
    setSosoHealMode(false);
    
    // Start player's turn
    setIsPlayerTurn(true);
  };

  // Handle victory
  const handleVictory = () => {
    setSoundEffect("/audios/syouri.mp3");
    
    // Add victory comments
    addComment("システム", "とおるが勝利した、そーそーは破れかぶれになってクソリプを量産してしまった", true);
    
    setTimeout(() => addComment("システム", "とおるは400の経験値を得た、とおるはレベルが上がった", true), 3000);
    setTimeout(() => addComment("システム", "とおるは祝いの美酒に酔いしれた", true), 6000);
    setTimeout(() => addComment("システム", "とおるは祝いの美酒の効果で痛風が悪化した、80のダメージ", true), 9000);
    setTimeout(() => addComment("システム", "とおるはライブを閉じてしまった", true), 12000);
    
    // Transition to victory screen after delay
    setTimeout(() => {
      handleScreenTransition('victory1');
    }, 20000);
  };

  // Handle defeat
  const handleDefeat = () => {
    setSoundEffect("/audios/orehamou.mp3");
    
    // Add defeat comments
    addComment("システム", "とおるが敗北した、そーそーは歯止めが利かなくなってしまった", true);
    
    setTimeout(() => addComment("システム", "とおるは4000の経験値を得た", true), 3000);
    setTimeout(() => addComment("システム", "とおるは敗北からも学べる男だった", true), 6000);
    setTimeout(() => addComment("システム", "とおるはレベルが上がった", true), 9000);
    setTimeout(() => addComment("システム", "とおるは敗北の美酒に酔いしれた", true), 12000);
    setTimeout(() => addComment("システム", "とおるは敗北の美酒の効果で痛風が悪化した、530000のダメージ", true), 15000);
    
    // Transition to ending B screen after delay
    setTimeout(() => {
      handleScreenTransition('endingB');
    }, 20000);
  };

  const handleCharacterClick = (character: 'player' | 'opponent1') => {
    setCurrentCharacterSheet(character);
    setShowCharacterSheet(true);
  };

  return (
    <div 
      className="min-h-screen flex flex-col h-screen p-4 text-white"
      style={{ 
        background: 'linear-gradient(180deg, rgba(212, 50, 144, 1), rgba(119, 3, 175, 1))',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif'
      }}
    >
      {/* Top section with title and timer */}
      <div className="text-center mb-2">
        <h1 className="text-[13px] font-bold mb-2">さよならクソリプそーそー！</h1>
        <div className="flex items-start justify-start gap-4">
          <img 
            src={player.icon} 
            alt={player.name} 
            className="w-12 h-12 rounded-full"
          />
          <div className="flex flex-col items-start">
            <span className="text-[11px]">{player.name}</span>
            <p className="text-[11px]">{formatTime(battleTimer)}</p>
          </div>
        </div>
      </div>
      
      {/* Health bars */}
      <div className="flex gap-4 mb-2">
        <div className="flex-1">
          <HPBar currentHP={player.currentHp} maxHP={player.maxHp} />
        </div>
        <div className="flex-1">
          <HPBar currentHP={opponent1.currentHp} maxHP={opponent1.maxHp} />
        </div>
      </div>
      
      {/* Special attack gauges */}
      <div className="flex gap-4 mb-2">
        <div className="flex-1">
          <SpecialGauge currentValue={attackCount} maxValue={3} />
        </div>
        <div className="flex-1">
          {/* Opponent's special gauge (heal mode gauge) */}
          <SpecialGauge 
            currentValue={sosoHealMode ? 0 : opponent1.currentHp <= 30 ? 1 : 0} 
            maxValue={1} 
            label={sosoHealMode ? "回復中" : "とくぎはつどう：1"}
          />
        </div>
      </div>
      
      {/* Character info - centered horizontally with 4-grid layout */}
      <div className="grid grid-cols-4 mb-2">
        <div className="col-span-1"></div>
        <div className="flex flex-col items-center col-span-1 cursor-pointer" onClick={() => handleCharacterClick('player')}>
          <img 
            src={player.icon} 
            alt={player.name} 
            className="w-16 h-16 rounded-full"
          />
          <span className="font-bold mt-1 truncate w-20 text-center text-[10px]">
            {player.name.length > 5 ? `${player.name.substring(0, 5)}...` : player.name}
          </span>
        </div>
        
        <div className="flex flex-col items-center col-span-1 cursor-pointer" onClick={() => handleCharacterClick('opponent1')}>
          <img 
            src={opponent1.icon} 
            alt={opponent1.name} 
            className="w-16 h-16 rounded-full"
          />
          <span className="font-bold mt-1 truncate w-20 text-center text-[10px]">
            {opponent1.name.length > 5 ? `${opponent1.name.substring(0, 5)}...` : opponent1.name}
          </span>
        </div>
        <div className="col-span-1"></div>
      </div>
      
      {/* Comments area with fixed height */}
      <div className="flex-1 mb-2 h-[40vh] overflow-hidden">
        <CommentArea comments={comments} />
      </div>
      
      {/* Battle actions at bottom */}
      <div className="mt-auto">
        {/* Battle actions buttons with new styling */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          <button 
            onClick={handlePlayerAttack} 
            disabled={!isPlayerTurn || isBattleOver}
            className={`battle-action-button text-xs ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
          >
            こうげき
          </button>
          
          <button 
            onClick={handlePlayerSpecial} 
            disabled={!isPlayerTurn || isBattleOver || !specialAttackAvailable}
            className={`battle-action-button text-xs ${!isPlayerTurn || isBattleOver || !specialAttackAvailable ? 'opacity-60' : ''}`}
          >
            とくぎ
          </button>
          
          <button 
            onClick={handleRunAway} 
            disabled={!isPlayerTurn || isBattleOver}
            className={`battle-action-button text-xs ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
          >
            にげる
          </button>
          
          <button 
            onClick={handleHighball} 
            disabled={!isPlayerTurn || isBattleOver}
            className={`battle-action-button text-xs ${!isPlayerTurn || isBattleOver ? 'opacity-60' : ''}`}
          >
            ハイボール
          </button>
        </div>
        
        {/* Comment input - always at bottom */}
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="コメント"
            className="flex-1 bg-gray-200 text-black rounded-md px-4 py-2"
            disabled
          />
          <button
            className="bg-pink-500 text-white rounded-md px-4 py-2"
            disabled
          >
            送信
          </button>
        </div>
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
    </div>
  );
};

export default Battle1Screen;
