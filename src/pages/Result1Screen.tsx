
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Volume2, VolumeX, RefreshCw, Home, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Result1Screen: React.FC = () => {
  const navigate = useNavigate();
  const { 
    bgmEnabled, 
    toggleBgm, 
    battleTimer,
    totalComments,
    resetBattleState,
    handleScreenTransition 
  } = useApp();

  // Function to format the battle timer as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle navigating to the next screen (EndingB)
  const handleNext = () => {
    handleScreenTransition('endingB');
    navigate('/endingB');
  };

  // Handle retrying the battle
  const handleRetry = () => {
    resetBattleState();
    handleScreenTransition('battle1');
    navigate('/battle1');
  };

  // Handle going back to the start screen
  const handleBackToStart = () => {
    resetBattleState();
    handleScreenTransition('index');
    navigate('/');
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-between items-center text-white px-6 py-10 bg-cover bg-center"
      style={{ 
        backgroundImage: 'url("/lovable-uploads/5d7a23ab-451e-4a7b-80e4-e649fc0a04aa.png")',
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif',
        width: '1080px',
        height: '1920px',
        maxWidth: '100vw',
        maxHeight: '100vh',
        margin: '0 auto'
      }}
    >
      {/* Top title section */}
      <div className="w-full">
        <div className="flex items-center justify-center mt-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-outlined">敗北...</h1>
          </div>
        </div>
      </div>
      
      {/* Middle section with live ended message */}
      <div className="text-center">
        <div className="text-3xl font-bold text-outlined mb-8">ライブが終了しました</div>
        
        {/* Stats display */}
        <div className="flex items-center justify-center space-x-8 mb-6">
          {/* Timer */}
          <div className="flex flex-col items-center">
            <div className="text-sm opacity-80 mb-1">バトル時間</div>
            <div className="text-3xl font-bold text-outlined">{formatTime(battleTimer)}</div>
          </div>
          
          {/* Comments count */}
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <div className="text-sm opacity-80 mb-1">コメント数</div>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="text-3xl font-bold text-outlined">{totalComments}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom actions */}
      <div className="space-y-4 w-full max-w-md">
        <Button
          onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-md flex items-center justify-center gap-2"
        >
          次に進む <ChevronRight size={20} />
        </Button>
        
        <Button
          onClick={handleRetry}
          className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 rounded-md flex items-center justify-center gap-2"
        >
          <RefreshCw size={20} />
          もう一度戦う
        </Button>
        
        <Button
          onClick={handleBackToStart}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-md flex items-center justify-center gap-2"
        >
          <Home size={20} />
          スタートへ戻る
        </Button>
      </div>
      
      {/* BGM Toggle Button */}
      <button
        onClick={toggleBgm}
        className="fixed top-6 right-6 z-20 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
      >
        {bgmEnabled ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color="white" />}
      </button>
    </div>
  );
};

export default Result1Screen;
