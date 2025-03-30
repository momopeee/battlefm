import { Character } from '@/context/AppContext';
import { playerAttackComments, playerSpecialComments, opponent1AttackComments, sosoCollaborationComments } from '@/constants/battleComments';

type BattleActionProps = {
  player: Character;
  setPlayer: React.Dispatch<React.SetStateAction<Character>>;
  opponent1: Character;
  setOpponent1: React.Dispatch<React.SetStateAction<Character>>;
  attackCount: number;
  setAttackCount: React.Dispatch<React.SetStateAction<number>>;
  isPlayerTurn: boolean;
  setIsPlayerTurn: React.Dispatch<React.SetStateAction<boolean>>;
  isBattleOver: boolean;
  highballMode: boolean;
  setHighballMode: React.Dispatch<React.SetStateAction<boolean>>;
  specialAttackAvailable: boolean;
  setSpecialAttackAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  sosoHealMode: boolean;
  addComment: (author: string, text: string, isSystem?: boolean) => void;
  handleDefeat: () => void;
};

// Unified timer management with a queue-based approach
export const useBattleActions = ({
  player,
  setPlayer,
  opponent1,
  setOpponent1,
  attackCount,
  setAttackCount,
  isPlayerTurn,
  setIsPlayerTurn,
  isBattleOver,
  highballMode,
  setHighballMode,
  specialAttackAvailable,
  setSpecialAttackAvailable,
  sosoHealMode,
  addComment,
  handleDefeat
}: BattleActionProps) => {
  
  // Helper function to ensure proper sequencing of actions with time delays
  const sequenceActions = (actions: Array<[() => void, number]>): void => {
    if (actions.length === 0) return;
    
    const [action, delay] = actions[0];
    const remainingActions = actions.slice(1);
    
    // Execute the current action
    action();
    
    // If no more actions, we're done
    if (remainingActions.length === 0) return;
    
    // Otherwise, schedule the next action after the delay
    setTimeout(() => {
      sequenceActions(remainingActions);
    }, delay);
  };
  
  // Handle player attack - damage range 15-30
  const handlePlayerAttack = () => {
    if (isBattleOver || !isPlayerTurn) return;
    
    // Increase attack count for special attack
    const newAttackCount = attackCount + 1;
    setAttackCount(newAttackCount);
    
    // Enable special attack after 3 regular attacks
    if (newAttackCount >= 3 && !specialAttackAvailable) {
      setSpecialAttackAvailable(true);
    }
    
    // Special handling for highball mode
    if (highballMode) {
      sequenceActions([
        [() => addComment(player.name, "え？ちょっとまって、なに？なに？ちょっとまって？えっ？"), 0],
        [() => addComment("システム", "何を言っているのか分からない。とおるは酔っぱらっているようだ。\nとおるは10のダメージを受けた", true), 300],
        [() => {
          // Player damages himself
          setPlayer({
            ...player,
            currentHp: Math.max(0, player.currentHp - 10)
          });
          
          // Reset highball mode
          setHighballMode(false);
          
          // End player's turn only after all effects are applied
          setIsPlayerTurn(false);
        }, 600]
      ]);
      
      return;
    }
    
    // Get random attack comment
    const attackComment = playerAttackComments[Math.floor(Math.random() * playerAttackComments.length)];
    
    // Normal attack damage calculation - 15 to 30 damage
    const damage = Math.floor(Math.random() * (player.attackMax - player.attackMin + 1)) + player.attackMin;
    
    sequenceActions([
      [() => addComment(player.name, attackComment), 0],
      [() => addComment("システム", `とおるの攻撃、そーそーは${damage}のダメージを受けた`, true), 300],
      [() => {
        // Apply damage to opponent
        setOpponent1({
          ...opponent1,
          currentHp: Math.max(0, opponent1.currentHp - damage)
        });
        
        // End player's turn only after all effects are applied
        setIsPlayerTurn(false);
      }, 600]
    ]);
  };

  // Handle player special attack - 30 to 50 damage
  const handlePlayerSpecial = () => {
    if (isBattleOver || !isPlayerTurn || !specialAttackAvailable) return;
    
    // Get random special attack comment
    const specialComment = playerSpecialComments[Math.floor(Math.random() * playerSpecialComments.length)];
    
    // Calculate damage (30-50 range)
    const damage = Math.floor(Math.random() * 21) + 30; // 30-50 damage
    
    sequenceActions([
      [() => addComment(player.name, specialComment), 0],
      [() => addComment("システム", `とおるのとくぎ！そーそーは${damage}のダメージを受けた！`, true), 300],
      [() => {
        // Apply damage to opponent
        setOpponent1({
          ...opponent1,
          currentHp: Math.max(0, opponent1.currentHp - damage)
        });
        
        // Reset special attack availability and count
        setSpecialAttackAvailable(false);
        setAttackCount(0);
        
        // End player's turn only after all effects are applied
        setIsPlayerTurn(false);
      }, 600]
    ]);
  };

  // Handle running away
  const handleRunAway = () => {
    if (isBattleOver || !isPlayerTurn) return;
    
    sequenceActions([
      [() => addComment(player.name, "逃げよう..."), 0],
      [() => addComment("システム", "とおるは逃げようとしたが、漢として本当に逃げていいのか、逃げた先にいったい何がある？ここで逃げたら俺は一生逃げ続ける。不毛でも立ち向かわなければならない。無駄だとしても、踏ん張らなければあかん時があるやろ！！と思いなおし、自分の頬を思いっきりビンタした。とおるは10のダメージを受けた。", true), 300],
      [() => {
        // Player damages himself
        setPlayer({
          ...player,
          currentHp: Math.max(0, player.currentHp - 10)
        });
        
        // End player's turn only after all effects are applied
        setIsPlayerTurn(false);
      }, 600]
    ]);
  };

  // Handle drinking highball
  const handleHighball = () => {
    if (isBattleOver || !isPlayerTurn) return;
    
    // Initial comment is the same regardless of HP
    const actions: Array<[() => void, number]> = [
      [() => addComment(player.name, "ぐびぐび、うへぇ～、もう一杯お願いします。メガで。"), 0]
    ];
    
    // Check if player's HP is less than half
    if (player.currentHp < player.maxHp / 2) {
      // Full recovery when HP is low
      actions.push(
        [() => addComment("システム", "一周まわって、とおるは力がみなぎってきた。\nとおるの体力は全回復した", true), 300],
        [() => {
          // Restore player's HP with proper state update
          setPlayer({
            ...player,
            currentHp: player.maxHp
          });
          
          // End player's turn only after all effects are applied
          setIsPlayerTurn(false);
        }, 600]
      );
    } else {
      // Normal highball effect
      // Random highball effect
      const highballEffects = [
        "とおるはハイボールを飲んだ、\nとおるはトイレが近くなった。\nとおるは10のダメージを受けた",
        "とおるはハイボールを飲んだ、\nとおるは眠くなってしまった。\nとおるは10のダメージを受けた",
        "とおるはハイボールを飲んだ、\nとおるは何を言っているのかわからなくなった\nとおるは10のダメージを受けた。"
      ];
      
      const effectIdx = Math.floor(Math.random() * highballEffects.length);
      
      actions.push(
        [() => addComment("システム", highballEffects[effectIdx], true), 300],
        [() => {
          // Player damages himself
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
          
          // End player's turn only after all effects are applied
          setIsPlayerTurn(false);
        }, 600]
      );
    }
    
    sequenceActions(actions);
  };

  // Handle opponent's attack
  const handleOpponentAttack = () => {
    if (isBattleOver) return;
    
    // Get random attack comment
    const attackComment = opponent1AttackComments[Math.floor(Math.random() * opponent1AttackComments.length)];
    
    // Calculate damage
    const damage = Math.floor(Math.random() * (opponent1.attackMax - opponent1.attackMin + 1)) + opponent1.attackMin;
    
    sequenceActions([
      [() => addComment(opponent1.name, attackComment), 0],
      [() => addComment("システム", `そーそーの攻撃、とおるは${damage}のダメージを受けた`, true), 300],
      [() => {
        // Apply damage to player
        setPlayer({
          ...player,
          currentHp: Math.max(0, player.currentHp - damage)
        });
        
        // Start player's turn only after all effects are applied
        setIsPlayerTurn(true);
      }, 600]
    ]);
  };

  // Handle soso heal with new behavior
  const handleSosoHeal = () => {
    if (isBattleOver) return;
    
    // Get random collaboration comment
    const collaborationComment = sosoCollaborationComments[Math.floor(Math.random() * sosoCollaborationComments.length)];
    
    // Heal amount calculation - now fixed at 15
    const healAmount = 15;
    
    // New damage calculation: 10-40 range for そーそー's special attack
    const damageToPlayer = Math.floor(Math.random() * 31) + 10; // 10-40 damage range
    
    sequenceActions([
      [() => addComment(opponent1.name, collaborationComment), 0],
      [() => addComment("システム", `そーそーの体力が${healAmount}回復した`, true), 300],
      [() => addComment("システム", `同時に、とおるは${damageToPlayer}のダメージを受けた`, true), 600],
      [() => {
        // Heal opponent by 15 points
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
        if (newPlayerHp > 0) {
          // Start player's turn if battle continues
          setIsPlayerTurn(true);
        }
        // If player is defeated, the useEffect that watches HP will handle it
      }, 900]
    ]);
  };

  return {
    handlePlayerAttack,
    handlePlayerSpecial,
    handleRunAway,
    handleHighball,
    handleOpponentAttack,
    handleSosoHeal
  };
};
