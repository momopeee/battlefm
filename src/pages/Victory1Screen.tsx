
import React from 'react';
import { useApp } from '@/context/AppContext';
import AudioPlayer from '@/components/AudioPlayer';
import { Volume2, VolumeX } from 'lucide-react';

const Victory1Screen: React.FC = () => {
  const { 
    bgmEnabled, 
    toggleBgm,
    handleScreenTransition,
    totalComments
  } = useApp();

  const handleClose = () => {
    handleScreenTransition('select');
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between bg-white text-gray-800"
      style={{ 
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif'
      }}
    >
      <AudioPlayer src="/audios/toru1.mp3" loop autoPlay />
      
      {/* Empty top section for spacing */}
      <div className="w-full"></div>
      
      {/* Main content */}
      <div className="flex flex-col items-center w-full px-8">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">ライブが終了しました</h1>
          <p className="text-gray-500 mt-2">15:46</p>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-full w-5 h-5 flex items-center justify-center border border-gray-300">
            <span className="text-gray-500 text-sm">{totalComments || 0}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4 w-full">
          <div className="flex-shrink-0">
            <img 
              src="/lovable-uploads/c1b2b6d0-3acd-4ea0-b336-0631411ff128.png" 
              alt="とおる" 
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          
          <div className="flex-grow">
            <p className="font-medium">さよならワンマン経営…</p>
          </div>
          
          <button
            className="bg-pink-500 text-white rounded-full px-4 py-1 text-sm"
          >
            フォローする
          </button>
        </div>
      </div>
      
      {/* Bottom input section */}
      <div className="w-full p-4 space-y-4">
        <div className="w-full h-12 border border-pink-500 rounded-full"></div>
        <button
          onClick={handleClose}
          className="w-full h-12 bg-pink-500 text-white rounded-full font-bold"
        >
          閉じる
        </button>
      </div>
      
      {/* BGM Toggle Button */}
      <button
        onClick={toggleBgm}
        className="fixed top-6 right-6 z-20 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
      >
        {bgmEnabled ? <Volume2 size={24} color="gray" /> : <VolumeX size={24} color="gray" />}
      </button>
    </div>
  );
};

export default Victory1Screen;
