
type CommentHandler = (author: string, text: string, isSystem?: boolean) => void;
type SoundHandler = (sound: string | null) => void;
type ScreenHandler = (screen: string) => void;

// Handle victory
export const handleVictory = (
  addComment: CommentHandler,
  setSoundEffect: SoundHandler,
  handleScreenTransition: ScreenHandler
) => {
  setSoundEffect("/audios/syouri.mp3");
  
  // Add victory comments
  addComment("システム", "とおるが勝利した、そーそーは破れかぶれになってクソリプを量産してしまった", true);
  
  setTimeout(() => addComment("システム", "とおるは400の経験値を得た、とおるはレベルが上がった", true), 3000);
  setTimeout(() => addComment("システム", "とおるは祝いの美酒に酔いしれた", true), 6000);
  setTimeout(() => addComment("システム", "とおるは祝いの美酒の効果で痛風が悪化した、80のダメージ", true), 9000);
  
  // 最後のシステムメッセージから5秒後に遷移
  setTimeout(() => {
    addComment("システム", "ライブが終了しました", true);
    
    // 5秒後に勝利画面へ遷移
    setTimeout(() => {
      handleScreenTransition('victory1');
    }, 5000);
  }, 12000);
};

// Handle defeat
export const handleDefeat = (
  addComment: CommentHandler,
  setSoundEffect: SoundHandler,
  handleScreenTransition: ScreenHandler
) => {
  setSoundEffect("/audios/orehamou.mp3");
  
  // Add defeat comments
  addComment("システム", "とおるが敗北した、そーそーは歯止めが利かなくなってしまった", true);
  
  setTimeout(() => addComment("システム", "とおるは4000の経験値を得た", true), 3000);
  setTimeout(() => addComment("システム", "とおるは敗北からも学べる男だった", true), 6000);
  setTimeout(() => addComment("システム", "とおるはレベルが上がった", true), 9000);
  setTimeout(() => addComment("システム", "とおるは敗北の美酒に酔いしれた", true), 12000);
  
  // 最後のシステムメッセージから5秒後に遷移
  setTimeout(() => {
    addComment("システム", "とおるは敗北の美酒の効果で痛風が悪化した、530000のダメージ", true);
    
    // 5秒後に敗北画面へ遷移
    setTimeout(() => {
      addComment("システム", "ライブが終了しました", true);
      
      // さらに5秒後に敗北画面へ遷移
      setTimeout(() => {
        handleScreenTransition('endingB');
      }, 5000);
    }, 3000);
  }, 15000);
};
