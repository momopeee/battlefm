
import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '@/components/MobileContainer';
import AudioPlayer from '@/components/AudioPlayer';

const Result1Screen: React.FC = () => {
  const { 
    player,
    battleTimer,
    comments,
    handleScreenTransition,
    resetBattleState,
    pauseBattleTimer
  } = useApp();
  
  const navigate = useNavigate();
  const [isFollowed, setIsFollowed] = useState(false);
  const [finalBattleTime, setFinalBattleTime] = useState("");
  
  // Defeat BGM URL
  const defeatBgmUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/e30ccbfa-dce6-4565-846f-299249020356/%E8%A6%87%E8%80%85%E3%81%A8%E5%91%BC%E3%81%B0%E3%82%8C%E3%81%9F%E6%95%97%E5%8C%97%E8%80%85%E3%81%AE%E6%97%A5%E5%B8%B8.mp3?table=block&id=1ba25ac2-cb4e-80ee-8559-fdcf6a1de25a&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742508000000&signature=Z6J2lRT9AL_7HyFiCAYGvUWFC4JNaio4ounIuRFN7y0&downloadName=%E8%A6%87%E8%80%85%E3%81%A8%E5%91%BC%E3%81%B0%E3%82%8C%E3%81%9F%E6%95%97%E5%8C%97%E8%80%85%E3%81%AE%E6%97%A5%E5%B8%B8.mp3";
  
  // Format battle time as minutes:seconds
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Ensure timer is stopped
    pauseBattleTimer();
    
    // Save the final battle time
    setFinalBattleTime(formatTime(battleTimer));
    
    // Show defeat toast - display from top only once
    toast.error('そーそーに敗北しました', {
      description: '次回は頑張りましょう！',
      duration: 3000,
      position: 'top-center',
    });
  }, [battleTimer, pauseBattleTimer]);

  const handleContinue = () => {
    handleScreenTransition('endingB');
    navigate('/endingB');
  };
  
  const handleReturnToStart = () => {
    // Reset battle state and redirect to index page
    resetBattleState();
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
    <MobileContainer backgroundClassName="bg-white">
      {/* Defeat BGM */}
      <AudioPlayer src={defeatBgmUrl} loop={true} autoPlay={true} />
      
      <div 
        className="bg-white text-black flex flex-col items-center justify-between h-full"
        style={{ 
          padding: '20px',
          boxSizing: 'border-box'
        }}
      >
        {/* Main content - centered vertically */}
        <div className="w-full flex flex-col items-center justify-center flex-1">
          {/* Live ended text */}
          <div className="text-center mb-6">
            <h2 className="text-[17px] font-bold mb-4 text-black">ライブが終了しました</h2>
            
            {/* Time display - uses final battle timer from state */}
            <div className="text-[12px] text-gray-500 mb-2">
              {finalBattleTime}
            </div>
            
            {/* Comment count - shows total comments including system */}
            <div className="flex items-center justify-center gap-1 text-[12px] text-gray-500">
              <MessageCircle size={16} strokeWidth={1.5} />
              <span>{comments.length}</span>
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
    </MobileContainer>
  );
};

export default Result1Screen;
