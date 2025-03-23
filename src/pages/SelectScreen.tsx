
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import AudioPlayer from '@/components/AudioPlayer';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '@/components/MobileContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  SELECT_NORMAL_BGM, 
  SELECT_ALARM_SOUND, 
  SELECT_ASSAULT_BGM, 
  BUTTON_SOUND 
} from '@/constants/audioUrls';

const SelectScreen: React.FC = () => {
  const { bgmEnabled, toggleBgm, handleScreenTransition } = useApp();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showAssault, setShowAssault] = useState(false);
  const [assaultText, setAssaultText] = useState(false);
  const [assaultAlarm, setAssaultAlarm] = useState(false);
  const [showBottomMenu, setShowBottomMenu] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [timeouts, setTimeouts] = useState<NodeJS.Timeout[]>([]);
  const [buttonSound, setButtonSound] = useState<string | null>(null);
  
  useEffect(() => {
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [timeouts]);
  
  const handleSelectClick = () => {
    setShowAssault(true);
    setAssaultAlarm(true);
    // タップ時の効果音を削除 (BUTTON_SOUND の行を削除)
    
    const alarmTimeout = setTimeout(() => {
      setAssaultAlarm(false);
      setAssaultText(true);
    }, 3000);
    
    const battleTimeout = setTimeout(() => {
      // BGMを即座に停止するために setAssaultText(false) を追加
      setAssaultText(false);
      handleScreenTransition('battle2');
    }, 15000);
    
    setTimeouts(prev => [...prev, alarmTimeout, battleTimeout]);
  };

  const handleSkip = () => {
    setButtonSound(BUTTON_SOUND);
    timeouts.forEach(timeout => clearTimeout(timeout));
    // BGMを即座に停止するために setAssaultText(false) を追加
    setAssaultText(false);
    handleScreenTransition('battle2');
    navigate('/battle2');
  };

  const handleMenuButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setButtonSound(BUTTON_SOUND);
    setShowWarning(true);
    
    const warningTimeout = setTimeout(() => {
      setShowWarning(false);
    }, 3000);
    
    setTimeouts(prev => [...prev, warningTimeout]);
  };

  return (
    <MobileContainer backgroundClassName={!showAssault ? "bg-white" : "bg-black"}>
      {/* Main BGM for normal mode */}
      {!showAssault && (
        <AudioPlayer 
          src={SELECT_NORMAL_BGM} 
          loop={true} 
          autoPlay={true} 
          volume={0.7}
          id="select-normal-bgm"
        />
      )}
      
      {/* Alarm sound when assault mode activates */}
      {assaultAlarm && (
        <AudioPlayer 
          src={SELECT_ALARM_SOUND} 
          loop={false} 
          autoPlay={true} 
          volume={0.7}
          id="select-alarm-sound"
          key={`alarm-sound-${Date.now()}`} // Force remount
        />
      )}
      
      {/* BGM for assault mode */}
      {assaultText && (
        <AudioPlayer 
          src={SELECT_ASSAULT_BGM} 
          loop={true} 
          autoPlay={true} 
          volume={0.7}
          id="select-assault-bgm"
          key={`assault-bgm-${Date.now()}`} // Force remount
        />
      )}
      
      {/* Button sound effect player */}
      {buttonSound && (
        <AudioPlayer 
          src={buttonSound} 
          loop={false} 
          autoPlay={true} 
          volume={0.7}
          id="button-sound" 
          key={`button-sound-${Date.now()}`} // Force remount
        />
      )}
      
      {!showAssault ? (
        <div className="flex flex-col h-full bg-white">
          <div className="p-4 border-b flex items-center">
            <div className="mr-4">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </div>
            <h1 className="text-xl font-medium" style={{
              fontFamily: '"Noto Sans JP", sans-serif',
              fontStyle: 'normal',
              fontWeight: 500,
              color: 'rgb(0, 0, 0)',
              fontSize: '18px',
              lineHeight: '27px'
            }}>いまバトっているライブ</h1>
          </div>
          
          <div className="flex-1 overflow-y-auto" onClick={handleSelectClick}>
            <div className="p-4 border-b">
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/41b864fd-7b36-4c99-b236-a329a895a69c.png" 
                    alt="ゆうじ" 
                    className="rounded-md w-24 h-24 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="white" className="mr-1">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    LIVE
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="mb-1" style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 300,
                    color: 'rgb(0, 0, 0)',
                    fontSize: '15px',
                    lineHeight: '20px'
                  }}>さよならワンマン経営！最高の経営チームを作ろう！を語る</h2>
                  <p className="text-gray-600 text-sm hover:text-black transition-colors" style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '16px'
                  }}>やまね 🔥 とおる【経営参謀】</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t p-4">
            <div className="flex justify-around">
              <button className="flex flex-col items-center" onClick={handleMenuButtonClick}>
                <div className="w-6 h-6 mb-1">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                </div>
                <span className="text-xs">ホーム</span>
              </button>
              
              <button className="flex flex-col items-center" onClick={handleMenuButtonClick}>
                <div className="w-6 h-6 mb-1">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  </svg>
                </div>
                <span className="text-xs">フォロー中</span>
              </button>
              
              <button className="flex flex-col items-center" onClick={handleMenuButtonClick}>
                <div className="w-12 h-12 flex items-center justify-center text-white bg-purple-500 rounded-full border-4 border-white -mt-7">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </button>
              
              <button className="flex flex-col items-center" onClick={handleMenuButtonClick}>
                <div className="w-6 h-6 mb-1">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <span className="text-xs">お知らせ</span>
              </button>
              
              <button className="flex flex-col items-center" onClick={handleMenuButtonClick}>
                <div className="w-6 h-6 mb-1">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span className="text-xs">マイページ</span>
              </button>
            </div>
          </div>
          
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
      ) : (
        <div className="min-h-full bg-black relative overflow-hidden">
          {assaultAlarm && (
            <div className="absolute inset-0 z-10 animate-pulse">
              <img 
                src="/lovable-uploads/b8514c40-5c0b-49c1-895e-c1ca519e36cb.png"
                alt="ゆうじ"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {assaultText && (
            <>
              <img 
                src="/lovable-uploads/b8514c40-5c0b-49c1-895e-c1ca519e36cb.png"
                alt="ゆうじ"
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
              
              <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
                <div className="w-full text-center star-wars-crawl">
                  <div className="text-red-500 font-bold text-xl text-center animate-star-wars" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>
                    <p>うぇーい！みんな～</p>
                    <br />
                    <p>「ゆうじの陽気なおじさん」</p>
                    <br />
                    <p>でお馴染み、大久保です！！</p>
                    <br />
                    <br />
                    <p>って、おいおい！</p>
                    <br />
                    <p>それは俺のおじさんやないかい！！</p>
                    <br />
                    <br />
                    <p>陽気なおじさん＠ゆうじです！</p>
                    <br />
                    <br />
                    <p>今日はやってやりますよ</p>
                    <br />
                    <p>実は、フリーになって</p>
                    <br />
                    <p>やまにぃを超えちゃったかなって</p>
                    <br />
                    <p>思ってます</p>
                    <br />
                    <br />
                    <br />
                    <p>今日はやまにいに、</p>
                    <br />
                    <p>経営について指南しまくります</p>
                    <br />
                    <p>ちぇけら！</p>
                    <br />
                    <br />
                    <br />
                    <p>皆さん、</p>
                    <br />
                    <p>どうぞよろしくウェイで～す！！</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-12 right-12 z-20">
                <Button 
                  onClick={handleSkip}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg border-2 border-purple-400"
                >
                  <SkipForward size={24} />
                  <span className="font-bold">スキップ</span>
                </Button>
              </div>
            </>
          )}
        </div>
      )}
      
      <style>
        {`
        @keyframes star-wars {
          0% {
            transform: translateY(100vh) rotateX(25deg);
          }
          100% {
            transform: translateY(-100vh) rotateX(25deg);
          }
        }
        
        .animate-star-wars {
          animation: star-wars 12s linear;
        }
        
        .star-wars-crawl {
          perspective: 400px;
          overflow: hidden;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        `}
      </style>
    </MobileContainer>
  );
};

export default SelectScreen;
