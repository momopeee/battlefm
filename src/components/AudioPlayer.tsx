
import React from 'react';

interface AudioPlayerProps {
  src: string;
  loop?: boolean;
  autoPlay?: boolean;
}

// This is a placeholder component that doesn't actually play audio
// All audio functionality has been removed as requested
const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  return null;
};

export default AudioPlayer;
