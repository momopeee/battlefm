
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import AudioPlayer from '@/components/AudioPlayer';
import MobileContainer from '@/components/MobileContainer';
import { useIsMobile } from '@/hooks/use-mobile';

// Define audio URL constants
const SELECT_ALARM_SOUND = 'https://tangerine-valkyrie-189847.netlify.app/6-a-keihou.mp3';
const SELECT_ASSAULT_BGM = 'https://tangerine-valkyrie-189847.netlify.app/6-2-ugmode.mp3';

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
    // ※ここで handleScreenTransition による自動リダイレクトが発生していないか、内部実装を確認してください。
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
    <MobileContainer style={{ minHeight: '100vh' }}>
      {/* 最下層レイヤー：背景画像（指定URL） */}
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

      {/* オーディオ */}
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

      {/* 上位レイヤー：スクロールテキスト */}
      <div 
        className="relative flex-1 flex items-center justify-center w-full h-full overflow-hidden" 
        style={{ 
          perspective: '400px',
          zIndex: 1 
        }}
      >
        <div 
          className="absolute w-full max-w-3xl text-center"
          style={{ 
            transform: 'rotateX(25deg)',
            transformOrigin: 'center bottom',
            height: '100%',
          }}
        >
          <div
            className="star-wars-text-content p-4 sm:p-6 rounded"
            style={{
              color: 'white',
              fontSize: isMobile ? 'calc(0.875rem + 2px)' : 'calc(1.125rem + 4px)',
              WebkitTextStroke: '0px black',
              textShadow:
                '2px 2px 4px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.6)',
              animation: 'textScroll 30s linear infinite',
              position: 'absolute',
              width: '100%'
            }}
          >
            <p>うぇーい！みんな～</p>
            <br />
            <p>陽気なおじさんのゆうじです！</p>
            <br />
            <p>みんな、久しぶり！</p>
            <br />
            <br />
            <p>実は、フリーになって</p>
            <p>やまにぃを超えちゃった</p>
            <p>って思ってるんですよ</p>
            <br />
            <br />
            <p>やまにぃには内緒ですよ</p>
            <p>また怒られちゃうから</p>
            <br />
            <p>カルシウム足りてないのかな～</p>
            <br />
            <br />
            <p>さて、今日はやまにいに、</p>
            <p>経営指南しちゃいます</p>
            <br />
            <p>やまにぃ大丈夫かな～</p>
            <br />
            <p>みんな</p>
            <p>応援してくださいね</p>
            <br />
            <p>よろしくで～す！！</p>
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

      {/* スクロールテキスト用のキーアニメーション定義 */}
      <style>{`
        @keyframes textScroll {
          0% {
            transform: translateY(100vh);
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
