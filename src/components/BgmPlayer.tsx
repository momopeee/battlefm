
import React, { useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';

interface BgmPlayerProps {
  src: string;
  loop?: boolean;
}

const BgmPlayer: React.FC<BgmPlayerProps> = ({ src, loop = true }) => {
  const { bgmEnabled } = useApp();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (bgmEnabled) {
      audio.volume = 0.3;
      audio.play().catch(error => {
        console.error("BGM play failed:", error);
      });
    } else {
      audio.pause();
    }
  }, [bgmEnabled, src]);
  
  return (
    <audio 
      ref={audioRef}
      src={src}
      loop={loop}
      className="hidden"
    />
  );
};

export default BgmPlayer;
