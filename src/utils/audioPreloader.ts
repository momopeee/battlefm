
/**
 * Audio Preloader Utility
 * Efficiently manages audio preloading with caching
 */

// Global audio cache
if (!window.audioCache) {
  window.audioCache = {};
}

/**
 * Preloads audio file with proper caching
 * @param url URL of the audio file to preload
 * @param priority Priority of loading (high/low)
 * @returns The cached audio element
 */
export const preloadAudio = (url: string, priority: 'high' | 'low' = 'low'): HTMLAudioElement => {
  // Return from cache if already loaded
  if (window.audioCache && window.audioCache[url]) {
    return window.audioCache[url];
  }
  
  // Create new audio element with optimized settings
  const audio = new Audio();
  audio.preload = priority === 'high' ? 'auto' : 'metadata';
  
  // Add to cache before setting src to ensure we don't create duplicates
  if (window.audioCache) {
    window.audioCache[url] = audio;
  }
  
  // Set source and begin preloading
  audio.src = url;
  
  // Return the audio element
  return audio;
};

/**
 * Preloads multiple audio files efficiently
 * @param urls Array of audio URLs to preload
 * @param priority Priority of loading (high/low)
 */
export const preloadMultipleAudio = (urls: string[], priority: 'high' | 'low' = 'low'): void => {
  // Stagger preloading to avoid network congestion
  urls.forEach((url, index) => {
    setTimeout(() => {
      preloadAudio(url, priority);
    }, index * 100); // 100ms staggering
  });
};

/**
 * Clear audio from cache to free memory
 * @param url URL of the audio to clear from cache
 */
export const clearAudioCache = (url: string): void => {
  if (window.audioCache && window.audioCache[url]) {
    window.audioCache[url].src = '';
    delete window.audioCache[url];
  }
};

// Add typed window interface for TypeScript
declare global {
  interface Window {
    audioCache?: Record<string, HTMLAudioElement>;
  }
}
