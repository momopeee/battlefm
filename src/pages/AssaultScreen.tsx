import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import AudioPlayer from '@/components/AudioPlayer';
import MobileContainer from '@/components/MobileContainer';
import { SELECT_ASSAULT_BGM } from '@/constants/audioUrls';
import { useIsMobile } from '@/hooks/use-mobile';

const AssaultScreen: React.FC = () => {
  const { bgmEnabled, toggleBgm, handleScreenTransition } = useApp();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [actionInProgress, setActionInProgress] = useState(false);

  // スキップボタン押下時（およびキーボード操作）に battle2Screen へ遷移
  const handleSkip = useCallback(() => {
    if (actionInProgress) return;
    setActionInProgress(true);
    handleScreenTransition('battle2');
    navigate('/battle2');
  }, [actionInProgress, handleScreenTransition, navigate]);

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
          zIndex: 0,
        }}
      />

      {/* AssaultBGM のループ再生 */}
      <AudioPlayer
        src={SELECT_ASSAULT_BGM}
        loop={true}
        autoPlay={true}
        volume={0.7}
        id="assault-bgm"
      />

      {/* 上位レイヤー：その他のUI要素（テキストスクロールは削除） */}

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
