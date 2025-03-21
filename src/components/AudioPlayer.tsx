
import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';

interface AudioPlayerProps {
  src: string;
  loop?: boolean;
  autoPlay?: boolean;
  volume?: number;
  startTime?: number; // Optional start time in seconds
  id?: string; // Optional ID for debugging
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  src, 
  loop = false, 
  autoPlay = true,
  volume = 1.0,
  startTime = 0,
  id = "audio-" + Math.random().toString(36).substr(2, 9) // Generate random ID if not provided
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { bgmEnabled } = useApp();
  const [isLoaded, setIsLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize or update audio element
  useEffect(() => {
    console.log(`[${id}] AudioPlayer: Initializing with src=${src}, bgmEnabled=${bgmEnabled}`);
    
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Set up event listeners
      audioRef.current.addEventListener('canplaythrough', () => {
        console.log(`[${id}] Audio loaded and ready: ${src}`);
        setIsLoaded(true);
        
        if (startTime > 0) {
          audioRef.current!.currentTime = startTime;
        }
      });
      
      audioRef.current.addEventListener('error', (e) => {
        const error = e as ErrorEvent;
        console.error(`[${id}] Audio error:`, error, audioRef.current?.error);
        setAudioError(`Error: ${audioRef.current?.error?.message || 'Unknown error'}`);
      });
      
      audioRef.current.addEventListener('play', () => {
        console.log(`[${id}] Audio started playing: ${src}`);
        setIsPlaying(true);
      });
      
      audioRef.current.addEventListener('pause', () => {
        console.log(`[${id}] Audio paused: ${src}`);
        setIsPlaying(false);
      });
    }

    // Update properties
    audioRef.current.loop = loop;
    audioRef.current.volume = volume;
    
    // Update source if it changes
    if (audioRef.current.src !== src) {
      console.log(`[${id}] Setting audio source: ${src}`);
      try {
        audioRef.current.src = src;
        audioRef.current.load(); // Explicitly load the new source
        setIsLoaded(false);
        setAudioError(null);
      } catch (err) {
        console.error(`[${id}] Error setting audio source:`, err);
        setAudioError(`Error setting source: ${err}`);
      }
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        console.log(`[${id}] Cleaning up audio: ${src}`);
        audioRef.current.pause();
      }
    };
  }, [src, id]);

  // Handle bgmEnabled changes and autoplay
  useEffect(() => {
    if (!audioRef.current || !isLoaded) return;
    
    const shouldPlay = bgmEnabled && autoPlay;
    
    if (shouldPlay && !isPlaying) {
      console.log(`[${id}] Attempting to play audio: ${src}`);
      
      // Using a promise to handle autoplay restrictions
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log(`[${id}] Successfully playing audio: ${src}`);
          })
          .catch(error => {
            console.warn(`[${id}] Audio playback prevented:`, error);
            
            // Auto-play was prevented by the browser
            if (error.name === "NotAllowedError") {
              console.info(`[${id}] Autoplay blocked by browser policy. User interaction required.`);
              
              // We'll set up a one-time click handler on document to try again
              const handleUserInteraction = () => {
                console.log(`[${id}] User interaction detected, attempting playback again`);
                audioRef.current?.play()
                  .then(() => console.log(`[${id}] Playback successful after user interaction`))
                  .catch(e => console.error(`[${id}] Playback still failed after user interaction:`, e));
                
                // Only handle once
                document.removeEventListener('click', handleUserInteraction);
                document.removeEventListener('touchstart', handleUserInteraction);
              };
              
              document.addEventListener('click', handleUserInteraction);
              document.addEventListener('touchstart', handleUserInteraction);
            }
            
            setAudioError(`Playback prevented: ${error.message || 'Autoplay policy'}`);
          });
      }
    } else if (!shouldPlay && isPlaying) {
      console.log(`[${id}] Pausing audio due to bgmEnabled=${bgmEnabled}: ${src}`);
      audioRef.current.pause();
    }
  }, [bgmEnabled, autoPlay, isLoaded, src, id, isPlaying]);

  // Add a small invisible element for debugging purposes
  return (
    <div style={{ display: 'none' }} data-audio-id={id} data-audio-src={src} data-playing={isPlaying}>
      {audioError && <span data-error={audioError}></span>}
    </div>
  );
};

export default AudioPlayer;
