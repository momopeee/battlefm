
import React from 'react';
import { useApp } from '@/context/AppContext';
import AudioPlayer from '@/components/AudioPlayer';
import { Volume2, VolumeX } from 'lucide-react';

const EndingBScreen: React.FC = () => {
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
      className="min-h-screen flex flex-col p-4 justify-center items-center text-white bg-cover bg-center"
      style={{ 
        backgroundImage: 'url("/lovable-uploads/5d7a23ab-451e-4a7b-80e4-e649fc0a04aa.png")',
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif'
      }}
    >
      <AudioPlayer src="/audios/orehamou.mp3" loop={false} autoPlay />
      
      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6">敗北...</h1>
        
        <p className="mb-8 text-lg">
          とおるは敗北した...
          <br />
          そーそーのクソリプは止まらない...
          <br /><br />
          しかし、とおるは経験値を得た。
          <br />
          次は勝てるだろうか？
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleRetry}
            className="w-full bg-purple-700 hover:bg-purple-600 py-3 px-4 rounded-md font-bold transition-colors"
          >
            もう一度戦う
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

export default EndingBScreen;
