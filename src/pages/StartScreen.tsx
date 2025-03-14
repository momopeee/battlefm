
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

const StartScreen = () => {
  const { bgmEnabled, toggleBgm, handleScreenTransition } = useApp();
  const [showText, setShowText] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Start the intro text scrolling animation after a delay
    const timer = setTimeout(() => {
      setShowText(true);
    }, 1000);
    
    // Automatically navigate to battle screen after animation completes
    // Animation duration is approximately 60 seconds based on the CSS
    const navigateTimer = setTimeout(() => {
      handleScreenTransition('battle1');
      navigate('/battle1');
    }, 61000); // 60s for animation + 1s initial delay
    
    return () => {
      clearTimeout(timer);
      clearTimeout(navigateTimer);
    };
  }, [navigate, handleScreenTransition]);
  
  const handleSkip = () => {
    handleScreenTransition('battle1');
    navigate('/battle1');
  };
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Layer 3 (Bottom): Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('/lovable-uploads/36af8791-0acd-4be7-97e0-e939b77e61af.png')`,
          backgroundSize: 'cover',
        }}
      ></div>
      
      {/* Layer 2 (Middle): Star Wars style scrolling text */}
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden perspective z-10">
          <div className="absolute w-full max-w-3xl text-center transform rotate3d">
            <div className="star-wars-text-content text-white text-lg md:text-xl leading-relaxed animate-text-scroll bg-black bg-opacity-30 p-6 rounded">
              <p>
                ファンキーな世の中をあなたはどう生きますか？
                <br />
                <br />
                一つの業種を一生涯やる必要がない自由な空気
                <br />
                <br />
                嫌な上司に我慢することなく転職できる環境
                <br />
                <br />
                大企業が良いとか中小企業がダメだとか
                <br />
                <br />
                ステレオタイプの価値観からの開放
                <br />
                <br />
                昔の成功体験ばかりを語るバブル世代の衰退
                <br />
                <br />
                家族のためにと自分の人生を押し殺す美学からの開放
                <br />
                <br />
                なんだかワクワクしますね。
                <br />
                <br />
                ニヤニヤが止まりません。
                <br />
                <br />
                ファンキーな世の中ですが
                <br />
                <br />
                どう捉えるか、どう生きるかは
                <br />
                <br />
                あなた次第なんです。
                <br />
                <br />
                そうなんです。
                <br />
                <br />
                あなたやあなたの会社に
                <br />
                <br />
                実力さえあれば実は楽しい世の中なんです。
                <br />
                <br />
                ファンキーな世の中を楽しめる
                <br />
                <br />
                実力を身につけましょう。
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Layer 1 (Top): Control Buttons */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="relative w-full h-full">
          {/* BGM Toggle Button */}
          <button
            onClick={toggleBgm}
            className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors pointer-events-auto"
          >
            {bgmEnabled ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color="white" />}
          </button>
          
          {/* Skip Button */}
          <Button
            onClick={handleSkip}
            className="absolute bottom-8 right-6 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white flex items-center gap-2 pointer-events-auto"
            variant="ghost"
          >
            <span>スキップ</span>
            <SkipForward size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
