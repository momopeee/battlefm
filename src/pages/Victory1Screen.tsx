
import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import AudioPlayer from '@/components/AudioPlayer';
import { Volume2, VolumeX } from 'lucide-react';

const Victory1Screen: React.FC = () => {
  const { 
    battleTimer, 
    totalComments, 
    bgmEnabled, 
    toggleBgm,
    handleScreenTransition
  } = useApp();

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate battle rating
  const calculateRating = () => {
    // Simple algorithm based on time and comments
    const timeScore = Math.min(100, 300 / (battleTimer || 1) * 50);
    const commentScore = Math.min(100, totalComments * 5);
    const totalScore = (timeScore + commentScore) / 2;
    
    if (totalScore >= 90) return 'S';
    if (totalScore >= 80) return 'A';
    if (totalScore >= 70) return 'B';
    if (totalScore >= 60) return 'C';
    if (totalScore >= 50) return 'D';
    return 'E';
  };

  const handleClose = () => {
    handleScreenTransition('select');
  };

  return (
    <div className="battle-bg min-h-screen p-6 flex flex-col items-center justify-center text-white">
      <AudioPlayer src="/audios/toru1.mp3" loop autoPlay />
      
      <div className="bg-black/30 rounded-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">バトル結果</h1>
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-lg">バトル時間:</span>
            <span className="text-xl font-bold">{formatTime(battleTimer)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-lg">コメント数:</span>
            <span className="text-xl font-bold">{totalComments}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-lg">バトル評価:</span>
            <span className="text-3xl font-bold text-battle-pink">{calculateRating()}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={handleClose}
            className="bg-battle-pink py-3 px-4 rounded-md font-bold hover:opacity-90 transition-opacity"
          >
            閉じる
          </button>
          
          <div className="flex justify-between">
            <a 
              href="https://stand.fm/channels/5e85f9834afcd35104858d5a" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/20 py-2 px-4 rounded-md text-white font-semibold hover:bg-white/30 transition-colors flex-1 mr-2 text-center"
            >
              フォローする
            </a>
            
            <a 
              href="https://stand.fm/channels/5e85f9834afcd35104858d5a" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/20 py-2 px-4 rounded-md text-white font-semibold hover:bg-white/30 transition-colors flex-1 ml-2 text-center"
            >
              レターを送る
            </a>
          </div>
        </div>
      </div>
      
      {/* BGM Toggle Button */}
      <button
        onClick={toggleBgm}
        className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
      >
        {bgmEnabled ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color="white" />}
      </button>
    </div>
  );
};

export default Victory1Screen;
