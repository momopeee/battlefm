
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MobileContainer from '@/components/MobileContainer';
import AudioPlayer from '@/components/AudioPlayer';
import { useApp } from '@/context/AppContext';
import { INDEX_BGM, BUTTON_SOUND } from '@/constants/audioUrls';

// アプリケーションのバージョン
const APP_VERSION = "Ver.3.167.0";

const Index = () => {
  const { bgmEnabled, toggleBgm } = useApp();
  const [buttonSound, setButtonSound] = useState<string | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  
  // Add user interaction logging and audio unblocking
  useEffect(() => {
    console.log("Index page loaded. BGM enabled:", bgmEnabled);
    
    // Attempt to unblock audio context with a silent audio element
    const unblockAudio = () => {
      console.log("Attempting to unblock audio context");
      const silentAudio = new Audio();
      silentAudio.play().then(() => {
        console.log("Audio context unblocked by user interaction");
        setUserInteracted(true);
        silentAudio.pause();
      }).catch(err => {
        console.log("Could not unblock audio context:", err);
      });
    };
    
    // Add event listener to unblock audio on first user interaction
    const handleUserInteraction = () => {
      unblockAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    
    // Preload important audio files
    const preloadAudios = [INDEX_BGM, BUTTON_SOUND];
    preloadAudios.forEach(url => {
      const audio = new Audio();
      audio.src = url;
      console.log(`Preloading audio: ${url}`);
    });
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [bgmEnabled]);

  // Handle button click with sound
  const handleStartClick = () => {
    setButtonSound(BUTTON_SOUND);
    // Provide enough time for sound to play before potential navigation
    setTimeout(() => setButtonSound(null), 2000);
  };
  
  return (
    <MobileContainer
      backgroundClassName="bg-[#0a0a0a]"
      backgroundImage="/lovable-uploads/c8b9a8dd-129e-4ba6-ba66-c03a253d63f7.png"
      pcBackgroundColor="#0B0B0B"
    >
      {/* Index page BGM */}
      <AudioPlayer 
        src={INDEX_BGM} 
        loop={true} 
        autoPlay={true} 
        volume={0.7}
        id="index-bgm"
      />
      
      {/* Button sound effect player */}
      {buttonSound && (
        <AudioPlayer 
          src={buttonSound} 
          loop={false} 
          autoPlay={true} 
          volume={0.7}
          id="button-sound" 
        />
      )}

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

export default Index;
