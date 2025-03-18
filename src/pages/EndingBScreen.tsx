
import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Volume2, VolumeX, RefreshCw, Home, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EndingBScreen: React.FC = () => {
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

  const handleFollowSoso = () => {
    window.open('https://stand.fm/channels/5f5b7d50f04555115d681ad4', '_blank');
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
      className="min-h-screen flex flex-col p-4 justify-center items-center text-white bg-cover bg-center"
      style={{ 
        backgroundImage: 'url("/lovable-uploads/5d7a23ab-451e-4a7b-80e4-e649fc0a04aa.png")',
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif',
        width: '1080px', 
        height: '1920px', 
        maxWidth: '100vw',
        maxHeight: '100vh',
        margin: '0 auto',
        position: 'relative',
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
          <h1 className="text-2xl font-bold mb-6 text-outlined">敗北</h1>
          
          とおるは敗れた！

          荒廃していく「X」
          狂犬のようなツイートが、
          フィードを埋め尽くす

          そーそーが作りだした
          ディストピアだ

          でも大丈夫

          心が荒んでしまったら、
          スタエフを開こう

          スタエフのそーそは
          常識的で優しい

          吐く毒にも愛嬌がある

          怖いのはツイートだけ

          stand.fm でコラボしたら、
          みんな仲良し！

          俺達のスタエフは
          まだ始まったばかりだ！
        </div>
      </div>
      
      {/* Actions container at the bottom */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="space-y-4 w-full max-w-md px-4">
          <Button
            onClick={handleFollowSoso}
            className="w-full bg-green-700 hover:bg-green-600 py-3 px-4 rounded-md font-bold transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink size={20} />
            そーそーをフォローする
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

export default EndingBScreen;
