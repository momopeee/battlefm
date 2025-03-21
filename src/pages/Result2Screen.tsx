import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '@/components/MobileContainer';
import AudioPlayer from '@/components/AudioPlayer';

const Result2Screen: React.FC = () => {
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
  const [finalBattleTime, setFinalBattleTime] = useState("00:00");
  
  const defeatBgmUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/e30ccbfa-dce6-4565-846f-299249020356/%E8%A6%87%E8%80%85%E3%81%A8%E5%91%BC%E3%81%B0%E3%82%8C%E3%81%9F%E6%95%97%E5%8C%97%E8%80%85%E3%81%AE%E6%97%A5%E5%B8%B8.mp3?table=block&id=1ba25ac2-cb4e-80ee-8559-fdcf6a1de25a&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742508000000&signature=Z6J2lRT9AL_7HyFiCAYGvUWFC4JNaio4ounIuRFN7y0&downloadName=%E8%A6%87%E8%80%85%E3%81%A8%E5%91%BC%E3%81%B0%E3%82%8C%E3%81%9F%E6%95%97%E5%8C%97%E8%80%85%E3%81%AE%E6%97%A5%E5%B8%B8.mp3";

  const formatTime = (seconds: number): string => {
    if (seconds > 6000) {
      return "99:99";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    pauseBattleTimer();
    
    const savedTime = sessionStorage.getItem('finalBattleTime');
    if (savedTime) {
      setFinalBattleTime(savedTime);
    } else {
      const formattedTime = formatTime(battleTimer);
      setFinalBattleTime(formattedTime);
      sessionStorage.setItem('finalBattleTime', formattedTime);
    }
    
    toast.error('ゆうじに敗北しました', {
      description: '次回は頑張りましょう！',
      duration: 3000,
      position: 'top-center',
    });
  }, [battleTimer, pauseBattleTimer]);

  const handleContinue = () => {
    handleScreenTransition('endingC');
    navigate('/endingC');
  };
  
  const handleReturnToStart = () => {
    resetBattleState();
    handleScreenTransition('index');
    navigate('/');
  };
  
  const handleFightAgain = () => {
    resetBattleState();
    handleScreenTransition('battle2');
    navigate('/battle2');
  };
  
  const handleFollow = () => {
    setIsFollowed(!isFollowed);
    if (!isFollowed) {
      window.open('https://stand.fm/channels/5e85f9834afcd35104858d5a', '_blank');
    }
  };

  return (
    <MobileContainer backgroundClassName="bg-white">
      <AudioPlayer src={defeatBgmUrl} loop={true} autoPlay={true} />
      
      <div 
        className="bg-white text-black flex flex-col items-center justify-between h-full"
        style={{ 
          padding: '20px',
          boxSizing: 'border-box'
        }}
      >
        <div className="w-full flex flex-col items-center justify-center flex-1">
          <div className="text-center mb-6">
            <h2 className="text-[17px] font-bold mb-4 text-black">ライブが終了しました</h2>
            <div className="text-[12px] text-gray-500 mb-2">
              {finalBattleTime}
            </div>
            <div className="flex items-center justify-center gap-1 text-[12px] text-gray-500">
              <MessageCircle size={16} strokeWidth={1.5} />
              <span>{comments.length}</span>
            </div>
          </div>
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
        <div className="w-full flex flex-col items-center space-y-3 pb-4">
          <Button
            onClick={handleContinue}
            className="w-48 sm:w-64 py-2 bg-white text-pink-500 border-2 border-pink-500 hover:bg-pink-50 font-bold rounded-full text-sm"
            style={{ height: '40px' }}
          >
            次へ進む
          </Button>
          
          <Button
            onClick={handleFightAgain}
            className="w-48 sm:w-64 py-2 bg-white text-purple-500 border-2 border-purple-500 hover:bg-purple-50 font-bold rounded-full text-sm"
            style={{ height: '40px' }}
          >
            もう一度戦う
          </Button>
          
          <Button
            onClick={handleReturnToStart}
            className="w-48 sm:w-64 py-2 bg-pink-500 text-white hover:bg-pink-600 font-bold rounded-full text-sm"
            style={{ height: '40px' }}
          >
            スタートへ戻る
          </Button>
        </div>
      </div>
    </MobileContainer>
  );
};

export default Result2Screen;
