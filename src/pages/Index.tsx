
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
  const { bgmEnabled, toggleBgm, userInteracted, setUserInteracted } = useApp();
  const [buttonSound, setButtonSound] = useState<string | null>(null);
  
  // オーディオコンテキストをアンブロックする関数
  const unblockAudio = useCallback(() => {
    setUserInteracted(); // Use the global context method
    
    console.log("Attempting to unblock audio context");
    const silentAudio = new Audio();
    silentAudio.play().then(() => {
      console.log("Audio context unblocked by user interaction");
      silentAudio.pause();
      silentAudio.src = ""; // Clear source
    }).catch(err => {
      console.log("Could not unblock audio context:", err);
    });
  }, [setUserInteracted]);
  
  // ユーザー操作とオーディオアンブロック処理を最適化
  useEffect(() => {
    console.log("Index page loaded. BGM enabled:", bgmEnabled, "User interacted:", userInteracted);
    
    // Use the global interaction flag
    if (!userInteracted) {
      // イベントリスナーを最適化 - { once: true } オプションを使用
      document.addEventListener('click', unblockAudio, { once: true });
      document.addEventListener('touchstart', unblockAudio, { once: true });
    }
    
    // プリロードを非同期化
    const preloadAudio = async (url: string) => {
      // オーディオをキャッシュして再利用するようにする
      if (!window.audioCache) {
        window.audioCache = {};
      }
      
      if (!window.audioCache[url]) {
        const audio = new Audio();
        audio.src = url;
        audio.preload = "auto"; // 明示的にプリロードを指示
        window.audioCache[url] = audio;
        
        try {
          // Audio.load() はプロミスを返さないので、一時的なリスナーでラップ
          await new Promise((resolve, reject) => {
            const loadHandler = () => {
              resolve(true);
              audio.removeEventListener('canplaythrough', loadHandler);
            };
            
            const errorHandler = (e: Event) => {
              reject(new Error('Failed to load audio'));
              audio.removeEventListener('error', errorHandler);
            };
            
            audio.addEventListener('canplaythrough', loadHandler, { once: true });
            audio.addEventListener('error', errorHandler, { once: true });
            
            // 明示的にロードを開始
            audio.load();
          });
          console.log(`Preloaded audio: ${url}`);
        } catch (err) {
          console.error(`Error preloading audio ${url}:`, err);
        }
      }
    };
    
    // 非同期でプリロード処理を実行
    (async () => {
      // 重要なオーディオファイルのみをプリロード
      await Promise.all([
        preloadAudio(INDEX_BGM),
        preloadAudio(BUTTON_SOUND)
      ]);
    })();
    
    return () => {
      document.removeEventListener('click', unblockAudio);
      document.removeEventListener('touchstart', unblockAudio);
    };
  }, [bgmEnabled, unblockAudio, userInteracted]);

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
        autoPlay={userInteracted} // Use the userInteracted flag for autoPlay
        volume={0.7}
        id="index-bgm"
      />
      
      {/* ボタン効果音プレーヤー - 必要な時だけレンダリング */}
      {buttonSound && (
        <AudioPlayer 
          src={buttonSound} 
          loop={false} 
          autoPlay={userInteracted} // Use the userInteracted flag
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
              onClick={() => {
                setUserInteracted(); // Set user interaction when button is clicked
                handleStartClick();
              }}
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
