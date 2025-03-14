
import React, { useEffect, useState } from 'react';
import { Play, ImageOff, Loader, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import BgmPlayer from '@/components/BgmPlayer';

const StartScreen = () => {
  const { handleScreenTransition, bgmEnabled, toggleBgm } = useApp();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  
  // Main image and fallback image paths
  const mainImagePath = '/lovable-uploads/a8179cdd-effe-4cd5-8294-5aefb2355108.png';
  const fallbackImagePath = '/lovable-uploads/c1b2b6d0-3acd-4ea0-b336-0631411ff128.png';
  
  const [currentImage, setCurrentImage] = useState(mainImagePath);
  
  useEffect(() => {
    // Reset loading states
    setIsLoading(true);
    setImageError(false);
    setImageLoaded(false);
    
    // Create a new image element to check if it loads
    const img = new Image();
    img.src = currentImage;
    
    img.onload = () => {
      console.log('Image loaded successfully:', currentImage);
      setImageLoaded(true);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      console.error('Failed to load image:', currentImage);
      setImageError(true);
      setIsLoading(false);
      
      // If main image fails, try fallback
      if (currentImage === mainImagePath) {
        console.log('Trying fallback image');
        setCurrentImage(fallbackImagePath);
      }
    };
  }, [currentImage, mainImagePath, fallbackImagePath]);
  
  const handleStart = () => {
    setShowIntro(false);
    handleScreenTransition('battle1');
    navigate('/battle1');
  };

  // Star Wars intro text content
  const introText = `
    ファンキーな世の中をあなたはどう生きますか？
    <br>
    一つの業種を一生涯やる必要がない自由な空気
    <br>
    嫌な上司に我慢することなく転職できる環境
    <br>
    大企業が良いとか中小企業がダメだとか
    <br>
    ステレオタイプの価値観からの開放
    <br>
    昔の成功体験ばかりを語るバブル世代の衰退
    <br>
    家族のためにと自分の人生を押し殺す美学からの開放
    <br>
    なんだかワクワクしますね。
    <br>
    ニヤニヤが止まりません。
    <br>
    ファンキーな世の中ですが
    <br>
    どう捉えるか、どう生きるかは
    <br>
    あなた次第なんです。
    <br>
    そうなんです。
    <br>
    あなたやあなたの会社に
    <br>
    実力さえあれば実は楽しい世の中なんです。
    <br>
    ファンキーな世の中を楽しめる
    <br>
    実力を身につけましょう。
  `;
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* BGM Player */}
      <BgmPlayer src="/bgm-start.mp3" />
      
      {/* Sound Toggle */}
      <div className="absolute top-4 right-4 z-30">
        <Toggle 
          pressed={bgmEnabled} 
          onPressedChange={toggleBgm}
          className="p-2 backdrop-blur-sm bg-black/20 hover:bg-black/40 rounded-full"
          aria-label="Toggle sound"
        >
          {bgmEnabled ? <Volume2 className="text-white" /> : <VolumeX className="text-white" />}
        </Toggle>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black text-white">
          <Loader size={48} className="animate-spin mb-4" />
          <p>読み込み中...</p>
        </div>
      )}
      
      {/* Error message */}
      {imageError && !isLoading && currentImage === fallbackImagePath && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black text-white">
          <ImageOff size={48} className="mb-4 text-red-500" />
          <p>画像を読み込めませんでした</p>
        </div>
      )}
      
      {/* Background image */}
      {imageLoaded && (
        <img 
          src={currentImage}
          alt="Background"
          className="absolute inset-0 z-0 w-full h-full object-cover"
        />
      )}
      
      {/* Star Wars style text intro */}
      {showIntro && imageLoaded && (
        <div className="absolute inset-0 z-20 overflow-hidden perspective">
          <div className="w-full h-full flex justify-center">
            <div className="rotate3d relative w-full max-w-2xl">
              <div 
                className="absolute bottom-0 left-0 right-0 text-center text-white font-hiragino text-xl p-8 star-wars-text-content"
                dangerouslySetInnerHTML={{ __html: introText.replace(/<br>/g, '<br>') }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Start button */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <Button
          onClick={handleStart}
          className="bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white text-xl px-8 py-6 rounded-full flex items-center gap-2 shadow-lg transform transition-all hover:scale-105"
          variant="ghost"
        >
          <span>START</span>
          <Play size={24} />
        </Button>
      </div>
    </div>
  );
};

export default StartScreen;
