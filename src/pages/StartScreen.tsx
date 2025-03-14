
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
    handleScreenTransition('battle1');
    navigate('/battle1');
  };
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
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
