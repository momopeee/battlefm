
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MobileContainer from '@/components/MobileContainer';
import AudioPlayer from '@/components/AudioPlayer';
import { useApp } from '@/context/AppContext';
import { INDEX_BGM, BUTTON_SOUND } from '@/constants/audioUrls';

// Declare audioCache on window
declare global {
  interface Window {
    audioCache?: Record<string, HTMLAudioElement>;
  }
}

// アプリケーションのバージョン
const APP_VERSION = "Ver.3.167.0";

const Index = () => {
  const { bgmEnabled, toggleBgm } = useApp();
  const [buttonSound, setButtonSound] = useState<string | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  
  // オーディオコンテキストをアンブロックする関数 - useCallbackを使用して関数を定義
  const unblockAudio = useCallback(() => {
    if (userInteracted) return; // 既にアンブロック済みならスキップ
    
    console.log("Attempting to unblock audio context");
    const silentAudio = new Audio();
    silentAudio.play().then(() => {
      console.log("Audio context unblocked by user interaction");
      setUserInteracted(true);
      silentAudio.pause();
      silentAudio.src = ""; // Clear source
    }).catch(err => {
      console.log("Could not unblock audio context:", err);
    });
  }, [userInteracted]);
  
  // ユーザー操作とオーディオアンブロック処理を最適化
  useEffect(() => {
    console.log("Index page loaded. BGM enabled:", bgmEnabled);
    
    // イベントリスナーを最適化 - { once: true } オプションを使用
    document.addEventListener('click', unblockAudio, { once: true });
    document.addEventListener('touchstart', unblockAudio, { once: true });
    
    // プリロードを最適化 - 必要なファイルだけをプリロード
    const preloadAudio = (url: string) => {
      // オーディオをキャッシュして再利用するようにする
      if (!window.audioCache) {
        window.audioCache = {};
      }
      
      if (!window.audioCache[url]) {
        const audio = new Audio();
        audio.src = url;
        audio.preload = "auto"; // 明示的にプリロードを指示
        window.audioCache[url] = audio;
        console.log(`Preloading audio: ${url}`);
      }
    };
    
    // 重要なオーディオファイルのみをプリロード
    preloadAudio(INDEX_BGM);
    preloadAudio(BUTTON_SOUND);
    
    return () => {
      document.removeEventListener('click', unblockAudio);
      document.removeEventListener('touchstart', unblockAudio);
    };
  }, [bgmEnabled, unblockAudio]); // Add unblockAudio to dependency array

  // クリックハンドラをメモ化して不要な再生成を防ぐ
  const handleStartClick = useCallback(() => {
    setButtonSound(BUTTON_SOUND);
    // Provide enough time for sound to play before potential navigation
    setTimeout(() => setButtonSound(null), 300);
  }, []);
  
  return (
    <MobileContainer
      backgroundClassName="bg-[#0a0a0a]"
      backgroundImage="/lovable-uploads/c8b9a8dd-129e-4ba6-ba66-c03a253d63f7.png"
      pcBackgroundColor="#0B0B0B"
    >
      {/* AudioPlayerをメモ化コンポーネントにしたことで再レンダリングを最適化 */}
      <AudioPlayer 
        src={INDEX_BGM} 
        loop={true} 
        autoPlay={true} 
        volume={0.7}
        id="index-bgm"
      />
      
      {/* ボタン効果音プレーヤー - 必要な時だけレンダリング */}
      {buttonSound && (
        <AudioPlayer 
          src={buttonSound} 
          loop={false} 
          autoPlay={true} 
          volume={0.7}
          id="button-sound" 
          key={`button-sound-${Date.now()}`} // Force remount when sound changes
        />
      )}

      {/* 以下は既存コードを維持 */}
      <div className="flex flex-col items-center justify-between h-full px-4 py-8">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center flex flex-col items-center justify-center gap-6 sm:gap-10">
            {/* Logo */}
            <img 
              src="/lovable-uploads/c8b9a8dd-129e-4ba6-ba66-c03a253d63f7.png" 
              alt="battle.fm" 
              className="w-48 sm:w-64 md:w-80 mb-6 sm:mb-10"
            />
            
            <Button 
              asChild
              className="w-48 sm:w-64 text-base sm:text-lg py-4 sm:py-6 bg-pink-500 hover:bg-pink-600 rounded-full font-bold"
              onClick={handleStartClick}
            >
              <Link to="/start">スタート</Link>
            </Button>
          </div>
        </div>
        
        {/* Version info in footer with grey text */}
        <div className="mt-auto pb-4">
          <span className="text-[11px] text-gray-500">{APP_VERSION}</span>
        </div>
      </div>
    </MobileContainer>
  );
};

// メモ化してパフォーマンスを向上
export default React.memo(Index);
