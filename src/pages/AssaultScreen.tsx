import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import AudioPlayer from '@/components/AudioPlayer';
import MobileContainer from '@/components/MobileContainer';
import { SELECT_ALARM_SOUND, SELECT_ASSAULT_BGM } from '@/constants/audioUrls';
import { useIsMobile } from '@/hooks/use-mobile';

const AssaultScreen: React.FC = () => {
  const { bgmEnabled, toggleBgm, handleScreenTransition } = useApp();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [actionInProgress, setActionInProgress] = useState(false);
  const [alarmFinished, setAlarmFinished] = useState(false);
  
  // スキップボタン押下時（およびキーボード操作）に battle2Screen へ遷移
  const handleSkip = useCallback(() => {
    if (actionInProgress) return;
    setActionInProgress(true);
    handleScreenTransition('battle2');
    navigate('/battle2');
  }, [actionInProgress, handleScreenTransition, navigate]);
  
  // アラートBGM再生終了時のコールバック
  const handleAlarmFinished = () => {
    setAlarmFinished(true);
  };
  
  // キーボード（Space/Enter）でスキップを実行
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSkip]);
  
  return (
    <MobileContainer 
      backgroundImage="/lovable-uploads/3d6a3bf6-fd51-4422-bd24-e5f6c1b16e02.png"
      backgroundClassName="bg-amber-300"
    >
      {/* アラートBGM（1回だけ自動再生） */}
      <AudioPlayer
        src={SELECT_ALARM_SOUND}
        loop={false}
        autoPlay={true}
        volume={0.7}
        id="alarm-sound"
        onEnded={handleAlarmFinished}
      />
      
      {/* アラートBGM再生終了後、AssaultBGM をループ再生 */}
      {alarmFinished && (
        <AudioPlayer
          src={SELECT_ASSAULT_BGM}
          loop={true}
          autoPlay={true}
          volume={0.7}
          id="assault-bgm"
        />
      )}
      
      {/* Star Wars スタイルのスクロールテキスト */}
      <div className="relative flex-1 flex items-center justify-center w-full overflow-hidden perspective">
        <div className="absolute w-full max-w-3xl text-center transform rotate3d">
          <div 
            className="star-wars-text-content text-white -webkit-text-stroke-[1px] -webkit-text-stroke-black leading-relaxed animate-text-scroll p-4 sm:p-6 rounded" 
            style={{ 
              fontSize: isMobile ? 'calc(0.875rem + 2px)' : 'calc(1.125rem + 4px)',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 5px #000000e6, 0 0 10px #0006'
            }}
          >
            <p>うぇーい！みんな～</p>
            <br />
            <p>「ゆうじの陽気なおじさん」</p>
            <p>でお馴染み、大久保です！！</p>
            <br />
            <br />
            <p>って、おいおい！</p>
            <p>それは俺のおじさんやないかい！！</p>
            <p>陽気なおじさん＠ゆうじです！</p>
            <br />
            <br />
            <p>今日はやってやりますよ</p>
            <p>実は、フリーになって</p>
            <p>ついに、やまにぃを超えちゃった</p>
            <p>って思ってるんですよ</p>
            <p>やまにぃには内緒ですよ</p>
            <p>また怒られちゃうから</p>
            <p>カルシウム足りてないのかな～</p>
            <br />
            <br />
            <p>さて、今日はやまにいに、</p>
            <p>経営について指南してやりますよ</p>
            <br />
            <p>ちぇけら！</p>
            <br />
            <p>皆さん、</p>
            <p>よろしくウェイで～す！！</p>
          </div>
        </div>
      </div>
      
      {/* スキップボタン */}
      <Button
        onClick={handleSkip}
        disabled={actionInProgress}
        className={`absolute bottom-8 right-6 z-30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white flex items-center gap-2 ${actionInProgress ? 'opacity-70' : ''}`}
        variant="ghost"
      >
        <span>スキップ</span>
        <SkipForward size={18} />
      </Button>
      
      {/* サウンドトグルボタン */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleBgm();
        }}
        className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
      >
        {bgmEnabled ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color="white" />}
      </button>
    </MobileContainer>
  );
};

export default AssaultScreen;
