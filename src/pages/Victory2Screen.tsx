
import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Victory2Screen: React.FC = () => {
  const { 
    player,
    battleTimer,
    totalComments,
    handleScreenTransition
  } = useApp();
  
  const navigate = useNavigate();
  const [isFollowed, setIsFollowed] = useState(false);
  
  // Format battle time nicely (MM:SS)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Show victory toast
    toast.success('ゆうじに勝利しました！', {
      description: 'おめでとうございます！',
      duration: 3000,
    });
  }, []);

  const handleContinue = () => {
    handleScreenTransition('endingA');
    navigate('/endingA');
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
      className="bg-white text-black flex flex-col min-h-screen items-center"
      style={{ width: '1080px', height: '1920px', maxWidth: '100vw', maxHeight: '100vh', margin: '0 auto' }}
    >
      {/* Empty space for future animation */}
      <div className="w-full aspect-square flex items-center justify-center"></div>
      
      {/* Main content container */}
      <div className="w-full px-8 flex-1 flex flex-col">
        {/* Live ended text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">ライブが終了しました</h2>
          <div className="flex items-center justify-center space-x-8 mt-6">
            <div className="border border-gray-300 rounded px-4 py-2 min-w-[120px]">
              {formatTime(battleTimer)}
            </div>
            <div className="flex items-center gap-2 border border-gray-300 rounded px-4 py-2 min-w-[120px]">
              <MessageCircle size={20} />
              <span>{totalComments}</span>
            </div>
          </div>
        </div>
        
        {/* Player profile card */}
        <div className="w-full border border-gray-200 rounded-xl p-4 flex items-center gap-4 mb-6">
          <img 
            src="/lovable-uploads/59046b14-26ff-441e-a70b-ceed5a5fcb16.png" 
            alt={player.name} 
            className="w-16 h-16 rounded-full object-cover"
          />
          
          <div className="flex-1">
            <div className="font-bold">{player.name}</div>
            <div className="text-sm text-gray-600">さよならワンマン経営</div>
          </div>
          
          <Button
            onClick={handleFollow}
            className={`rounded-full px-6 py-2 text-sm ${
              isFollowed 
                ? "bg-gray-200 text-gray-700" 
                : "bg-pink-500 text-white hover:bg-pink-600"
            }`}
          >
            {isFollowed ? "フォロー中" : "フォローする"}
          </Button>
        </div>
        
        {/* Level up notification */}
        <div className="w-full bg-gray-100 rounded-xl p-6 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-full w-8 h-8 flex items-center justify-center border border-pink-400 bg-pink-100">
              <span className="text-pink-500 font-bold">+1</span>
            </div>
            <span className="text-gray-800">経営スキルアップ</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-2 bg-gray-300 rounded-full flex-1">
              <div 
                className="h-full bg-pink-500 rounded-full" 
                style={{ width: `${(player.currentHp / player.maxHp) * 100}%` }}
              />
            </div>
            <span className="text-xs">{player.currentHp}/{player.maxHp}</span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="mt-auto pb-10 space-y-4">
          <Button
            onClick={handleContinue}
            className="w-full py-4 bg-white text-pink-500 border-2 border-pink-500 hover:bg-pink-50 font-bold rounded-full text-xl"
          >
            次へ進む
          </Button>
          
          <Button
            onClick={handleReturnToStart}
            className="w-full py-4 bg-pink-500 text-white hover:bg-pink-600 font-bold rounded-full text-xl"
          >
            スタートへ戻る
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Victory2Screen;
