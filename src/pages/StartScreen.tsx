
import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

const StartScreen = () => {
  const { handleScreenTransition } = useApp();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  // Use the newly uploaded image
  const [imagePath] = useState('/lovable-uploads/82eee5d5-fc67-4f2b-8b83-4f4985e71244.png');
  
  useEffect(() => {
    // Preload the image
    const img = new Image();
    img.src = imagePath;
    img.onload = () => {
      console.log('Image loaded successfully:', imagePath);
      setImageLoaded(true);
    };
    img.onerror = (e) => {
      console.error('Error loading image:', e);
    };
  }, [imagePath]);
  
  const handleStart = () => {
    handleScreenTransition('battle1');
    navigate('/battle1');
  };
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background Image - using img tag instead of background-image */}
      <img 
        src={imagePath}
        alt="Background"
        className="absolute inset-0 z-0 w-full h-full object-cover"
        style={{ display: imageLoaded ? 'block' : 'none' }}
        onLoad={() => console.log('Image rendered on screen')}
      />
      
      {/* Start Button */}
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
