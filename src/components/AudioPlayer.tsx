
import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';

interface AudioPlayerProps {
  src: string;
  loop?: boolean;
  autoPlay?: boolean;
  volume?: number;
  startTime?: number; // Optional start time in seconds
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  src, 
  loop = false, 
  autoPlay = true,
  volume = 1.0,
  startTime = 0
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { bgmEnabled } = useApp();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = loop;
      audioRef.current.volume = volume;
      
      // Set up event listeners
      audioRef.current.addEventListener('canplaythrough', () => {
        setIsLoaded(true);
        if (startTime > 0) {
          audioRef.current!.currentTime = startTime;
        }
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error("Audio error:", e);
      });
    }

    // Update source if it changes
    if (audioRef.current.src !== src) {
      audioRef.current.src = src;
      setIsLoaded(false);
    }

    // Update loop setting if it changes
    audioRef.current.loop = loop;
    
    // Update volume
    audioRef.current.volume = volume;

    // Play or pause based on bgmEnabled state and autoPlay setting
    if (bgmEnabled && autoPlay && isLoaded) {
      // Using a promise to handle autoplay restrictions
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Audio playback prevented by browser:", error);
        });
      }
    } else if (!bgmEnabled && audioRef.current.played) {
      audioRef.current.pause();
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('canplaythrough', () => setIsLoaded(true));
        audioRef.current.removeEventListener('error', () => {});
        audioRef.current = null;
      }
    };
  }, [src, loop, bgmEnabled, autoPlay, volume, startTime, isLoaded]);

  // Effect to handle bgmEnabled changes
  useEffect(() => {
    if (!audioRef.current || !isLoaded) return;
    
    if (bgmEnabled) {
      audioRef.current.play().catch(error => {
        console.error("Audio playback prevented by browser:", error);
      });
    } else {
      audioRef.current.pause();
    }
  }, [bgmEnabled, isLoaded]);

  return null; // This component doesn't render anything
};

export default AudioPlayer;
