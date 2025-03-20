
import React from 'react';
import { useApp } from '@/context/AppContext';
import { Volume2, VolumeX, RefreshCw, Home, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileContainer from '@/components/MobileContainer';

const EndingCScreen: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { 
    bgmEnabled, 
    toggleBgm,
    handleScreenTransition,
    resetBattleState
  } = useApp();

  const handleRetry = () => {
    // Reset battle state and redirect to battle2
    resetBattleState();
    handleScreenTransition('battle2');
    navigate('/battle2');
  };

  const handleBackToStart = () => {
    // Reset battle state when returning to start
    resetBattleState();
    handleScreenTransition('index');
    navigate('/');
  };

  const handleFollowYuji = () => {
    window.open('https://stand.fm/channels/5eb17436f654bbcab4e54fa0', '_blank');
  };

  return (
    <MobileContainer backgroundImage="/lovable-uploads/06195b62-3f14-4c57-b235-a8f00a43b907.png">
      <div 
        className="flex flex-col p-4 justify-center items-center text-white bg-cover bg-center h-full w-full"
        style={{ 
          backgroundImage: 'url("/lovable-uploads/06195b62-3f14-4c57-b235-a8f00a43b907.png")',
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
              </p>
            </div>
          </div>
        </div>
        
        {/* Action buttons at the bottom - スタイルを統一 */}
        <div className="w-full space-y-3 pb-4">
          <Button
            onClick={handleFollowYuji}
            className="w-full py-2 bg-white text-pink-500 border-2 border-pink-500 hover:bg-pink-50 font-bold rounded-full text-sm"
            style={{ height: '40px' }}
          >
            <ExternalLink size={isMobile ? 16 : 20} className="mr-2" />
            ゆうじをフォローする
          </Button>
          
          <Button
            onClick={handleRetry}
            className="w-full py-2 bg-white text-purple-500 border-2 border-purple-500 hover:bg-purple-50 font-bold rounded-full text-sm"
            style={{ height: '40px' }}
          >
            <RefreshCw size={isMobile ? 16 : 20} className="mr-2" />
            もう一度戦う
          </Button>
          
          <Button
            onClick={handleBackToStart}
            className="w-full py-2 bg-pink-500 text-white hover:bg-pink-600 font-bold rounded-full text-sm"
            style={{ height: '40px' }}
          >
            <Home size={isMobile ? 16 : 20} className="mr-2" />
            スタートへ戻る
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

export default EndingCScreen;
