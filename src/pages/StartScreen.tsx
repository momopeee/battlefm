
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import AudioPlayer from '@/components/AudioPlayer';

const StartScreen = () => {
  const { bgmEnabled, toggleBgm, handleScreenTransition } = useApp();
  const [showText, setShowText] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  
  // Define the background image URL
  const backgroundImageUrl = "https://pbs.twimg.com/profile_images/1343537293798199296/is99I-hS_400x400.jpg";
  
  // Define the opening BGM URL
  const openingBgmUrl = "https://soundcloud.com/davis-momoyama/hazime/s-QTRlO3TfBkE?in=davis-momoyama/sets/battlefm/s-NbrA67b7tx5";
  
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
    
    // Preload the background image
    const img = new Image();
    img.src = backgroundImageUrl;
    img.onload = () => {
      setImageLoaded(true);
      console.log('Background image loaded successfully');
    };
    img.onerror = (e) => {
      console.error('Error loading background image:', e);
    };
    
    return () => {
      clearTimeout(timer);
      clearTimeout(navigateTimer);
    };
  }, [navigate, handleScreenTransition, backgroundImageUrl]);
  
  const handleSkip = () => {
    handleScreenTransition('battle1');
    navigate('/battle1');
  };
  
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* BGM Audio Player */}
      <AudioPlayer src={openingBgmUrl} loop autoPlay />
      
      {/* Background Image */}
      <img 
        src={backgroundImageUrl}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ opacity: 0.7 }}
        onError={(e) => {
          console.error('Image failed to load');
          e.currentTarget.style.display = 'none';
        }}
      />
      
      {/* Display loading or error message if image not loaded */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-5 text-white">
          Loading background image...
        </div>
      )}
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
      
      {/* Star Wars style scrolling text */}
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden perspective z-20">
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
      
      {/* BGM Toggle Button */}
      <button
        onClick={toggleBgm}
        className="absolute top-6 right-6 z-30 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
      >
        {bgmEnabled ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color="white" />}
      </button>
      
      {/* Skip Button */}
      <Button
        onClick={handleSkip}
        className="absolute bottom-8 right-6 z-30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white flex items-center gap-2"
        variant="ghost"
      >
        <span>スキップ</span>
        <SkipForward size={18} />
      </Button>
    </div>
  );
};

export default StartScreen;
