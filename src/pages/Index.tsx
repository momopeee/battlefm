
import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MobileContainer from '@/components/MobileContainer';
import { useApp } from '@/context/AppContext';
import { INDEX_BGM, BUTTON_SOUND } from '@/constants/audioUrls';
import { preloadAudio, preloadMultipleAudio } from '@/utils/audioPreloader';

// Lazy load non-critical components
const AudioPlayer = lazy(() => import('@/components/AudioPlayer'));

// Cache logo image URL for reference
const LOGO_IMAGE = "/lovable-uploads/c8b9a8dd-129e-4ba6-ba66-c03a253d63f7.png";

// アプリケーションのバージョン
const APP_VERSION = "Ver.3.383.0";

const Index = () => {
  const { bgmEnabled, toggleBgm } = useApp();
  const [buttonSound, setButtonSound] = useState<string | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);
  
  // オーディオコンテキストをアンブロックする関数
  const unblockAudio = useCallback(() => {
    if (userInteracted) return;
    
    console.log("Attempting to unblock audio context");
    const silentAudio = new Audio();
    silentAudio.play().then(() => {
      console.log("Audio context unblocked by user interaction");
      setUserInteracted(true);
      silentAudio.pause();
      silentAudio.src = "";
    }).catch(err => {
      console.log("Could not unblock audio context:", err);
    });
  }, [userInteracted]);
  
  // Optimized initialization
  useEffect(() => {
    console.log("Index page loaded. BGM enabled:", bgmEnabled);
    
    // Event listeners with once option
    document.addEventListener('click', unblockAudio, { once: true });
    document.addEventListener('touchstart', unblockAudio, { once: true });
    
    // Strategic preloading of critical audio
    preloadAudio(INDEX_BGM, 'high');
    preloadAudio(BUTTON_SOUND, 'high');
    
    // Preload the logo image
    const logoImg = new Image();
    logoImg.onload = () => setIsLogoLoaded(true);
    logoImg.src = LOGO_IMAGE;
    
    return () => {
      document.removeEventListener('click', unblockAudio);
      document.removeEventListener('touchstart', unblockAudio);
    };
  }, [bgmEnabled, unblockAudio]);

  const handleStartClick = useCallback(() => {
    setButtonSound(BUTTON_SOUND);
    setTimeout(() => setButtonSound(null), 300);
  }, []);
  
  return (
    <MobileContainer
      backgroundClassName="bg-[#0a0a0a]"
      backgroundImage={LOGO_IMAGE}
      pcBackgroundColor="#0B0B0B"
    >
      {/* Conditionally render AudioPlayer only when needed */}
      <Suspense fallback={null}>
        {bgmEnabled && (
          <AudioPlayer 
            src={INDEX_BGM} 
            loop={true} 
            autoPlay={userInteracted}
            volume={0.7}
            id="index-bgm"
          />
        )}
        
        {buttonSound && (
          <AudioPlayer 
            src={buttonSound} 
            loop={false} 
            autoPlay={true} 
            volume={0.7}
            id="button-sound" 
            key={`button-sound-${Date.now()}`}
          />
        )}
      </Suspense>

      <div className="flex flex-col items-center justify-between h-full px-4 py-8">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center flex flex-col items-center justify-center gap-6 sm:gap-10">
            {/* Logo with width and height to prevent CLS */}
            <img 
              src={LOGO_IMAGE} 
              alt="battle.fm" 
              className="w-48 sm:w-64 md:w-80 mb-6 sm:mb-10"
              width="320"
              height="320"
              loading="eager"
              style={{ aspectRatio: '1/1' }}
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

// Memoize the component to prevent unnecessary re-renders
export default React.memo(Index);
