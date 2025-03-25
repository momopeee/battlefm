
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import AudioPlayer from '@/components/AudioPlayer';
import { Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '@/components/MobileContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { SELECT_NORMAL_BGM, BUTTON_SOUND } from '@/constants/audioUrls';
import { Separator } from '@/components/ui/separator';

const SelectScreen: React.FC = () => {
  const { bgmEnabled, toggleBgm, handleScreenTransition } = useApp();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showWarning, setShowWarning] = useState(false);
  const [buttonSound, setButtonSound] = useState<string | null>(null);

  // 画面上部セクション（ヘッダー）がクリックされたら、battle2Screenへリダイレクトする
  const handleHeaderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setButtonSound(BUTTON_SOUND);
    handleScreenTransition('battle2');
    navigate('/battle2');
  };

  // メニューボタン押下時の警告表示（元のコードのまま）
  const handleMenuButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setButtonSound(BUTTON_SOUND);
    setShowWarning(true);
    setTimeout(() => {
      setShowWarning(false);
    }, 3000);
  };

  return (
    <MobileContainer backgroundClassName="bg-white">
      {/* 通常モード用BGM */}
      <AudioPlayer
        src={SELECT_NORMAL_BGM}
        loop={true}
        autoPlay={true}
        volume={0.7}
        id="select-normal-bgm"
      />

      {/* ボタン押下時の効果音 */}
      {buttonSound && (
        <AudioPlayer
          src={buttonSound}
          loop={false}
          autoPlay={true}
          volume={0.7}
          id="button-sound"
          key={`button-sound-${Date.now()}`}
        />
      )}

      <div className="flex flex-col h-full bg-white">
        {/* 画面上部セクション：クリックでbattle2Screenへ */}
        <div
          className="p-4 border-b flex items-center cursor-pointer"
          onClick={handleHeaderClick}
        >
          <div className="mr-4">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </div>
          <h1
            className="text-xl font-medium"
            style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 500,
              color: 'rgb(0, 0, 0)',
              fontSize: '18px',
              lineHeight: '27px'
            }}
          >
            いまバトっているライブ
          </h1>
        </div>

        {/* 中部セクション（クリック動作は削除） */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b">
            <div className="flex items-start space-x-3">
              <div className="relative">
                <img
                  src="/lovable-uploads/41b864fd-7b36-4c99-b236-a329a895a69c.png"
                  alt="ゆうじ"
                  className="rounded-md w-24 h-24 object-cover"
                />
                <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <svg
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="white"
                    className="mr-1"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  LIVE
                </div>
              </div>
              <div className="flex-1">
                <h2
                  className="mb-1"
                  style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 300,
                    color: 'rgb(0, 0, 0)',
                    fontSize: '15px',
                    lineHeight: '20px'
                  }}
                >
                  さよならワンマン経営！最高の経営チームを作ろう！を語る
                </h2>
                <p
                  className="text-gray-600 text-sm hover:text-black transition-colors"
                  style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '16px'
                  }}
                >
                  やまね 🔥 とおる【経営参謀】
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 画面下部セクション - 画像表示エリア */}
        <div className="p-4">
          <img 
            src="/lovable-uploads/0369bc15-40c5-4d18-9304-28624ac2e69f.png" 
            alt="Bottom navigation" 
            className="w-full" 
          />
        </div>

        {/* セパレーター */}
        <Separator className="h-[1px] bg-[#EEEEEE]" />

        {showWarning && (
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-24 bg-black bg-opacity-80 text-white px-4 py-2 rounded-full text-sm">
            余計なボタンを押さずに、ゲームに集中して下さい。まじで
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBgm();
          }}
          className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
        >
          {bgmEnabled ? <Volume2 size={24} color="black" /> : <VolumeX size={24} color="black" />}
        </button>
      </div>
    </MobileContainer>
  );
};

export default SelectScreen;
