
import React from 'react';
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
        margin: '0 auto'
      }}
    >
      <div className="relative flex-1 flex items-center justify-center w-full overflow-hidden perspective">
        <div className="absolute w-full max-w-3xl text-center transform rotate3d">
          <div className="star-wars-text-content text-white -webkit-text-stroke-[1px] -webkit-text-stroke-black leading-relaxed animate-text-scroll p-6 rounded" style={{ fontSize: 'calc(1.125rem + 4px)' }}>
            <p>
              とおるは敗れた！<br />
              <br />
              荒廃していく「Ｘ」<br />
              狂犬のようなツイートが、<br />
              フィードを埋め尽くす<br />
              <br />
              そーそーが作りだした<br />
              ディストピアだ<br />
              <br />
              <br />
              でも大丈夫<br />
              <br />
              心が荒んでしまったら、<br />
              スタエフを開こう<br />
              <br />
              <br />
              スタエフのそーそは<br />
              常識的で優しい<br />
              <br />
              吐く毒にも愛嬌がある<br />
              <br />
              怖いのはツイートだけ<br />
              <br />
              <br />
              stand.fmでコラボしたら、<br />
              みんな仲良し！<br />
              <br />
              <br />
              <br />
              俺達のスタエフは<br />
              まだ始まったばかりだ！<br />
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 mt-4 w-full max-w-md">
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
