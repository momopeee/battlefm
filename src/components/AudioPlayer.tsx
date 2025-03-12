
import React, { useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';

interface AudioPlayerProps {
  src: string;
  loop?: boolean;
  autoPlay?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, loop = true, autoPlay = true }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { bgmEnabled } = useApp();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (bgmEnabled && autoPlay) {
      audio.play().catch(error => {
        console.error("Audio playback failed:", error);
      });
    } else {
      audio.pause();
    }
  }, [bgmEnabled, autoPlay, src]);

  return (
    <audio
      ref={audioRef}
      src={src}
      loop={loop}
      preload="auto"
      style={{ display: 'none' }}
    />
  );
};

export default AudioPlayer;
