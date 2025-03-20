
import React, { useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';

interface AudioPlayerProps {
  src: string;
  loop?: boolean;
  autoPlay?: boolean;
  volume?: number;
  startPosition?: number;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  src, 
  loop = false, 
  autoPlay = true,
  volume = 1.0,
  startPosition = 0
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { bgmEnabled } = useApp();

  useEffect(() => {
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = loop;
      audioRef.current.volume = volume;
    }

    // Update source if it changes
    if (audioRef.current.src !== src) {
      audioRef.current.src = src;
      
      // Apply start position if specified
      if (startPosition > 0) {
        try {
          audioRef.current.currentTime = startPosition;
        } catch (error) {
          console.error("Failed to set audio currentTime:", error);
        }
      }
    }

    // Update loop setting if it changes
    audioRef.current.loop = loop;
    
    // Update volume
    audioRef.current.volume = volume;

    // Play or pause based on bgmEnabled state and autoPlay setting
    if (bgmEnabled && autoPlay) {
      // Using a promise to handle autoplay restrictions
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Audio playback prevented by browser:", error);
        });
      }
    } else {
      audioRef.current.pause();
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [src, loop, bgmEnabled, autoPlay, volume, startPosition]);

  // Effect to handle bgmEnabled changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (bgmEnabled) {
      audioRef.current.play().catch(error => {
        console.error("Audio playback prevented by browser:", error);
      });
    } else {
      audioRef.current.pause();
    }
  }, [bgmEnabled]);

  return null; // This component doesn't render anything
};

export default AudioPlayer;
