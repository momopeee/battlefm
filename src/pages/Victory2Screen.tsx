
import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '@/components/MobileContainer';

const Victory2Screen: React.FC = () => {
  const { 
    player,
    battleTimer,
    totalComments,
    handleScreenTransition,
    resetBattleState,
    pauseBattleTimer
  } = useApp();
  
  const navigate = useNavigate();
  const [isFollowed, setIsFollowed] = useState(false);
  const [isFromDefeat, setIsFromDefeat] = useState(false);
  const [finalBattleTime, setFinalBattleTime] = useState("00:00");
  
  // Format battle time as minutes:seconds
  const formatTime = (seconds: number): string => {
    // Ensure timer resets at 99:99
    if (seconds > 6000) { // 60 sec * 100 min
      return "99:99";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Ensure timer is stopped
    pauseBattleTimer();
    
    // 保存されたタイマー値があれば使用する
    const savedTime = sessionStorage.getItem('finalBattleTime');
    if (savedTime) {
      setFinalBattleTime(savedTime);
    } else {
      // Save the final battle time
      const formattedTime = formatTime(battleTimer);
      setFinalBattleTime(formattedTime);
      sessionStorage.setItem('finalBattleTime', formattedTime);
    }
    
    // Check if this screen was reached after a defeat
    const currentPath = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const fromDefeat = urlParams.get('from') === 'defeat' || sessionStorage.getItem('fromDefeat') === 'true';
    
    setIsFromDefeat(fromDefeat);
    
    // Show appropriate toast based on victory/defeat status
    if (fromDefeat) {
      sessionStorage.setItem('fromDefeat', 'true'); // Remember defeat status
      toast.error('ゆうじに敗北しました', {
        description: '次回は頑張りましょう！',
        duration: 3000,
      });
    } else {
      // Clear any previous defeat status
      sessionStorage.removeItem('fromDefeat');
      // Show victory toast
      toast.success('ゆうじに勝利しました！', {
        description: 'おめでとうございます！',
        duration: 3000,
      });
    }
  }, []);

  const handleContinue = () => {
    if (isFromDefeat) {
      // If coming from defeat, go to endingC
      handleScreenTransition('endingC');
      navigate('/endingC');
    } else {
      // Normal flow - go to endingA
      handleScreenTransition('endingA');
      navigate('/endingA');
    }
  };
  
  const handleReturnToStart = () => {
    // Reset battle state, clear defeat status, and redirect to index page
    sessionStorage.removeItem('fromDefeat');
    resetBattleState();
    handleScreenTransition('index');
    navigate('/');
  };
  
  const handleFightAgain = () => {
    // Reset battle state and clear defeat status
    sessionStorage.removeItem('fromDefeat');
    resetBattleState();
    handleScreenTransition('battle2');
    navigate('/battle2');
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
            
            {/* Time display - shows final battle time */}
            <div className="text-[12px] text-gray-500 mb-2">
              {finalBattleTime}
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
              src="/lovable-uploads/59046b14-26ff-441e-a70b-ceed5a5fcb16.png" 
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

export default Victory2Screen;
