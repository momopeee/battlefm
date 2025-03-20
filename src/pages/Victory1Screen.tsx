import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '@/components/MobileContainer';
import AudioPlayer from '@/components/AudioPlayer';
import AudioTester from '@/components/AudioTester';

const Victory1Screen: React.FC = () => {
  const { 
    player,
    battleTimer,
    comments,
    handleScreenTransition,
    resetBattleState
  } = useApp();
  
  const navigate = useNavigate();
  const [isFollowed, setIsFollowed] = useState(false);
  
  const victoryBgmUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/9982b577-fb1e-4011-9436-3e13286c44f3/%E9%81%94%E6%88%90%EF%BC%81_M299.mp3?table=block&id=1ba25ac2-cb4e-807d-9743-e96dc72d32a7&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742508000000&signature=cMCLQEHa79ZJd8i0yGAsN_dvwXvOXTZ_UDkRRMz_Sxk&downloadName=%E9%81%94%E6%88%90%EF%BC%81_M299.mp3";
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    toast.success('そーそーに勝利しました！', {
      description: 'おめでとうございます！',
      duration: 3000,
    });
    
    console.log('Rendered Victory1Screen');
    console.log('Attempting to play victory BGM:', victoryBgmUrl);
  }, []);

  const handleContinue = () => {
    console.log('Navigating to select screen from Victory1Screen');
    handleScreenTransition('select');
    navigate('/select');
  };
  
  const handleReturnToStart = () => {
    console.log('Returning to start from Victory1Screen');
    resetBattleState();
    handleScreenTransition('index');
    navigate('/');
  };
  
  const handleFightAgain = () => {
    console.log('Fighting again from Victory1Screen');
    resetBattleState();
    handleScreenTransition('battle1');
    navigate('/battle1');
  };
  
  const handleFollow = () => {
    setIsFollowed(!isFollowed);
    
    if (!isFollowed) {
      window.open('https://stand.fm/channels/5e85f9834afcd35104858d5a', '_blank');
    }
  };

  return (
    <MobileContainer backgroundClassName="bg-white">
      <AudioPlayer 
        src="https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/9982b577-fb1e-4011-9436-3e13286c44f3/%E9%81%94%E6%88%90%EF%BC%81_M299.mp3?table=block&id=1ba25ac2-cb4e-807d-9743-e96dc72d32a7&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742508000000&signature=cMCLQEHa79ZJd8i0yGAsN_dvwXvOXTZ_UDkRRMz_Sxk&downloadName=%E9%81%94%E6%88%90%EF%BC%81_M299.mp3" 
        loop={true} 
        autoPlay={true} 
        volume={0.7}
        key="victory-bgm" 
      />
      
      <AudioTester />
      
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
              {formatTime(battleTimer)}
            </div>
            
            <div className="flex items-center justify-center gap-1 text-[12px] text-gray-500">
              <MessageCircle size={16} strokeWidth={1.5} />
              <span>{comments.length}</span>
            </div>
          </div>
          
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

export default Victory1Screen;
