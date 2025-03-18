
import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
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
    // バトル1に戻す
    handleScreenTransition('battle1');
    navigate('/battle1');
  };

  const handleBackToStart = () => {
    handleScreenTransition('start');
    navigate('/start');
  };

  const handleFollowYamanix = () => {
    window.open('https://stand.fm/channels/60e5c664ddc03da2c9b0f3ec', '_blank');
  };

  // Start scrolling animation when component mounts
  useEffect(() => {
    const textContainer = document.getElementById('scrolling-text');
    if (textContainer) {
      textContainer.classList.add('scrolling');
    }
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col p-4 justify-center items-center text-white bg-cover bg-center relative"
      style={{ 
        backgroundImage: 'url("/lovable-uploads/a37987c5-d1ab-4f11-86a4-7ac9a089a401.png")',
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif',
        width: '1080px', 
        height: '1920px', 
        maxWidth: '100vw',
        maxHeight: '100vh',
        margin: '0 auto',
        overflow: 'hidden'
      }}
    >
      {/* Scrolling text container */}
      <div 
        className="h-[60vh] overflow-hidden absolute bottom-0 left-0 right-0 pointer-events-none flex justify-center"
      >
        <div 
          id="scrolling-text"
          className="text-white text-center whitespace-pre-line text-outlined"
          style={{ 
            fontSize: 'calc(1.5rem - 4px)',
            lineHeight: '1.75',
            position: 'absolute',
            transform: 'translateY(100%)',
            width: '80%',
            maxWidth: '600px'
          }}
        >
          <h1 className="text-2xl font-bold mb-6 text-outlined">勝利</h1>
          
          とおるは勝利した！

          だが、それは本質ではない

          人間づきあいには
          勝利も敗北もないからだ

          俺達はいつだって、
          誠実に相手に向き合い、
          そして、
          自分に正直に
          真摯に対応する

          その結果
          すれ違う事もある
          意見が分かれる事もある

          でも大丈夫だ

          そんな時は
          とことん話をすればいい

          そう、stand.fm で

          さあ徹底的にコラボしよう

          俺達のスタエフは
          まだ始まったばかりだ！
        </div>
      </div>
      
      {/* Actions container at the bottom */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="space-y-4 w-full max-w-md px-4">
          <Button
            onClick={handleFollowYamanix}
            className="w-full bg-green-700 hover:bg-green-600 py-3 px-4 rounded-md font-bold transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink size={20} />
            やまにぃをフォローする
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
