
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AudioPlayer from '@/components/AudioPlayer';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileContainer from '@/components/MobileContainer';

// New audio URLs
const BGM_URL = "https://tangerine-valkyrie-189847.netlify.app/8-1-kyomancome.mp3";
const BUTTON_SOUND_URL = "https://tangerine-valkyrie-189847.netlify.app/1-a-button.mp3";

const EndingAScreen: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { 
    bgmEnabled, 
    toggleBgm,
    handleScreenTransition,
    resetBattleState
  } = useApp();
  const [buttonSound, setButtonSound] = useState<string | null>(null);

  const handleRetry = () => {
    setButtonSound(BUTTON_SOUND_URL);
    // Reset battle state and redirect to battle2
    resetBattleState();
    handleScreenTransition('battle2');
    navigate('/battle2');
  };

  const handleBackToStart = () => {
    setButtonSound(BUTTON_SOUND_URL);
    // Reset battle state when returning to start
    resetBattleState();
    handleScreenTransition('index');
    navigate('/');
  };

  const handleFollowTooru = () => {
    setButtonSound(BUTTON_SOUND_URL);
    window.open('https://stand.fm/channels/5e85f9834afcd35104858d5a', '_blank');
  };

  return (
    <MobileContainer backgroundImage="/lovable-uploads/3a40abae-e601-4662-8d22-bc33a5ff7e0f.png">
      <div 
        className="flex flex-col p-4 justify-center items-center text-white bg-cover bg-center h-full w-full"
        style={{ 
          backgroundImage: 'url("/lovable-uploads/3a40abae-e601-4662-8d22-bc33a5ff7e0f.png")',
          fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif',
        }}
      >
        <AudioPlayer 
          src={BGM_URL} 
          loop={true} 
          autoPlay={true}
          volume={0.7}
          id="ending-a-bgm"
        />
        
        {/* Button sound effect player */}
        {buttonSound && (
          <AudioPlayer 
            src={buttonSound} 
            loop={false} 
            autoPlay={true} 
            volume={0.7}
            id="button-sound" 
          />
        )}
        
        {/* 完全勝利 Header */}
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
            完全勝利
          </h1>
        </div>
        
        <div className="relative flex-1 flex items-center justify-center w-full overflow-hidden perspective">
          <div className="absolute w-full max-w-3xl text-center transform rotate3d">
            <div 
              className="star-wars-text-content text-white -webkit-text-stroke-[1px] -webkit-text-stroke-black leading-relaxed animate-text-scroll p-4 sm:p-6 rounded" 
              style={{ 
                fontSize: isMobile ? 'calc(0.875rem + 2px)' : 'calc(1.125rem + 4px)',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 5px #000000e6, 0 0 10px #0006'
              }}
            >
              <p>
                とおるは勝利した！<br />
                <br />
                だが、それは本質ではない<br />
                <br />
                人間づきあいには<br />
                勝利も敗北もないからだ<br />
                <br />
                俺達はいつだって、<br />
                誠実に相手に向き合い、<br />
                そして、<br />
                自分に正直に<br />
                真摯に対応する<br />
                <br />
                <br />
                その結果<br />
                すれ違う事もある<br />
                意見が分かれる事もある<br />
                <br />
                <br />
                でも大丈夫だ<br />
                <br />
                そんな時は<br />
                とことん話をすればいい<br />
                <br />
                <br />
                <br />
                そう、stand.fmで<br />
                <br />
                さあ徹底的にコラボしよう<br />
                <br />
                <br />
                俺達のスタエフは<br />
                まだ始まったばかりだ！<br />
              </p>
            </div>
          </div>
        </div>
        
        {/* Action buttons at the bottom - スタイルを統一 */}
        <div className="w-full flex flex-col items-center space-y-3 pb-4">
          <Button
            onClick={handleFollowTooru}
            className="w-48 sm:w-64 py-2 bg-white text-pink-500 border-2 border-pink-500 hover:bg-pink-50 font-bold rounded-full text-sm"
            style={{ height: '40px' }}
          >
            とおるをフォローする
          </Button>
          
          <Button
            onClick={handleRetry}
            className="w-48 sm:w-64 py-2 bg-white text-purple-500 border-2 border-purple-500 hover:bg-purple-50 font-bold rounded-full text-sm"
            style={{ height: '40px' }}
          >
            もう一度戦う
          </Button>
          
          <Button
            onClick={handleBackToStart}
            className="w-48 sm:w-64 py-2 bg-pink-500 text-white hover:bg-pink-600 font-bold rounded-full text-sm"
            style={{ height: '40px' }}
          >
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

export default EndingAScreen;
