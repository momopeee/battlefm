
import React from 'react';
import { useApp } from '@/context/AppContext';
import { Volume2, VolumeX, RefreshCw, Home, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileContainer from '@/components/MobileContainer';

const EndingBScreen: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { 
    bgmEnabled, 
    toggleBgm,
    handleScreenTransition,
    resetBattleState
  } = useApp();

  const handleRetry = () => {
    // Reset battle state and redirect to battle1
    resetBattleState();
    handleScreenTransition('battle1');
    navigate('/battle1');
  };

  const handleBackToStart = () => {
    // Reset battle state when returning to start
    resetBattleState();
    handleScreenTransition('start');
    navigate('/start');
  };

  const handleFollowSoso = () => {
    window.open('https://stand.fm/channels/5f5b7d50f04555115d681ad4', '_blank');
  };

  return (
    <MobileContainer backgroundImage="/lovable-uploads/5d7a23ab-451e-4a7b-80e4-e649fc0a04aa.png">
      <div 
        className="flex flex-col p-4 justify-center items-center text-white bg-cover bg-center h-full w-full"
        style={{ 
          backgroundImage: 'url("/lovable-uploads/5d7a23ab-451e-4a7b-80e4-e649fc0a04aa.png")',
          fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif',
        }}
      >
        {/* 敗北 Header */}
        <div className="w-full text-center mb-4 sm:mb-6 z-10">
          <h1 
            className="text-white -webkit-text-stroke-[1px] sm:-webkit-text-stroke-[2px] -webkit-text-stroke-black animate-pulse" 
            style={{ 
              fontSize: isMobile ? 'calc(1.25rem + 8px)' : 'calc(1.5rem + 18px)',
              fontFamily: 'Rodin M, "Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif',
              textShadow: '0 0 10px rgba(255,255,255,0.7)',
              letterSpacing: '2px',
              fontWeight: 'bold'
            }}
          >
            敗北
          </h1>
        </div>
        
        <div className="relative flex-1 flex items-center justify-center w-full overflow-hidden perspective">
          <div className="absolute w-full max-w-3xl text-center transform rotate3d">
            <div className="star-wars-text-content text-white -webkit-text-stroke-[1px] -webkit-text-stroke-black leading-relaxed animate-text-scroll p-4 sm:p-6 rounded" 
              style={{ fontSize: isMobile ? 'calc(0.875rem + 2px)' : 'calc(1.125rem + 4px)' }}>
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
        
        <div className="space-y-2 sm:space-y-4 mt-2 sm:mt-4 w-full max-w-xs sm:max-w-md">
          <Button
            onClick={handleFollowSoso}
            className="w-full bg-green-700 hover:bg-green-600 py-2 sm:py-3 px-3 sm:px-4 rounded-md font-bold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <ExternalLink size={isMobile ? 16 : 20} />
            そーそーをフォローする
          </Button>
          
          <Button
            onClick={handleRetry}
            className="w-full bg-purple-700 hover:bg-purple-600 py-2 sm:py-3 px-3 sm:px-4 rounded-md font-bold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <RefreshCw size={isMobile ? 16 : 20} />
            もう一度戦う
          </Button>
          
          <Button
            onClick={handleBackToStart}
            className="w-full bg-gray-700 hover:bg-gray-600 py-2 sm:py-3 px-3 sm:px-4 rounded-md font-bold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Home size={isMobile ? 16 : 20} />
            スタート画面に戻る
          </Button>
        </div>
        
        {/* BGM Toggle Button */}
        <button
          onClick={toggleBgm}
          className="fixed top-3 sm:top-6 right-3 sm:right-6 z-20 bg-white/10 backdrop-blur-sm p-2 sm:p-3 rounded-full hover:bg-white/20 transition-colors"
        >
          {bgmEnabled ? 
            <Volume2 size={isMobile ? 20 : 24} color="white" /> : 
            <VolumeX size={isMobile ? 20 : 24} color="white" />
          }
        </button>
      </div>
    </MobileContainer>
  );
};

export default EndingBScreen;
