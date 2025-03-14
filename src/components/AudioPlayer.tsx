
import React, { useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';

interface AudioPlayerProps {
  src: string;
  loop?: boolean;
  autoPlay?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, loop = false, autoPlay = false }) => {
  const { bgmEnabled } = useApp();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (bgmEnabled) {
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.error("Audio play failed:", error);
      });
    } else {
      audio.pause();
    }
    
    // Log when audio is loaded
    audio.onloadeddata = () => {
      console.log("Audio loaded successfully:", src);
    };
    
    // Log any errors
    audio.onerror = (e) => {
      console.error("Audio loading error:", e);
    };
  }, [bgmEnabled, src]);
  
  // Determine if the source is a URL or a local path
  const audioSrc = src.startsWith('http') ? src : src;
  
  return (
    <audio 
      ref={audioRef}
      src={audioSrc}
      loop={loop}
      autoPlay={autoPlay && bgmEnabled}
      className="hidden"
    />
  );
};

export default AudioPlayer;
