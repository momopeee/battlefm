
import React from 'react';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

const StartScreen = () => {
  const { handleScreenTransition } = useApp();
  const navigate = useNavigate();
  
  const handleStart = () => {
    handleScreenTransition('battle1');
    navigate('/battle1');
  };
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('/lovable-uploads/9ed25f9b-c3ab-40dd-bb40-19e007f9faed.png')`,
          backgroundSize: 'cover',
        }}
      ></div>
      
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
