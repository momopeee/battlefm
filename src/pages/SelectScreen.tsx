
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import AudioPlayer from '@/components/AudioPlayer';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SelectScreen: React.FC = () => {
  const { bgmEnabled, toggleBgm, handleScreenTransition } = useApp();
  const navigate = useNavigate();
  const [showAssault, setShowAssault] = useState(false);
  const [assaultText, setAssaultText] = useState(false);
  const [assaultAlarm, setAssaultAlarm] = useState(false);
  const [showBottomMenu, setShowBottomMenu] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [timeouts, setTimeouts] = useState<NodeJS.Timeout[]>([]);
  
  useEffect(() => {
    // Reset any game state for the next battle
    return () => {
      // Clear all timeouts when component unmounts
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [timeouts]);
  
  const handleSelectClick = () => {
    // Start assault mode sequence
    setShowAssault(true);
    setAssaultAlarm(true);
    
    // Play alarm for 3 seconds, then show scrolling text
    const alarmTimeout = setTimeout(() => {
      setAssaultAlarm(false);
      setAssaultText(true);
    }, 3000);
    
    // Move to battle2 after 15 seconds total
    const battleTimeout = setTimeout(() => {
      handleScreenTransition('battle2');
      navigate('/battle2');
    }, 15000);
    
    setTimeouts(prev => [...prev, alarmTimeout, battleTimeout]);
  };

  const handleSkip = () => {
    // Clear any existing timeouts
    timeouts.forEach(timeout => clearTimeout(timeout));
    // Skip directly to battle2
    handleScreenTransition('battle2');
    navigate('/battle2');
  };

  const handleMenuButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowWarning(true);
    
    // Hide warning after 3 seconds
    const warningTimeout = setTimeout(() => {
      setShowWarning(false);
    }, 3000);
    
    setTimeouts(prev => [...prev, warningTimeout]);
  };
  
  return (
    <div className="relative min-h-screen bg-white">
      {!showAssault && (
        <>
          {/* Twitter-like interface */}
          <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="p-4 border-b flex items-center">
              <div className="mr-4">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </div>
              <h1 className="text-xl font-medium">いまバトっているライブ</h1>
            </div>
            
            {/* Main content */}
            <div className="flex-1 overflow-y-auto" onClick={handleSelectClick}>
              {/* Stream preview */}
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
                    <h2 className="font-bold text-lg mb-1">さよならワンマン経営！最高の経営チームを作ろう！を語る</h2>
                    <p className="text-gray-600 text-sm">やまね 🔥 とおる【経営参謀】</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom menu */}
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
            
            {/* Warning message */}
            {showWarning && (
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-24 bg-black bg-opacity-80 text-white px-4 py-2 rounded-full text-sm">
                余計なボタンを押さずに、ゲームに集中して下さい。まじで
              </div>
            )}
          </div>
          
          {/* BGM Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBgm();
            }}
            className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
          >
            {bgmEnabled ? <Volume2 size={24} color="black" /> : <VolumeX size={24} color="black" />}
          </button>
        </>
      )}
      
      {/* Assault Mode */}
      {showAssault && (
        <div className="min-h-screen bg-black relative overflow-hidden">
          {/* Audio */}
          {assaultAlarm && <AudioPlayer src="/audios/keihou.mp3" loop={false} autoPlay />}
          
          {/* Flashing image during alarm */}
          {assaultAlarm && (
            <div className="absolute inset-0 z-10 animate-pulse">
              <img 
                src="/lovable-uploads/b8514c40-5c0b-49c1-895e-c1ca519e36cb.png"
                alt="ゆうじ"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Static image and scrolling text after alarm */}
          {assaultText && (
            <>
              <img 
                src="/lovable-uploads/b8514c40-5c0b-49c1-895e-c1ca519e36cb.png"
                alt="ゆうじ"
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
              
              <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
                <div className="w-full text-center star-wars-crawl">
                  <div className="text-red-500 font-bold text-xl text-center animate-star-wars">
                    <p>うぇーい！ゆうじの陽気なおじさんです！！</p>
                    <br />
                    <p>って、それはただの俺のおじさんやないかい！！</p>
                    <br />
                    <p>陽気なおじさん＠ゆうじです！</p>
                    <br />
                    <p>今日はやまにいに、経営について指南してやりますから、</p>
                    <br />
                    <p>皆さん、どうぞよろしくウェイで～す！！</p>
                  </div>
                </div>
              </div>
              
              {/* Skip button - only show when text is scrolling */}
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

      <style jsx>{`
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
        `}</style>
    </div>
  );
};

export default SelectScreen;
