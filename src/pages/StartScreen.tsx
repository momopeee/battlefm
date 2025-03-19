import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import AudioPlayer from '@/components/AudioPlayer';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const MOBILE_WIDTH = 375;
const MOBILE_HEIGHT = 812;
const ASPECT_RATIO = MOBILE_WIDTH / MOBILE_HEIGHT;

const StartScreen = () => {
  const { bgmEnabled, toggleBgm, handleScreenTransition } = useApp();
  const [showText, setShowText] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isMobile = useIsMobile();
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Define the background image URL
  const backgroundImageUrl = "https://pbs.twimg.com/profile_images/1343537293798199296/is99I-hS_400x400.jpg";
  
  // Define the opening BGM URL
  const openingBgmUrl = "https://soundcloud.com/davis-momoyama/hazime/s-QTRlO3TfBkE?in=davis-momoyama/sets/battlefm/s-NbrA67b7tx5";
  
  // Update container dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    
    // Initial update
    updateDimensions();
    
    // Add event listener for window resize
    window.addEventListener('resize', updateDimensions);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
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
    <div 
      ref={containerRef}
      className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden"
    >
      {/* Blurred background for desktop only */}
      {!isMobile && (
        <div 
          className="absolute inset-0 w-full h-full z-0"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(30px)',
            opacity: 0.7,
            transform: 'scale(1.1)'
          }}
        />
      )}
      
      {/* Main content container with mobile aspect ratio */}
      <div 
        className={`relative z-10 overflow-hidden ${isMobile ? 'w-full h-full' : 'mx-auto rounded-2xl shadow-2xl'}`}
        style={{
          width: isMobile ? '100%' : `${MOBILE_WIDTH}px`,
          maxWidth: isMobile ? '100%' : `${MOBILE_WIDTH}px`,
          height: isMobile ? '100vh' : `${MOBILE_HEIGHT}px`,
          maxHeight: isMobile ? '100vh' : `${MOBILE_HEIGHT}px`,
          backgroundColor: '#000000'
        }}
      >
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
        
        {/* Star Wars style scrolling text */}
        {showText && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden perspective z-20">
            <div className="absolute w-full max-w-3xl text-center transform rotate3d">
              <div className="star-wars-text-content text-white -webkit-text-stroke-[1px] -webkit-text-stroke-black leading-relaxed animate-text-scroll p-6 rounded" style={{ fontSize: 'calc(15px - 3px)' }}>
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
    </div>
  );
};

export default StartScreen;
