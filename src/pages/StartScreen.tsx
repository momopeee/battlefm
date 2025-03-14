
import React, { useEffect, useState } from 'react';
import { Play, ImageOff, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

const StartScreen = () => {
  const { handleScreenTransition } = useApp();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Main image with fallback options
  const mainImagePath = '/lovable-uploads/a8179cdd-effe-4cd5-8294-5aefb2355108.png';
  const fallbackImagePath = '/lovable-uploads/c1b2b6d0-3acd-4ea0-b336-0631411ff128.png';
  
  const [imagePath, setImagePath] = useState(mainImagePath);
  
  useEffect(() => {
    // Reset states when trying a new image
    setIsLoading(true);
    setImageError(false);
    setImageLoaded(false);
    
    // Create an image element to check if it loads successfully
    const img = document.createElement('img');
    img.src = imagePath;
    
    img.onload = () => {
      console.log('Image loaded successfully:', imagePath);
      setImageLoaded(true);
      setIsLoading(false);
    };
    
    img.onerror = (e) => {
      console.error('Error loading image:', e);
      setImageError(true);
      setIsLoading(false);
      
      // If main image fails, try fallback image
      if (imagePath === mainImagePath) {
        console.log('Trying fallback image');
        setImagePath(fallbackImagePath);
      }
    };
    
    return () => {
      // Clean up
      img.onload = null;
      img.onerror = null;
    };
  }, [imagePath]);
  
  const handleStart = () => {
    handleScreenTransition('battle1');
    navigate('/battle1');
  };
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black text-white">
          <Loader size={48} className="animate-spin mb-4" />
          <p>読み込み中...</p>
        </div>
      )}
      
      {/* Error state with Image icon */}
      {imageError && !isLoading && imagePath === fallbackImagePath && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black text-white">
          <ImageOff size={48} className="mb-4 text-red-500" />
          <p>画像を読み込めませんでした</p>
        </div>
      )}
      
      {/* Background Image - only show when loaded */}
      {imageLoaded && (
        <img 
          src={imagePath}
          alt="Background"
          className="absolute inset-0 z-0 w-full h-full object-cover"
          onLoad={() => console.log('Image rendered on screen')}
        />
      )}
      
      {/* Start Button - show even if image failed */}
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
