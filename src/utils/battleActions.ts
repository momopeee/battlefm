
import { Character } from '@/context/AppContext';
import { 
  playerAttackComments, 
  playerSpecialComments, 
  opponent1AttackComments,
  highballEffects
} from '@/constants/battleComments';

type CommentHandler = (author: string, text: string, isSystem?: boolean) => void;

// Player attack - damage range 15-30
export const performPlayerAttack = (
  player: Character,
  opponent: Character,
  highballMode: boolean,
  addComment: CommentHandler
): { updatedPlayer: Character, updatedOpponent: Character, endTurn: boolean } => {
  if (highballMode) {
    // Special handling for highball mode
    addComment(player.name, "え？ちょっとまって、なに？なに？ちょっとまって？えっ？");
    addComment("システム", "何を言っているのか分からない。とおるは酔っぱらっているようだ。\nとおるは10のダメージを受けた", true);
    
    // Player damages himself
    const updatedPlayer = {
      ...player,
      currentHp: Math.max(0, player.currentHp - 10)
    };
    
    return { updatedPlayer, updatedOpponent: opponent, endTurn: true };
  }
  
  // Normal attack damage calculation - 15 to 30 damage
  const damage = Math.floor(Math.random() * (player.attackMax - player.attackMin + 1)) + player.attackMin;
  
  // Get random attack comment
  const attackComment = playerAttackComments[Math.floor(Math.random() * playerAttackComments.length)];
  
  // Add attack comments
  addComment(player.name, attackComment);
  addComment("システム", `とおるの攻撃、そーそーは${damage}のダメージを受けた`, true);
  
  // Apply damage to opponent
  const updatedOpponent = {
    ...opponent,
    currentHp: Math.max(0, opponent.currentHp - damage)
  };
  
  return { updatedPlayer: player, updatedOpponent, endTurn: true };
};

// Player special attack - 30 to 50 damage
export const performPlayerSpecial = (
  player: Character,
  opponent: Character,
  addComment: CommentHandler
): { updatedPlayer: Character, updatedOpponent: Character, endTurn: boolean } => {
  // Get random special attack comment
  const specialComment = playerSpecialComments[Math.floor(Math.random() * playerSpecialComments.length)];
  
  // Calculate damage (30-50 range)
  const damage = Math.floor(Math.random() * 21) + 30; // 30-50 damage
  
  // Add attack comments
  addComment(player.name, specialComment);
  addComment("システム", `とおるのとくぎ！そーそーは${damage}のダメージを受けた！`, true);
  
  // Apply damage to opponent
  const updatedOpponent = {
    ...opponent,
    currentHp: Math.max(0, opponent.currentHp - damage)
  };
  
  return { updatedPlayer: player, updatedOpponent, endTurn: true };
};

// Handle running away
export const performRunAway = (
  player: Character,
  addComment: CommentHandler
): { updatedPlayer: Character, endTurn: boolean } => {
  // Add escape comment
  addComment(player.name, "逃げよう...");
  addComment("システム", "とおるは逃げようとしたが、漢として本当に逃げていいのか、逃げた先にいったい何がある？ここで逃げたら俺は一生逃げ続ける。不毛でも立ち向かわなければならない。無駄だとしても、踏ん張らなければあかん時があるやろ！！と思いなおし、自分の頬を思いっきりビンタした。とおるは10のダメージを受けた。", true);
  
  // Player damages himself
  const updatedPlayer = {
    ...player,
    currentHp: Math.max(0, player.currentHp - 10)
  };
  
  return { updatedPlayer, endTurn: true };
};

// Handle drinking highball
export const performHighball = (
  player: Character,
  addComment: CommentHandler
): { updatedPlayer: Character, highballMode: boolean, endTurn: boolean } => {
  // Check if player's HP is less than half
  if (player.currentHp < player.maxHp / 2) {
    // Full recovery when HP is low
    addComment(player.name, "ぐびぐび、うへぇ～、もう一杯お願いします。メガで。");
    addComment("システム", "一周まわって、とおるは力がみなぎってきた。\nとおるの体力は全回復した", true);
    
    // Restore player's HP
    const updatedPlayer = {
      ...player,
      currentHp: player.maxHp
    };
    
    return { updatedPlayer, highballMode: false, endTurn: true };
  } else {
    // Normal highball effect
    addComment(player.name, "ぐびぐび、うへぇ～、もう一杯お願いします。メガで。");
    
    // Random highball effect
    const effectIdx = Math.floor(Math.random() * highballEffects.length);
    addComment("システム", highballEffects[effectIdx], true);
    
    // Player damages himself
    const updatedPlayer = {
      ...player,
      currentHp: Math.max(0, player.currentHp - 10)
    };
    
    // Set highball mode if drinking made player confused
    const newHighballMode = effectIdx === 2;
    
    return { updatedPlayer, highballMode: newHighballMode, endTurn: true };
  }
};

// Handle opponent's attack
export const performOpponentAttack = (
  player: Character,
  opponent: Character,
  addComment: CommentHandler
): { updatedPlayer: Character, endTurn: boolean } => {
  // Get random attack comment
  const attackComment = opponent1AttackComments[Math.floor(Math.random() * opponent1AttackComments.length)];
  
  // Calculate damage
  const damage = Math.floor(Math.random() * (opponent.attackMax - opponent.attackMin + 1)) + opponent.attackMin;
  
  // Add attack comments
  addComment(opponent.name, attackComment);
  addComment("システム", `そーそーの攻撃、とおるは${damage}のダメージを受けた`, true);
  
  // Apply damage to player
  const updatedPlayer = {
    ...player,
    currentHp: Math.max(0, player.currentHp - damage)
  };
  
  return { updatedPlayer, endTurn: true };
};

// Handle soso heal with fixed 10 points
export const performSosoHeal = (
  opponent: Character,
  addComment: CommentHandler
): { updatedOpponent: Character, endTurn: boolean } => {
  // Add heal comments
  addComment(opponent.name, "あー、生きるってむずかしいんだよなー、株クラのみんな上がってきてよ");
  addComment("システム", "ラムダがコラボに参加した、松嶋ことがコラボに参加した。そーそーの体力が10回復した", true);
  
  // Heal opponent - fixed at 10 points
  const updatedOpponent = {
    ...opponent,
    currentHp: Math.min(opponent.maxHp, opponent.currentHp + 10)
  };
  
  return { updatedOpponent, endTurn: true };
};
