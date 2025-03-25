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
    <MobileContainer>
      {/* 最下層レイヤー：指定URLの背景画像 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("https://tangerine-valkyrie-189847.netlify.app/ug3.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0
        }}
      />

      {/* オーディオ再生 */}
      {!alarmFinished && (
        <AudioPlayer
          src={SELECT_ALARM_SOUND}
          loop={false}
          autoPlay={true}
          volume={0.7}
          id="alarm-sound"
          onEnded={handleAlarmFinished}
        />
      )}
      {alarmFinished && (
        <AudioPlayer
          src={SELECT_ASSAULT_BGM}
          loop={true}
          autoPlay={true}
          volume={0.7}
          id="assault-bgm"
        />
      )}
      
      {/* 上位レイヤー：スクロールテキストおよびその他のUI（zIndex を上げる） */}
      <div className="relative flex-1 flex items-center justify-center w-full overflow-hidden" style={{ zIndex: 1 }}>
        <div className="absolute w-full max-w-3xl text-center" style={{ transform: 'perspective(400px) rotateX(25deg)' }}>
          <div 
            className="star-wars-text-content p-4 sm:p-6 rounded" 
            style={{ 
              color: 'white',
              fontSize: isMobile ? 'calc(0.875rem + 2px)' : 'calc(1.125rem + 4px)',
              WebkitTextStroke: '1px black',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.6)',
              animation: 'textScroll 30s linear infinite'
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
      
      {/* スキップボタン（上位レイヤー） */}
      <Button
        onClick={handleSkip}
        disabled={actionInProgress}
        className={`absolute bottom-8 right-6 z-30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white flex items-center gap-2 ${actionInProgress ? 'opacity-70' : ''}`}
        variant="ghost"
      >
        <span>スキップ</span>
        <SkipForward size={18} />
      </Button>
      
      {/* サウンドトグルボタン（上位レイヤー） */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleBgm();
        }}
        className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
      >
        {bgmEnabled ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color="white" />}
      </button>
      
      {/* スクロールテキスト用のキーアニメーション定義 */}
      <style>{`
        @keyframes textScroll {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(-100%);
          }
        }
      `}</style>
    </MobileContainer>
  );
};

export default AssaultScreen;
