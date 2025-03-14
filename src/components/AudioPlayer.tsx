
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
  
  // Ensure the src path is properly formed
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
