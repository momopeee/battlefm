import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import CommentArea from '@/components/CommentArea';
import CharacterSheet from '@/components/CharacterSheet';
import AudioPlayer from '@/components/AudioPlayer';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileContainer from '@/components/MobileContainer';
import { useIsMobile } from '@/hooks/use-mobile';

// Import the battle components
import CharacterPortraits from '@/components/battle/CharacterPortraits';
import GaugesDisplay from '@/components/battle/GaugesDisplay';
import BattleActions from '@/components/battle/BattleActions';
import CommentInput from '@/components/battle/CommentInput';
import PlayerInfo from '@/components/battle/PlayerInfo';

// Player attack comments for Yuji battle
const playerAttackComments = [
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

// Player special attack comments for Yuji battle
const playerSpecialComments = [
  "パッションは大事だ、でもパッションだけじゃ薄っぺらい詐欺師と何も変わらないだろ！ゆうじが守りたいものを思い出して、正面からぶつかっていけ！骨は俺が拾う！！",
  "俺達はゆうじが大好きだからいろいろ言うんだ、耳が痛い事もあるだろう、だが逃げるな！何があってもお前の骨は俺が拾う！！！",
  "自らアドバイスを求めたなら、その相手には進捗の報告を怠るな！！俺達はいい、友達だから報告が無くても\"ゆうじは最低だ！！\"で済ませて、その後も仲良く出来る。だが、他の人は違う、一度不義理をしたら一生相手にされないし、下手したら敵になって戻ってくる。良く考えて行動し、軽はずみで他人を使い捨てにするな！！"
];

// UPDATED: Yuji's special attack comments
const yujiSpecialComments = [
  "やまにいは僕の事いじめたいだけですよね、ひどいです",
  "じゅんさんも本当にひどいです",
  "ぜつぼうさんがコラボに上がった時、もう99人コラボやめようと思いました",
  "みんな僕をいじめたいだけだよね、別にいいけど",
  "もういいですよ、何を言われても今まで通りやるだけ",
  "やまにいの言葉よりしいたけ占いのが深いんだよね",
  "式場の利益よりもプランナーの地位向上のが大事なんです、それが分からない式場は全部だめですよ"
];

const Battle2Screen: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { 
    player, 
    opponent2, 
    bgmEnabled, 
    toggleBgm,
    battleTimer,
    startBattleTimer,
    pauseBattleTimer,
    comments,
    attackCount,
    specialAttackAvailable, 
    yujiSpecialMode,
    showCharacterSheet,
    currentCharacterSheet,
    setShowCharacterSheet,
    setCurrentCharacterSheet,
    addComment,
    clearComments,
    setAttackCount,
    setSpecialAttackAvailable,
    setYujiSpecialMode,
    handleScreenTransition,
    // Add these to access player state updates
    setPlayer
  } = useApp();
  
  // Battle state
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [playerHp, setPlayerHp] = useState(player.currentHp);
  const [opponentHp, setOpponentHp] = useState(opponent2.currentHp);
  const [attackInProgress, setAttackInProgress] = useState(false);
  const [soundEffect, setSoundEffect] = useState<string | null>(null);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);
  const [yujiInSpecialMode, setYujiInSpecialMode] = useState(false);
  const [specialModeTimer, setSpecialModeTimer] = useState(0);
  const [specialModeActive, setSpecialModeActive] = useState(false);
  const [isHighballConfused, setIsHighballConfused] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Reset battle state on component mount and start timer
  useEffect(() => {
    clearComments();
    // 初期HPを100に設定
    setPlayerHp(100);
    setOpponentHp(opponent2.currentHp);
    setAttackCount(0);
    setSpecialAttackAvailable(false);
    setYujiSpecialMode(false);
    setYujiInSpecialMode(false);
    setSpecialModeTimer(0);
    setSpecialModeActive(false);
    setIsHighballConfused(false);
    
    // Start the battle timer when component mounts
    startBattleTimer();
    
    // Initial system message
    setTimeout(() => {
      addComment('システム', '第二戦！とおる VS ゆうじ＠陽気なおじさん', true);
      addComment('ゆうじ＠陽気なおじさん', 'どうも～陽気なおじさんでお馴染み、ゆうじです。今日はやまにぃに経営とは何かについて僕なりに指南していきますよ～！');
    }, 1000);
    
    // Cleanup function - pause timer when component unmounts
    return () => {
      pauseBattleTimer();
    };
  }, []);
  
  // 新しい双方向同期ロジック：グローバル状態からローカル状態への同期
  useEffect(() => {
    if (player.currentHp !== playerHp) {
      setPlayerHp(player.currentHp);
    }
  }, [player.currentHp]);
  
  // 新しい双方向同期ロジック：ローカル状態からグローバル状態への同期
  useEffect(() => {
    setPlayer(prev => {
      if (prev.currentHp !== playerHp) {
        return {
          ...prev,
          currentHp: playerHp,
        };
      }
      return prev;
    });
  }, [playerHp, setPlayer]);
  
  // Yuji's attack comments
  const yujiAttackComments = [
    "しいたけ しか勝たん！！俺はしいたけ占いしか信じてないんすよ～",
    "年収1000万目指します、まじで",
    "「やればやるほど、楽しくなっていく」今まさにそんな状態！",
    "佐川の集荷呼ぶだけでこんなに難しいなんて・・・",
    "僕は常にかゆいところに手が届く存在でありたい",
    "2025年以降の目標を立てて、めっちゃワクワクした！",
    "今日の予定？
