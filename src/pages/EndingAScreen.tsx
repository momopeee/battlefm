
import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import AudioPlayer from '@/components/AudioPlayer';
import { Volume2, VolumeX } from 'lucide-react';

const EndingAScreen: React.FC = () => {
  const { 
    bgmEnabled, 
    toggleBgm,
    handleScreenTransition
  } = useApp();

  const handleRetry = () => {
    handleScreenTransition('battle1');
  };

  const handleBackToStart = () => {
    handleScreenTransition('start');
  };

  return (
    <div 
      className="min-h-screen flex flex-col p-4 justify-center items-center text-white"
      style={{ 
        background: 'linear-gradient(180deg, rgba(233, 77, 132, 0.8), rgba(156, 39, 176, 0.8))',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif'
      }}
    >
      <AudioPlayer src="/audios/victory.mp3" loop={false} autoPlay />
      
      <div className="bg-black/50 rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6">完全勝利！</h1>
        
        <p className="mb-8 text-lg">
          とおるは見事に勝利した！
          <br />
          そーそーのクソリプとゆうじの陽気なおじさんに打ち勝った！
          <br /><br />
          「やまにぃのマネージャー面接突破！！」
          <br />
          「次はワンマン組織からチーム経営へ！」
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleRetry}
            className="w-full bg-purple-700 hover:bg-purple-600 py-3 px-4 rounded-md font-bold transition-colors"
          >
            もう一度挑戦する
          </button>
          
          <button
            onClick={handleBackToStart}
            className="w-full bg-gray-700 hover:bg-gray-600 py-3 px-4 rounded-md font-bold transition-colors"
          >
            スタート画面に戻る
          </button>
        </div>
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

export default EndingAScreen;
