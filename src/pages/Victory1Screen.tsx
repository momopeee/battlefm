
import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Victory1Screen: React.FC = () => {
  const { 
    player,
    battleTimer,
    totalComments,
    handleScreenTransition,
    resetBattleState
  } = useApp();
  
  const navigate = useNavigate();
  const [isFollowed, setIsFollowed] = useState(false);
  
  // Format battle time as minutes:seconds
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Show victory toast
    toast.success('そーそーに勝利しました！', {
      description: 'おめでとうございます！',
      duration: 3000,
    });
  }, []);

  const handleContinue = () => {
    handleScreenTransition('select');
    navigate('/select');
  };
  
  const handleReturnToStart = () => {
    // Modified to redirect to index page instead of start page
    handleScreenTransition('index');
    navigate('/');
  };
  
  const handleFightAgain = () => {
    // Reset battle state and redirect to battle1
    resetBattleState();
    handleScreenTransition('battle1');
    navigate('/battle1');
  };
  
  const handleFollow = () => {
    // Update followed state
    setIsFollowed(!isFollowed);
    
    // Open link in new tab when following
    if (!isFollowed) {
      window.open('https://stand.fm/channels/5e85f9834afcd35104858d5a', '_blank');
    }
  };

  return (
    <div 
      className="bg-white text-black flex flex-col items-center justify-between"
      style={{ 
        width: '100%', 
        height: '100vh', 
        maxWidth: '1080px', 
        maxHeight: '1920px', 
        margin: '0 auto',
        padding: '20px',
        position: 'relative',
        boxSizing: 'border-box'
      }}
    >
      {/* Main content - centered vertically */}
      <div className="w-full flex flex-col items-center justify-center flex-1">
        {/* Live ended text */}
        <div className="text-center mb-6">
          <h2 className="text-[17px] font-bold mb-4 text-black">ライブが終了しました</h2>
          
          {/* Time display */}
          <div className="text-[12px] text-gray-500 mb-2">
            {formatTime(battleTimer)}
          </div>
          
          {/* Comment count */}
          <div className="flex items-center justify-center gap-1 text-[12px] text-gray-500">
            <MessageCircle size={16} strokeWidth={1.5} />
            <span>{totalComments}</span>
          </div>
        </div>
        
        {/* Player profile with follow button */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <img 
            src={player.icon} 
            alt={player.name} 
            className="w-[35px] h-[35px] rounded-full object-cover"
          />
          
          <div className="text-[12px] font-bold text-black">
            {player.name}
          </div>
          
          <Button
            onClick={handleFollow}
            className={`rounded-full px-3 py-1 text-[10px] h-[22px] ${
              isFollowed 
                ? "bg-gray-200 text-gray-700" 
                : "bg-pink-500 text-white hover:bg-pink-600"
            }`}
            style={{ minWidth: '80px' }}
          >
            {isFollowed ? "フォロー中" : "フォローする"}
          </Button>
        </div>
      </div>
      
      {/* Action buttons at the bottom */}
      <div className="w-full space-y-3 pb-4">
        <Button
          onClick={handleContinue}
          className="w-full py-2 bg-white text-pink-500 border-2 border-pink-500 hover:bg-pink-50 font-bold rounded-full text-sm"
          style={{ height: '40px' }}
        >
          次へ進む
        </Button>
        
        <Button
          onClick={handleFightAgain}
          className="w-full py-2 bg-white text-purple-500 border-2 border-purple-500 hover:bg-purple-50 font-bold rounded-full text-sm"
          style={{ height: '40px' }}
        >
          もう一度戦う
        </Button>
        
        <Button
          onClick={handleReturnToStart}
          className="w-full py-2 bg-pink-500 text-white hover:bg-pink-600 font-bold rounded-full text-sm"
          style={{ height: '40px' }}
        >
          スタートへ戻る
        </Button>
      </div>
    </div>
  );
};

export default Victory1Screen;
