
import React, { useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';

interface AudioPlayerProps {
  src: string;
  loop?: boolean;
  autoPlay?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, loop = false, autoPlay = true }) => {
  const { bgmEnabled } = useApp();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (bgmEnabled) {
      audio.volume = 0.5;
      
      // Add a small delay before playing to ensure the audio is loaded
      const playTimer = setTimeout(() => {
        audio.play().catch(error => {
          console.error("Audio play failed:", error);
        });
      }, 100);
      
      return () => clearTimeout(playTimer);
    } else {
      audio.pause();
    }
  }, [bgmEnabled, src]);
  
  // Log loading events for debugging
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleError = (e: ErrorEvent) => {
      console.error("Audio loading error:", e);
    };
    
    const handleLoadedData = () => {
      console.log("Audio loaded successfully:", src);
    };
    
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadeddata', handleLoadedData);
    
    return () => {
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [src]);
  
  // Ensure the src path is properly formed - handle both absolute and relative paths
  const audioSrc = src.startsWith('http') 
    ? src 
    : src.startsWith('/') 
      ? src.substring(1) // Remove leading slash if present
      : src;
  
  return (
    <audio 
      ref={audioRef}
      src={audioSrc}
      loop={loop}
      preload="auto"
      className="hidden"
    />
  );
};

export default AudioPlayer;
