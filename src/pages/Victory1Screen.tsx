
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
    handleScreenTransition
  } = useApp();
  
  const navigate = useNavigate();
  const [isFollowed, setIsFollowed] = useState(false);
  
  // Format battle time as hours:minutes
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours > 0 ? `${hours}:` : ''}${remainingMinutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
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
    handleScreenTransition('start');
    navigate('/start');
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
        width: '1080px', 
        height: '1920px', 
        maxWidth: '100vw', 
        maxHeight: '100vh', 
        margin: '0 auto',
        padding: '80px 40px',
        position: 'relative',
        border: '2px solid #000',
        borderRadius: '32px',
        boxSizing: 'border-box'
      }}
    >
      {/* Main content */}
      <div className="w-full flex flex-col items-center justify-center flex-1">
        {/* Live ended text */}
        <div className="text-center mb-16 mt-64">
          <h2 className="text-4xl font-bold mb-16">ライブが終了しました</h2>
          
          {/* Time display */}
          <div className="text-3xl font-medium mb-6">
            {formatTime(battleTimer)}
          </div>
          
          {/* Comment count */}
          <div className="flex items-center justify-center gap-2 text-3xl">
            <MessageCircle size={36} strokeWidth={1.5} />
            <span>{totalComments}</span>
          </div>
        </div>
        
        {/* Player profile with follow button */}
        <div className="flex items-center justify-center gap-4 mb-64">
          <img 
            src={player.icon} 
            alt={player.name} 
            className="w-16 h-16 rounded-full object-cover"
          />
          
          <div className="text-2xl font-medium">
            {player.name}
          </div>
          
          <Button
            onClick={handleFollow}
            className={`rounded-full px-6 py-2 text-base ${
              isFollowed 
                ? "bg-gray-200 text-gray-700" 
                : "bg-pink-500 text-white hover:bg-pink-600"
            }`}
            style={{ minWidth: '140px' }}
          >
            {isFollowed ? "フォロー中" : "フォローする"}
          </Button>
        </div>
      </div>
      
      {/* Action buttons at the bottom */}
      <div className="w-full space-y-6 mb-12">
        <Button
          onClick={handleContinue}
          className="w-full py-5 bg-white text-pink-500 border-2 border-pink-500 hover:bg-pink-50 font-bold rounded-full text-xl"
          style={{ height: '80px', fontSize: '26px' }}
        >
          次へ進む
        </Button>
        
        <Button
          onClick={handleReturnToStart}
          className="w-full py-5 bg-pink-500 text-white hover:bg-pink-600 font-bold rounded-full text-xl"
          style={{ height: '80px', fontSize: '26px' }}
        >
          スタートへ戻る
        </Button>
      </div>
    </div>
  );
};

export default Victory1Screen;
