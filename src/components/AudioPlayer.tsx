
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
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`Audio Player: Attempting to play ${src}, bgmEnabled: ${bgmEnabled}`);
    
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = loop;
      audioRef.current.volume = volume;
      
      // Set up event listeners
      audioRef.current.addEventListener('canplaythrough', () => {
        console.log(`Audio loaded and ready to play: ${src}`);
        setIsLoaded(true);
        if (startTime > 0) {
          audioRef.current!.currentTime = startTime;
        }
      });
      
      audioRef.current.addEventListener('error', (e) => {
        const error = e as ErrorEvent;
        console.error("Audio error:", error);
        setAudioError(`Error loading audio: ${error.message || 'Unknown error'}`);
      });
      
      audioRef.current.addEventListener('play', () => {
        console.log(`Audio started playing: ${src}`);
      });
      
      audioRef.current.addEventListener('pause', () => {
        console.log(`Audio paused: ${src}`);
      });
    }

    // Update source if it changes
    if (audioRef.current.src !== src) {
      console.log(`Setting audio source: ${src}`);
      audioRef.current.src = src;
      setIsLoaded(false);
      // Reset error state when trying a new source
      setAudioError(null);
    }

    // Update loop setting if it changes
    audioRef.current.loop = loop;
    
    // Update volume
    audioRef.current.volume = volume;
    console.log(`Audio volume set to: ${volume}`);

    // Play or pause based on bgmEnabled state and autoPlay setting
    if (bgmEnabled && autoPlay && isLoaded) {
      console.log(`Attempting to play audio: ${src}`);
      // Using a promise to handle autoplay restrictions
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log(`Successfully playing audio: ${src}`);
          })
          .catch(error => {
            console.error("Audio playback prevented by browser:", error);
            setAudioError(`Playback prevented: ${error.message || 'Autoplay policy'}`);
          });
      }
    } else if (!bgmEnabled && audioRef.current.played && !audioRef.current.paused) {
      console.log(`Pausing audio due to bgmEnabled: ${bgmEnabled}`);
      audioRef.current.pause();
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        console.log(`Cleaning up audio: ${src}`);
        audioRef.current.pause();
        audioRef.current.removeEventListener('canplaythrough', () => {});
        audioRef.current.removeEventListener('error', () => {});
        audioRef.current.removeEventListener('play', () => {});
        audioRef.current.removeEventListener('pause', () => {});
        audioRef.current = null;
      }
    };
  }, [src, loop, bgmEnabled, autoPlay, volume, startTime, isLoaded]);

  // Effect to handle bgmEnabled changes
  useEffect(() => {
    if (!audioRef.current || !isLoaded) return;
    
    if (bgmEnabled) {
      console.log(`bgmEnabled changed to true, attempting to play: ${src}`);
      audioRef.current.play().catch(error => {
        console.error("Audio playback prevented by browser:", error);
        setAudioError(`Playback prevented: ${error.message || 'Autoplay policy'}`);
      });
    } else {
      console.log(`bgmEnabled changed to false, pausing: ${src}`);
      audioRef.current.pause();
    }
  }, [bgmEnabled, isLoaded, src]);

  // Add a small invisible element for debugging purposes
  return (
    <div style={{ display: 'none' }}>
      {audioError && <span data-error={audioError}></span>}
    </div>
  );
};

export default AudioPlayer;
