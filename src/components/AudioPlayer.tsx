
import React, { useEffect, useRef, useState } from 'react';
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
  const { bgmEnabled } = useApp();
  const [isLoaded, setIsLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const maxRetries = 3;
  
  // 前回のソースを追跡して不要な再ロードを防ぐ
  const prevSrcRef = useRef<string | null>(null);

  // Initialize or update audio element - 最適化版
  useEffect(() => {
    if (!src) {
      console.error(`[${id}] Invalid audio source provided`);
      return;
    }
    
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Set up event listeners - イベントリスナーを一度だけ設定
      audioRef.current.addEventListener('canplaythrough', () => {
        setIsLoaded(true);
        
        if (startTime > 0) {
          audioRef.current!.currentTime = startTime;
        }
      });
      
      audioRef.current.addEventListener('error', (e) => {
        const error = e as ErrorEvent;
        setAudioError(`Error: ${audioRef.current?.error?.message || 'Unknown error'}`);
        
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
      });
      
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

    // First mute the audio to help with autoplay policies
    if (audioRef.current) {
      audioRef.current.muted = true;
    }

    // Update properties
    audioRef.current.loop = loop;
    
    // ソースが実際に変更された場合のみ再ロードする
    if (audioRef.current.src !== src && prevSrcRef.current !== src) {
      try {
        audioRef.current.src = src;
        prevSrcRef.current = src;
        audioRef.current.load(); // Explicitly load the new source
        setIsLoaded(false);
        setAudioError(null);
      } catch (err) {
        console.error(`[${id}] Error setting audio source:`, err);
        setAudioError(`Error setting source: ${err}`);
      }
    }

    // Cleanup function - 完全にクリーンアップして次のページに影響しないようにする
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ""; // Clear source to fully stop audio
        // バッファをクリアすることで完全に音声を停止
        try {
          if (audioRef.current.buffered.length) {
            audioRef.current.currentTime = 0;
          }
        } catch (e) {
          // エラーをサイレントに処理 - 必要なのは停止のみ
        }
        setIsPlaying(false);
      }
    };
  }, [src, id, loadAttempts, loop, startTime, onEnded]);

  // bgmEnabled changes, autoplay - パフォーマンス最適化
  useEffect(() => {
    if (!audioRef.current || !isLoaded) return;
    
    const shouldPlay = bgmEnabled && autoPlay;
    
    // 状態変更時のみ処理を実行
    if (shouldPlay && !isPlaying) {
      // Using a promise to handle autoplay restrictions
      // First try with muted to bypass autoplay restrictions
      audioRef.current.muted = true;
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Now unmute and set proper volume
            if (audioRef.current) {
              audioRef.current.muted = false;
              audioRef.current.volume = volume;
            }
          })
          .catch(error => {
            // Auto-play was prevented by the browser
            if (error.name === "NotAllowedError") {
              // We'll set up a one-time click handler on document to try again
              const handleUserInteraction = () => {
                if (audioRef.current) {
                  audioRef.current.muted = false;
                  audioRef.current.volume = volume;
                  
                  audioRef.current.play()
                    .catch(e => console.error(`[${id}] Playback still failed after user interaction:`, e));
                }
                
                // Only handle once
                document.removeEventListener('click', handleUserInteraction);
                document.removeEventListener('touchstart', handleUserInteraction);
              };
              
              document.addEventListener('click', handleUserInteraction, { once: true });
              document.addEventListener('touchstart', handleUserInteraction, { once: true });
            }
            
            setAudioError(`Playback prevented: ${error.message || 'Autoplay policy'}`);
          });
      }
    } else if (!shouldPlay && isPlaying) {
      audioRef.current.pause();
    } else if (shouldPlay && isPlaying) {
      // Only update volume if needed
      if (audioRef.current.volume !== volume) {
        audioRef.current.volume = volume;
      }
    }
  }, [bgmEnabled, autoPlay, isLoaded, isPlaying, volume]);

  // 見えないコンポーネントとして最小限のレンダリングでパフォーマンスを最適化
  return (
    <div style={{ display: 'none' }} data-audio-id={id} data-audio-src={src} data-playing={isPlaying}>
      {audioError && <span data-error={audioError}></span>}
    </div>
  );
};

export default React.memo(AudioPlayer); // メモ化してレンダリングを最適化
