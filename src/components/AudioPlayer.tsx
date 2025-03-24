
import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { useApp } from '@/context/AppContext';

interface AudioPlayerProps {
  src: string;
  loop?: boolean;
  autoPlay?: boolean;
  volume?: number;
  startTime?: number; // Optional start time in seconds
  id?: string; // Optional ID for debugging
  onEnded?: () => void; // Callback when audio ends
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  src, 
  loop = false, 
  autoPlay = true,
  volume = 1.0,
  startTime = 0,
  id = "audio-" + Math.random().toString(36).substr(2, 9), // Generate random ID if not provided
  onEnded
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { bgmEnabled, userInteracted } = useApp();
  const [isLoaded, setIsLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const maxRetries = 3;
  
  // Track previous source to prevent unnecessary reloads
  const prevSrcRef = useRef<string | null>(null);
  
  // Handle audio load error - memoized for performance
  const handleLoadError = useCallback((error: Error) => {
    setAudioError(`Error: ${error.message || 'Unknown error'}`);
    
    // Retry loading if under max attempts
    if (loadAttempts < maxRetries) {
      setLoadAttempts(prev => prev + 1);
      
      // Small delay before retry
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
        }
      }, 1000);
    }
  }, [loadAttempts, maxRetries]);

  // Asynchronous preload function
  const preloadAudio = useCallback(async (audioElement: HTMLAudioElement, audioSrc: string) => {
    try {
      // First mute the audio to help with autoplay policies
      audioElement.muted = true;
      audioElement.src = audioSrc;
      
      // Use a promise to wait for loading
      await new Promise((resolve, reject) => {
        audioElement.addEventListener('canplaythrough', resolve, { once: true });
        audioElement.addEventListener('error', reject, { once: true });
        // Start loading
        audioElement.load();
      });
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[${id}] Audio preloaded successfully: ${audioSrc}`);
      }
      
      setIsLoaded(true);
      if (startTime > 0) {
        audioElement.currentTime = startTime;
      }
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[${id}] Error preloading audio:`, err);
      }
      handleLoadError(err instanceof Error ? err : new Error('Unknown error during preload'));
    }
  }, [id, startTime, handleLoadError]);

  // Initialize or update audio element
  useEffect(() => {
    if (!src) {
      // Reduce logging in production
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[${id}] Invalid audio source provided`);
      }
      return;
    }
    
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Set up event listeners once
      audioRef.current.addEventListener('play', () => {
        setIsPlaying(true);
      });
      
      audioRef.current.addEventListener('pause', () => {
        setIsPlaying(false);
      });
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        
        if (onEnded) {
          onEnded();
        }
        
        // If not looping, we're done
        if (!loop) {
          setIsLoaded(false);
        }
      });
    }

    // Update properties
    if (audioRef.current) {
      audioRef.current.loop = loop;
    }
    
    // Only reload if source actually changed
    if (audioRef.current && (audioRef.current.src !== src && prevSrcRef.current !== src)) {
      try {
        prevSrcRef.current = src;
        // Use the asynchronous preload function
        preloadAudio(audioRef.current, src);
        setAudioError(null);
        setLoadAttempts(0); // Reset load attempts for new source
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(`[${id}] Error setting audio source:`, err);
        }
        setAudioError(`Error setting source: ${err}`);
      }
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        // Properly stop and clean up audio
        audioRef.current.pause();
        audioRef.current.src = ""; // Clear source to fully stop audio
        
        // Clear buffered audio
        try {
          if (audioRef.current.buffered.length) {
            audioRef.current.currentTime = 0;
          }
        } catch (e) {
          // Silent error handling - just stopping
        }
        
        // Only log in development
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[${id}] Cleaned up audio for: ${src}`);
        }
        
        setIsPlaying(false);
      }
    };
  }, [src, id, loop, preloadAudio, onEnded]);

  // Handle play state changes based on bgmEnabled - considering user interaction
  useEffect(() => {
    if (!audioRef.current || !isLoaded) return;
    
    // Only autoplay if enabled, user has interacted, and autoPlay is true
    const shouldPlay = bgmEnabled && autoPlay && userInteracted;
    
    // Only process when state changes
    if (shouldPlay && !isPlaying) {
      // Using a promise to handle autoplay restrictions
      audioRef.current.muted = false;
      audioRef.current.volume = volume;
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .catch(error => {
            // Handle autoplay restrictions
            if (process.env.NODE_ENV !== 'production') {
              console.warn(`[${id}] Playback prevented: ${error.message || 'Autoplay policy'}`);
            }
            setAudioError(`Playback prevented: ${error.message || 'Autoplay policy'}`);
          });
      }
    } else if (!shouldPlay && isPlaying) {
      audioRef.current.pause();
    } else if (shouldPlay && isPlaying) {
      // Only update volume if needed
      if (Math.abs(audioRef.current.volume - volume) > 0.01) {
        audioRef.current.volume = volume;
      }
    }
  }, [bgmEnabled, autoPlay, isLoaded, isPlaying, volume, id, userInteracted]);

  // Return null - the audio player is invisible
  return null;
};

// Use React.memo with a custom comparison function for performance
function arePropsEqual(prevProps: AudioPlayerProps, nextProps: AudioPlayerProps) {
  return (
    prevProps.src === nextProps.src &&
    prevProps.loop === nextProps.loop &&
    prevProps.autoPlay === nextProps.autoPlay &&
    prevProps.volume === nextProps.volume &&
    prevProps.startTime === nextProps.startTime
  );
}

export default memo(AudioPlayer, arePropsEqual);
