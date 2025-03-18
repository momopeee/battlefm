
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
      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6">敗北</h1>
        
        <p className="mb-8 text-lg" style={{ fontSize: 'calc(1.125rem - 3px)' }} dangerouslySetInnerHTML={{ __html: `
          とおるは敗れた！<br>
          <br>
          とおるの言葉はゆうじに届かなかった<br>
          世界は広い<br>
          <br>
          本当に届けたい人には<br>
          いつだって言葉は届かない<br>
          <br>
          でも嘆く事は無い<br>
          だって、何度でも話しかける事が出来るから<br>
          <br>
          そう、stand.fmならコラボでお話出来る！<br>
          <br>
          俺達のスタエフはまだ始まったばかりだ！<br>`
        }} />
        
        <div className="space-y-4">
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
