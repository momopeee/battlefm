
import React, { useRef, useEffect, useState, useCallback } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import { ATTACK_SOUND, SPECIAL_SOUND, RUN_AWAY_SOUND, HIGHBALL_SOUND } from '@/constants/audioUrls';

interface BattleActionsProps {
  isPlayerTurn: boolean;
  isBattleOver: boolean;
  specialAttackAvailable: boolean;
  onAttack: () => void;
  onSpecial: () => void;
  onRunAway: () => void;
  onHighball: () => void;
}

const BattleActions: React.FC<BattleActionsProps> = ({
  isPlayerTurn,
  isBattleOver,
  specialAttackAvailable,
  onAttack,
  onSpecial,
  onRunAway,
  onHighball
}) => {
  // 状態とキーを組み合わせて効率化
  const [soundToPlay, setSoundToPlay] = useState<{ src: string | null, key: number }>({ 
    src: null, 
    key: 0 
  });
  
  // アクション進行中を追跡
  const [actionInProgress, setActionInProgress] = useState(false);
  
  // タイマー参照を保持してクリーンアップを確実に
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ボタンアニメーション関数をメモ化
  const handleButtonAnimation = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.classList.remove('animate');
    void btn.offsetWidth; // Force reflow to enable re-animation
    btn.classList.add('animate');
    
    // アニメーション終了時にクラスを削除
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => btn.classList.remove('animate'), 700);
  }, []);

  // アクションハンドラをメモ化して再レンダリングを減らす
  const handleActionWithSound = useCallback((e: React.MouseEvent<HTMLButtonElement>, soundSrc: string, action: () => void) => {
    if (actionInProgress) return;
    
    handleButtonAnimation(e);
    setSoundToPlay({ src: soundSrc, key: Date.now() });
    setActionInProgress(true);
    
    // アクション実行前に小さい遅延
    const actionTimer = setTimeout(() => {
      action();
      // アクション進行中状態をリセット
      const resetTimer = setTimeout(() => setActionInProgress(false), 500);
      // タイマー参照を保存してクリーンアップできるように
      timerRef.current = resetTimer;
    }, 100);
    timerRef.current = actionTimer;
  }, [actionInProgress, handleButtonAnimation]);

  // 個別のクリックハンドラをメモ化
  const handleAttackClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    handleActionWithSound(e, ATTACK_SOUND, onAttack);
  }, [handleActionWithSound, onAttack]);

  const handleSpecialClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    handleActionWithSound(e, SPECIAL_SOUND, onSpecial);
  }, [handleActionWithSound, onSpecial]);

  const handleRunAwayClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    handleActionWithSound(e, RUN_AWAY_SOUND, onRunAway);
  }, [handleActionWithSound, onRunAway]);

  const handleHighballClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    handleActionWithSound(e, HIGHBALL_SOUND, onHighball);
  }, [handleActionWithSound, onHighball]);

  // サウンド再生後のリセット - タイマーの参照を保持して確実にクリーンアップ
  useEffect(() => {
    if (soundToPlay.src) {
      timerRef.current = setTimeout(() => {
        setSoundToPlay({ src: null, key: soundToPlay.key });
      }, 2000);
      
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [soundToPlay]);

  // サウンド終了ハンドラをメモ化
  const handleSoundEnded = useCallback(() => {
    console.log(`Sound effect completed`);
  }, []);

  // メモ化したボタン無効状態
  const isAttackDisabled = !isPlayerTurn || isBattleOver || actionInProgress;
  const isSpecialDisabled = !isPlayerTurn || isBattleOver || !specialAttackAvailable || actionInProgress;
  const isOtherDisabled = !isPlayerTurn || isBattleOver || actionInProgress;

  return (
    <>
      {/* サウンドエフェクトプレーヤー - 必要な時だけレンダリング */}
      {soundToPlay.src && (
        <AudioPlayer 
          src={soundToPlay.src} 
          loop={false} 
          autoPlay={true} 
          volume={0.7} 
          key={`sound-effect-${soundToPlay.key}`} 
          id="battle-action-sound"
          onEnded={handleSoundEnded}
        />
      )}
      
      <div className="grid grid-cols-4 gap-2 mb-2">
        <button 
          onClick={handleAttackClick} 
          disabled={isAttackDisabled}
          className={`battle-action-button text-[11px] whitespace-nowrap ${isAttackDisabled ? 'opacity-60' : ''}`}
        >
          こうげき
        </button>
        
        <button 
          onClick={handleSpecialClick} 
          disabled={isSpecialDisabled}
          className={`battle-action-button text-[11px] whitespace-nowrap ${isSpecialDisabled ? 'opacity-60' : ''} ${specialAttackAvailable ? 'bg-pink-500 hover:bg-pink-600' : ''}`}
        >
          とくぎ
        </button>
        
        <button 
          onClick={handleRunAwayClick} 
          disabled={isOtherDisabled}
          className={`battle-action-button text-[11px] whitespace-nowrap ${isOtherDisabled ? 'opacity-60' : ''}`}
        >
          にげる
        </button>
        
        <button 
          onClick={handleHighballClick} 
          disabled={isOtherDisabled}
          className={`battle-action-button text-[11px] whitespace-nowrap ${isOtherDisabled ? 'opacity-60' : ''}`}
        >
          ハイボール
        </button>
      </div>
    </>
  );
};

// メモ化してレンダリングパフォーマンスを最適化
export default React.memo(BattleActions);
