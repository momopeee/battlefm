
import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Volume2, VolumeX, Trophy, Star, Home, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Victory1Screen: React.FC = () => {
  const { 
    bgmEnabled, 
    toggleBgm,
    handleScreenTransition,
    player
  } = useApp();
  
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  
  useEffect(() => {
    // Show victory toast
    toast.success('そーそーに勝利しました！', {
      description: 'おめでとうございます！',
      duration: 3000,
    });
    
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    handleScreenTransition('select');
    navigate('/select');
  };
  
  const handleReturnToStart = () => {
    handleScreenTransition('start');
    navigate('/start');
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-purple-900 to-indigo-950 text-white relative overflow-hidden"
      style={{ 
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif'
      }}
    >
      {/* Confetti effect */}
      {showConfetti && (
        <div className="confetti-container absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                background: `hsl(${Math.random() * 360}, 100%, 50%)`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                opacity: Math.random(),
                animation: `fall ${Math.random() * 3 + 2}s linear forwards, spin ${Math.random() * 3 + 2}s linear infinite`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Victory header with return to start button */}
      <div className="w-full flex justify-between items-center pt-8 px-6">
        <Button
          variant="outline"
          className="bg-purple-700/50 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-white border-purple-500 hover:bg-purple-600/60"
          onClick={handleReturnToStart}
        >
          <Home className="text-yellow-400" size={20} />
          <span>スタートに戻る</span>
        </Button>
        
        <div className="bg-purple-700/50 backdrop-blur-sm rounded-full px-8 py-4 flex items-center gap-3 animate-bounce shadow-lg">
          <Trophy className="text-yellow-400" size={32} />
          <h1 className="text-3xl font-bold text-white">勝利</h1>
        </div>
        
        {/* Close button */}
        <Button
          variant="outline"
          className="bg-purple-700/50 backdrop-blur-sm rounded-full p-3 flex items-center justify-center text-white border-purple-500 hover:bg-purple-600/60"
          onClick={handleContinue}
        >
          <X size={24} />
        </Button>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col items-center w-full px-8 py-6 bg-white/10 backdrop-blur-sm rounded-2xl mx-4 shadow-xl animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">ライブが終了しました</h2>
          <div className="flex items-center justify-center gap-2">
            <Star className="text-yellow-400 fill-yellow-400" size={20} />
            <p className="text-yellow-200">レベルアップ</p>
            <Star className="text-yellow-400 fill-yellow-400" size={20} />
          </div>
          <p className="text-gray-300 mt-2 text-sm">バトル時間: 15:46</p>
        </div>
        
        <div className="flex items-center gap-3 mb-6 bg-purple-800/50 p-3 rounded-full">
          <div className="rounded-full w-8 h-8 flex items-center justify-center border border-yellow-400 bg-yellow-500/20">
            <span className="text-yellow-300 font-bold">+1</span>
          </div>
          <span className="text-white">経営スキルアップ</span>
        </div>
        
        {/* Player profile */}
        <div className="flex items-center gap-4 mt-4 w-full bg-white/5 p-4 rounded-xl">
          <div className="relative">
            <div className="absolute -top-1 -right-1 bg-yellow-500 text-xs px-2 py-0.5 rounded-full font-bold shadow-md">
              勝者
            </div>
            <img 
              src="/lovable-uploads/c1b2b6d0-3acd-4ea0-b336-0631411ff128.png" 
              alt="とおる" 
              className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400 shadow-lg"
            />
          </div>
          
          <div className="flex-grow">
            <p className="font-bold text-lg">とおる＠経営参謀</p>
            <p className="text-gray-300 text-sm">さよならワンマン経営</p>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-2 bg-gray-700 rounded-full w-full">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" 
                  style={{ width: `${(player.currentHp / player.maxHp) * 100}%` }}
                />
              </div>
              <span className="text-xs whitespace-nowrap">{player.currentHp}/{player.maxHp} HP</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom buttons */}
      <div className="w-full p-6 space-y-3">
        <Button
          className="w-full py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-full text-lg shadow-lg shadow-purple-900/30"
          onClick={handleContinue}
        >
          次へ進む
        </Button>
      </div>
      
      {/* BGM Toggle Button */}
      <button
        onClick={toggleBgm}
        className="fixed top-6 right-6 z-20 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
      >
        {bgmEnabled ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color="white" />}
      </button>
      
      {/* CSS for confetti animation */}
      <style>
        {`
        @keyframes fall {
          to {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .confetti {
          position: absolute;
          border-radius: 0;
          transform-origin: center;
        }
        `}
      </style>
    </div>
  );
};

export default Victory1Screen;
