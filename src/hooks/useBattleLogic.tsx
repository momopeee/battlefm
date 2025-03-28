import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useBattleActions } from './battle/useBattleActions';
import { useBattleResults } from './battle/useBattleResults';

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
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);
  const [specialSkillMessageDisplayed, setSpecialSkillMessageDisplayed] = useState(false);
  
  // 追加: アクション進行中の状態とタイマー参照
  const [actionInProgress, setActionInProgress] = useState(false);
  const [lastActionTime, setLastActionTime] = useState(0);
  const [actionTimers, setActionTimers] = useState<NodeJS.Timeout[]>([]);

  const { handleVictory, handleDefeat, handleSkip: handleSkipResult, clearAllTimers } = useBattleResults({
    addComment,
    handleScreenTransition,
    setIsBattleOver,
    setTransitionScheduled,
    setIsPlayerVictory,
    setShowSkipButton,
    setRedirectTimer,
    setBattleResult
  });

  const {
    handlePlayerAttack,
    handlePlayerSpecial,
    handleRunAway,
    handleHighball,
    handleOpponentAttack,
    handleSosoHeal
  } = useBattleActions({
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
  });

  // 追加: タイマーを追跡して後でクリーンアップできるようにする関数
  const addActionTimer = useCallback((timer: NodeJS.Timeout) => {
    setActionTimers(prev => [...prev, timer]);
  }, []);

  // 追加: すべてのアクションタイマーをクリーンアップする関数
  const clearActionTimers = useCallback(() => {
    actionTimers.forEach(timer => clearTimeout(timer));
    setActionTimers([]);
  }, [actionTimers]);

  // 追加: アクションのデバウンス処理を行う関数
  const handleActionWithDebounce = useCallback((action: () => void) => {
    const now = Date.now();
    // 最後のアクションから300ms以内の場合は無視
    if (actionInProgress || now - lastActionTime < 300) return;
    
    setActionInProgress(true);
    setLastActionTime(now);
    
    // アクションを実行する前に短いタイムアウトを設定
    const actionTimer = setTimeout(() => {
      action();
      // アクション完了後にフラグをリセット
      const resetTimer = setTimeout(() => {
        setActionInProgress(false);
      }, 500);
      addActionTimer(resetTimer);
    }, 100);
    
    addActionTimer(actionTimer);
  }, [actionInProgress, lastActionTime, addActionTimer]);

  // 追加: デバウンス処理を適用した各アクションハンドラ
  const handlePlayerAttackWithDebounce = useCallback(() => {
    handleActionWithDebounce(() => handlePlayerAttack());
  }, [handleActionWithDebounce, handlePlayerAttack]);

  const handlePlayerSpecialWithDebounce = useCallback(() => {
    handleActionWithDebounce(() => handlePlayerSpecial());
  }, [handleActionWithDebounce, handlePlayerSpecial]);

  const handleRunAwayWithDebounce = useCallback(() => {
    handleActionWithDebounce(() => handleRunAway());
  }, [handleActionWithDebounce, handleRunAway]);

  const handleHighballWithDebounce = useCallback(() => {
    handleActionWithDebounce(() => handleHighball());
  }, [handleActionWithDebounce, handleHighball]);

  const handleSkipWithDebounce = useCallback(() => {
    if (!isBattleOver) return;
    
    handleActionWithDebounce(() => {
      clearAllTimers();
      setTransitionScheduled(true);
      handleSkipResult(isPlayerVictory, redirectTimer);
    });
  }, [isBattleOver, handleActionWithDebounce, clearAllTimers, setTransitionScheduled, handleSkipResult, isPlayerVictory, redirectTimer]);

  useEffect(() => {
    clearAllTimers();
    clearActionTimers(); // 追加: アクションタイマーもクリーンアップ
    clearComments();
    resetBattleTimer();
    startBattleTimer();
    setIsBattleStarted(true);
    setIsBattleOver(false);
    setIsPlayerVictory(null);
    setBattleResult(null);
    setActionInProgress(false); // 追加: アクション進行中フラグをリセット
    setLastActionTime(0); // 追加: 最後のアクション時間をリセット
   
    setPlayer({
      ...player,
      currentHp: player.maxHp,
      attackMin: 15,
      attackMax: 30,
      specialPower: 50
    });
   
    setOpponent1({
      ...opponent1,
      currentHp: opponent1.maxHp,
      attackMin: 5,
      attackMax: 15,
      specialPower: 0
    });
   
    setAttackCount(0);
    setSpecialAttackAvailable(false);
    setHighballMode(false);
    setSosoHealMode(false);
    setTransitionScheduled(false);
    setShowSkipButton(false);
    setSpecialSkillMessageDisplayed(false);
   
    console.log("Battle1 initialized with fresh state: Player HP=" + player.maxHp + ", Opponent HP=" + opponent1.maxHp);
   
    addComment("システム", "バトル開始！ さよならクソリプそーそー！", true);
   
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isPlayerTurn && isBattleStarted && !isBattleOver) {
      const opponentTimer = setTimeout(() => {
        if (sosoHealMode) {
          handleSosoHeal();
        } else {
          handleOpponentAttack();
        }
      }, 1500);
      
      addActionTimer(opponentTimer); // 追加: タイマーを追跡
     
      return () => clearTimeout(opponentTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlayerTurn, isBattleStarted, isBattleOver, sosoHealMode]);

  useEffect(() => {
    if ((player.currentHp <= 0 || opponent1.currentHp <= 0) && !isBattleOver && !transitionScheduled) {
      setIsBattleOver(true);
     
      if (player.currentHp <= 0) {
        setIsPlayerVictory(false);
        handleDefeat();
      } else if (opponent1.currentHp <= 0) {
        setIsPlayerVictory(true);
        handleVictory();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.currentHp, opponent1.currentHp]);

  useEffect(() => {
    if (opponent1.currentHp <= 30 && !sosoHealMode && !isBattleOver && !specialSkillMessageDisplayed) {
      setSosoHealMode(true);
      setSpecialSkillMessageDisplayed(true);
     
      addComment("システム", "そーそーがとくぎ「強制コラボ召喚」を発動した", true);
     
      const timer1 = setTimeout(() => {
        addComment(opponent1.name, "あー、生きるのってむずかしいんだよなー、株クラのみんなも上がろうよ", false);
      }, 1000);
      
      addActionTimer(timer1); // 追加: タイマーを追跡
     
      const timer2 = setTimeout(() => {
        addComment("システム", "ラムダがコラボに参加した、松嶋ことがコラボに参加した", true);
      }, 2000);
      
      addActionTimer(timer2); // 追加: タイマーを追跡
    }
  }, [opponent1.currentHp, sosoHealMode, isBattleOver, specialSkillMessageDisplayed, addComment, opponent1.name, addActionTimer]);

  useEffect(() => {
    let skipButtonTimer: NodeJS.Timeout | null = null;
   
    if (isBattleOver && isPlayerVictory === true) {
      skipButtonTimer = setTimeout(() => {
        setShowSkipButton(true);
      }, 10000);
      
      if (skipButtonTimer) addActionTimer(skipButtonTimer); // 追加: タイマーを追跡
    } else if (isBattleOver && isPlayerVictory === false) {
      skipButtonTimer = setTimeout(() => {
        setShowSkipButton(true);
      }, 15000);
      
      if (skipButtonTimer) addActionTimer(skipButtonTimer); // 追加: タイマーを追跡
    }
   
    return () => {
      if (skipButtonTimer) clearTimeout(skipButtonTimer);
    };
  }, [isBattleOver, isPlayerVictory, addActionTimer]);

  useEffect(() => {
    return () => {
      clearAllTimers();
      clearActionTimers(); // 追加: アクションタイマーもクリーンアップ
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [redirectTimer, clearAllTimers, clearActionTimers]);

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
    battleResult,
    actionInProgress, // 追加: アクション進行中の状態を公開
    handlePlayerAttack: handlePlayerAttackWithDebounce, // 変更: デバウンス処理を適用したハンドラを返す
    handlePlayerSpecial: handlePlayerSpecialWithDebounce, // 変更: デバウンス処理を適用したハンドラを返す
    handleRunAway: handleRunAwayWithDebounce, // 変更: デバウンス処理を適用したハンドラを返す
    handleHighball: handleHighballWithDebounce, // 変更: デバウンス処理を適用したハンドラを返す
    handleCharacterClick,
    setShowCharacterSheet,
    handleSkip: handleSkipWithDebounce // 変更: デバウンス処理を適用したハンドラを返す
  };
};
