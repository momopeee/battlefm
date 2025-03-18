
import React from 'react';
import { useApp } from '@/context/AppContext';
import { Volume2, VolumeX, RefreshCw, Home, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EndingCScreen: React.FC = () => {
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

  const handleFollowYuji = () => {
    window.open('https://stand.fm/channels/5eb17436f654bbcab4e54fa0', '_blank');
  };

  return (
    <div 
      className="min-h-screen flex flex-col p-4 justify-center items-center text-white bg-cover bg-center"
      style={{ 
        backgroundImage: 'url("/lovable-uploads/06195b62-3f14-4c57-b235-a8f00a43b907.png")',
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif',
        width: '1080px', 
        height: '1920px', 
        maxWidth: '100vw',
        maxHeight: '100vh',
        margin: '0 auto'
      }}
    >
      <div className="perspective relative flex-1 flex items-center justify-center w-full">
        <div className="text-center w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 -webkit-text-stroke-[1px] -webkit-text-stroke-black text-white">敗北</h1>
          
          <div className="star-wars-text-container w-full overflow-hidden h-[60vh]">
            <div className="star-wars-text-content text-lg rotate3d text-white -webkit-text-stroke-[1px] -webkit-text-stroke-black" style={{ fontSize: 'calc(1.125rem - 4px)' }}>
              とおるは敗れた！<br />
              <br />
              とおるの言葉は<br />
              ゆうじに届かない<br />
              <br />
              馬耳東風<br />
              <br />
              ゆうじの耳に<br />
              とおるの金言<br />
              <br />
              <br />
              だが、それも良い<br />
              <br />
              世界は広い<br />
              <br />
              みんな違って、<br />
              みんないい<br />
              <br />
              <br />
              だから、<br />
              <br />
              届けたい言葉が<br />
              <br />
              届けたい人に届かない時<br />
              <br />
              嘆く必要はない<br />
              <br />
              <br />
              <br />
              何度でも話せばいい<br />
              とおるにはそれが出来る<br />
              <br />
              <br />
              そう、stand.fmなら<br />
              <br />
              コラボでお話出来る！<br />
              <br />
              <br />
              <br />
              俺達のスタエフは<br />
              まだ始まったばかりだ！<br />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 mt-4 w-full max-w-md">
        <Button
          onClick={handleFollowYuji}
          className="w-full bg-green-700 hover:bg-green-600 py-3 px-4 rounded-md font-bold transition-colors flex items-center justify-center gap-2"
        >
          <ExternalLink size={20} />
          ゆうじをフォローする
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

export default EndingCScreen;
