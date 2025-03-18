
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
      className="game-container flex flex-col justify-center items-center text-white bg-cover bg-center relative"
      style={{ 
        backgroundImage: 'url("/lovable-uploads/5d7a23ab-451e-4a7b-80e4-e649fc0a04aa.png")',
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif',
      }}
    >
      {/* Star Wars style text scroll */}
      <div className="perspective relative h-[60vh] w-full overflow-hidden">
        <div className="rotate3d">
          <div className="star-wars-text-content absolute w-full">
            <div className="text-center px-8 max-w-[500px] mx-auto">
              <h1 className="text-3xl font-bold mb-6" style={{ 
                color: 'white', 
                textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 2px 0 0 #000, 0 -2px 0 #000, -2px 0 0 #000'
              }}>敗北</h1>
              
              <p className="mb-8 text-lg" 
                style={{ 
                  fontSize: 'calc(1.125rem - 5px)', 
                  color: 'white', 
                  textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 1px 0 #000, 1px 0 0 #000, 0 -1px 0 #000, -1px 0 0 #000'
                }} 
                dangerouslySetInnerHTML={{ __html: `
                とおるは敗れた！<br>
                <br>
                荒廃していく「Ｘ」<br>
                狂犬のようなツイートが、<br>
                フィードを埋め尽くす<br>
                <br>
                そーそーが作りだした<br>
                ディストピアだ<br>
                <br>
                <br>
                でも大丈夫<br>
                <br>
                心が荒んでしまったら、<br>
                スタエフを開こう<br>
                <br>
                <br>
                スタエフのそーそは<br>
                常識的で優しい<br>
                <br>
                吐く毒にも愛嬌がある<br>
                <br>
                怖いのはツイートだけ<br>
                <br>
                <br>
                stand.fmでコラボしたら、<br>
                みんな仲良し！<br>
                <br>
                <br>
                <br>
                俺達のスタエフは<br>
                まだ始まったばかりだ！<br>`
              }} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 mt-4 w-full max-w-md px-4">
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
        className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
      >
        {bgmEnabled ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color="white" />}
      </button>
    </div>
  );
};

export default EndingBScreen;
