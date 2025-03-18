
import React from 'react';
import { useApp } from '@/context/AppContext';
import AudioPlayer from '@/components/AudioPlayer';
import { Volume2, VolumeX, RefreshCw, Home, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EndingAScreen: React.FC = () => {
  const navigate = useNavigate();
  const { 
    bgmEnabled, 
    toggleBgm,
    handleScreenTransition
  } = useApp();

  const handleRetry = () => {
    // バトル2に戻す
    handleScreenTransition('battle2');
    navigate('/battle2');
  };

  const handleBackToStart = () => {
    handleScreenTransition('start');
    navigate('/start');
  };

  const handleFollowTooru = () => {
    window.open('https://stand.fm/channels/5e85f9834afcd35104858d5a', '_blank');
  };

  return (
    <div 
      className="min-h-screen flex flex-col p-4 justify-center items-center text-white bg-cover bg-center"
      style={{ 
        backgroundImage: 'url("/lovable-uploads/3a40abae-e601-4662-8d22-bc33a5ff7e0f.png")',
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif',
        width: '1080px', 
        height: '1920px', 
        maxWidth: '100vw',
        maxHeight: '100vh',
        margin: '0 auto'
      }}
    >
      <AudioPlayer src="/audios/victory.mp3" loop={false} autoPlay />
      
      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6">完全勝利！</h1>
        
        <p className="mb-8 text-lg" dangerouslySetInnerHTML={{ __html: `
          とおるは勝利した！<br>
          <br>
          だが、<br>
          人間づきあいには勝利も敗北ない<br>
          <br>
          誠実に相手に向き合い、<br>
          そして、自分に正直に真摯に対応する。<br>
          <br>
          その結果すれ違う事もある<br>
          意見が分かれる事もある<br>
          <br>
          だがそんな時は、<br>
          <br>
          とことん話をすればいい<br>
          そう、stand.fmで徹底的にコラボしよう<br>
          <br>
          俺達のスタエフはまだ始まったばかりだ！<br>`
        }} />
        
        <div className="space-y-4">
          <Button
            onClick={handleFollowTooru}
            className="w-full bg-green-700 hover:bg-green-600 py-3 px-4 rounded-md font-bold transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink size={20} />
            とおるをフォローする
          </Button>
          
          <Button
            onClick={handleRetry}
            className="w-full bg-purple-700 hover:bg-purple-600 py-3 px-4 rounded-md font-bold transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            もう一度戦う
          </Button>
          
          <Button
            onClick={handleBackToStart}
            className="w-full bg-gray-700 hover:bg-gray-600 py-3 px-4 rounded-md font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Home size={20} />
            スタート画面に戻る
          </Button>
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
