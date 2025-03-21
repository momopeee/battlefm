import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import MobileContainer from '@/components/MobileContainer';
import AudioPlayer from '@/components/AudioPlayer';

const calculateBattleGrade = (totalComments: number, playerHp: number) => {
  if (totalComments >= 25 && playerHp >= 90) return 'SSS';
  if (totalComments >= 20 && playerHp >= 80) return 'SS';
  if (totalComments >= 15 && playerHp >= 70) return 'S';
  return 'A';
};

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
  const [battleGrade, setBattleGrade] = useState('A');
  
  const victoryBgmUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/9982b577-fb1e-4011-9436-3e13286c44f3/%E9%81%94%E6%88%90%EF%BC%81_M299.mp3?table=block&id=1ba25ac2-cb4e-807d-9743-e96dc72d32a7&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742508000000&signature=cMCLQEHa79ZJd8i0yGAsN_dvwXvOXTZ_UDkRRMz_Sxk&downloadName=%E9%81%94%E6%88%90%EF%BC%81_M299.mp3";
  
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
    
    const grade = calculateBattleGrade(totalComments, player.currentHp);
    setBattleGrade(grade);
    
    const currentPath = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const fromDefeat = urlParams.get('from') === 'defeat' || sessionStorage.getItem('fromDefeat') === 'true';
    
    setIsFromDefeat(fromDefeat);
    
    if (fromDefeat) {
      sessionStorage.setItem('fromDefeat', 'true');
      toast.error('ゆうじに敗北しました', {
        description: '次回は頑張りましょう！',
        duration: 3000,
      });
    } else {
      sessionStorage.removeItem('fromDefeat');
      toast.success('ゆうじに勝利しました！', {
        description: 'おめでとうございます！',
        duration: 3000,
      });
    }
  }, [totalComments, player.currentHp, battleTimer, pauseBattleTimer]);

  const handleContinue = () => {
    if (isFromDefeat) {
      handleScreenTransition('endingC');
      navigate('/endingC');
    } else {
      handleScreenTransition('endingA');
      navigate('/endingA');
    }
  };
  
  const handleReturnToStart = () => {
    sessionStorage.removeItem('fromDefeat');
    resetBattleState();
    handleScreenTransition('index');
    navigate('/');
  };
  
  const handleFightAgain = () => {
    sessionStorage.removeItem('fromDefeat');
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
      <AudioPlayer src={victoryBgmUrl} loop={true} autoPlay={true} />
      
      <div 
        className="bg-white text-black flex flex-col items-center justify-between h-full"
        style={{ 
          padding: '20px',
          boxSizing: 'border-box'
        }}
      >
        <div className="w-full flex flex-col items-center justify-start flex-1">
          <div className="flex flex-col items-center justify-center w-[335px] h-[160px]">
            <div className="text-center mb-2">
              <p className="text-sm text-gray-500">バトル評価</p>
            </div>
            <div 
              className="flex items-center justify-center w-40 h-40"
              style={{
                background: 'linear-gradient(145deg, #f0f0f0, #e6e6e6)',
                borderRadius: '50%',
                boxShadow: '10px 10px 20px #d1d1d1, -10px -10px 20px #ffffff'
              }}
            >
              <span 
                className={`text-6xl font-bold ${
                  battleGrade === 'SSS' ? 'text-purple-600' : 
                  battleGrade === 'SS' ? 'text-blue-600' : 
                  battleGrade === 'S' ? 'text-green-600' : 
                  'text-yellow-600'
                }`}
              >
                {battleGrade}
              </span>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h2 className="text-[17px] font-bold mb-4 text-black">ライブが終了しました</h2>
            
            <div className="text-[12px] text-gray-500 mb-2">
              {finalBattleTime}
            </div>
            
            <div className="flex items-center justify-center gap-1 text-[12px] text-gray-500">
              <MessageCircle size={16} strokeWidth={1.5} />
              <span>{totalComments}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
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
          
          <div 
            className="w-[335px] h-[160px] rounded-2xl p-4 mb-6"
            style={{
              background: '#f0f0f0',
              boxShadow: '5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff'
            }}
          >
            <h3 className="text-[14px] font-bold text-center mb-3">バトルデータ</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-[12px]">
                <span className="text-gray-500">残りHP: </span>
                <span className="font-bold text-green-600">{player.currentHp}</span>
              </div>
              <div className="text-[12px]">
                <span className="text-gray-500">コメント数: </span>
                <span className="font-bold text-blue-600">{totalComments}</span>
              </div>
              <div className="text-[12px]">
                <span className="text-gray-500">バトル時間: </span>
                <span className="font-bold">{finalBattleTime}</span>
              </div>
              <div className="text-[12px]">
                <span className="text-gray-500">攻撃回数: </span>
                <span className="font-bold text-red-600">{Math.floor(totalComments * 0.7)}</span>
              </div>
              <div className="text-[12px]">
                <span className="text-gray-500">特殊技: </span>
                <span className="font-bold text-purple-600">{Math.floor(totalComments * 0.2)}</span>
              </div>
              <div className="text-[12px]">
                <span className="text-gray-500">リスナー: </span>
                <span className="font-bold text-orange-600">{Math.floor(totalComments * 0.8)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full flex flex-col items-center space-y-3 pb-4">
          <Button
            onClick={handleContinue}
            className="w-1/3 py-2 bg-white text-pink-500 border-2 border-pink-500 hover:bg-pink-50 font-bold rounded-full text-sm"
            style={{ height: '40px' }}
          >
            次へ進む
          </Button>
          
          <Button
            onClick={handleFightAgain}
            className="w-1/3 py-2 bg-white text-purple-500 border-2 border-purple-500 hover:bg-purple-50 font-bold rounded-full text-sm"
            style={{ height: '40px' }}
          >
            もう一度戦う
          </Button>
          
          <Button
            onClick={handleReturnToStart}
            className="w-1/3 py-2 bg-pink-500 text-white hover:bg-pink-600 font-bold rounded-full text-sm"
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
