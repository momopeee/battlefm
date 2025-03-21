
import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '@/components/MobileContainer';
import AudioPlayer from '@/components/AudioPlayer';
import { RESULT_SCREEN_BGM, BUTTON_SOUND } from '@/constants/audioUrls';

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
  const [buttonSound, setButtonSound] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  
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
    
    console.log('Rendered Result1Screen');
    console.log('Attempting to play defeat BGM:', RESULT_SCREEN_BGM);
  }, [battleTimer, pauseBattleTimer]);

  // Helper function to handle button clicks with sound and prevent double-clicks
  const playButtonSoundAndDoAction = (action: () => void) => {
    if (actionInProgress) return;
    
    setActionInProgress(true);
    setButtonSound(BUTTON_SOUND);
    
    // Wait for sound to start playing before action
    setTimeout(() => {
      action();
      // Reset button sound and action in progress
      setTimeout(() => {
        setButtonSound(null);
        setActionInProgress(false);
      }, 500);
    }, 300);
  };

  const handleContinue = () => {
    playButtonSoundAndDoAction(() => {
      console.log('Navigating to endingB from Result1Screen');
      handleScreenTransition('endingB');
      navigate('/endingB');
    });
  };
  
  const handleReturnToStart = () => {
    playButtonSoundAndDoAction(() => {
      console.log('Returning to start from Result1Screen');
      resetBattleState();
      handleScreenTransition('index');
      navigate('/');
    });
  };
  
  const handleFightAgain = () => {
    playButtonSoundAndDoAction(() => {
      console.log('Fighting again from Result1Screen');
      resetBattleState();
      handleScreenTransition('battle1');
      navigate('/battle1');
    });
  };
  
  const handleFollow = () => {
    playButtonSoundAndDoAction(() => {
      setIsFollowed(!isFollowed);
      if (!isFollowed) {
        window.open('https://stand.fm/channels/5e85f9834afcd35104858d5a', '_blank');
      }
    });
  };

  // Handle sound effect completion
  const handleSoundEnded = () => {
    console.log(`Button sound effect completed`);
  };

  return (
    <MobileContainer backgroundClassName="bg-white">
      {/* Use the constant for the defeat BGM */}
      <AudioPlayer 
        src={RESULT_SCREEN_BGM} 
        loop={true} 
        autoPlay={true} 
        volume={0.7}
        id="result1-bgm" 
      />
      
      {/* Button sound effect player */}
      {buttonSound && (
        <AudioPlayer 
          src={buttonSound} 
          loop={false} 
          autoPlay={true} 
          volume={0.7}
          id="button-sound" 
          onEnded={handleSoundEnded}
        />
      )}
      
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
              disabled={actionInProgress}
              className={`rounded-full px-3 py-1 text-[10px] h-[22px] ${
                isFollowed 
                  ? "bg-gray-200 text-gray-700" 
                  : "bg-pink-500 text-white hover:bg-pink-600"
              } ${actionInProgress ? 'opacity-70' : ''}`}
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
            disabled={actionInProgress}
            className={`w-full py-2 bg-white text-pink-500 border-2 border-pink-500 hover:bg-pink-50 font-bold rounded-full text-sm ${actionInProgress ? 'opacity-70' : ''}`}
            style={{ height: '40px' }}
          >
            次へ進む
          </Button>
          
          <Button
            onClick={handleFightAgain}
            disabled={actionInProgress}
            className={`w-full py-2 bg-white text-purple-500 border-2 border-purple-500 hover:bg-purple-50 font-bold rounded-full text-sm ${actionInProgress ? 'opacity-70' : ''}`}
            style={{ height: '40px' }}
          >
            もう一度戦う
          </Button>
          
          <Button
            onClick={handleReturnToStart}
            disabled={actionInProgress}
            className={`w-full py-2 bg-pink-500 text-white hover:bg-pink-600 font-bold rounded-full text-sm ${actionInProgress ? 'opacity-70' : ''}`}
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
