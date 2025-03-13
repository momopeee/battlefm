
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Volume2, VolumeX } from 'lucide-react';

const Victory1Screen: React.FC = () => {
  const { bgmEnabled, toggleBgm, battleTimer, totalComments, handleScreenTransition } = useApp();
  const navigate = useNavigate();
  
  // Determine battle rating based on time and comments
  const determineBattleRating = (): string => {
    const time = battleTimer;
    const comments = totalComments;
    
    if (time < 60 && comments > 15) return 'S';
    if (time < 120 && comments > 10) return 'A';
    if (time < 180 && comments > 5) return 'B';
    if (time < 240) return 'C';
    return 'D';
  };
  
  const handleClose = () => {
    handleScreenTransition('select');
    navigate('/select');
  };
  
  const handleFollowClick = () => {
    window.open('https://stand.fm/channels/5e85f9834afcd35104858d5a', '_blank');
  };
  
  const handleLetterClick = () => {
    window.open('https://stand.fm/channels/5e85f9834afcd35104858d5a', '_blank');
  };
  
  useEffect(() => {
    // Reset game state as needed when entering victory screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 text-white"
      style={{ 
        background: 'linear-gradient(180deg, rgba(212, 50, 144, 1), rgba(119, 3, 175, 1))',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif'
      }}
    >
      <div className="w-full max-w-md bg-black/30 backdrop-blur-sm rounded-lg p-6 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6">ライブ終了！</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">バトル結果</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-3 rounded-md">
              <p className="text-sm">バトル時間</p>
              <p className="text-xl font-bold">{Math.floor(battleTimer / 60)}分{battleTimer % 60}秒</p>
            </div>
            <div className="bg-white/10 p-3 rounded-md">
              <p className="text-sm">コメント数</p>
              <p className="text-xl font-bold">{totalComments}件</p>
            </div>
            <div className="bg-white/10 p-3 rounded-md col-span-2">
              <p className="text-sm">バトル評価</p>
              <p className="text-3xl font-bold text-center">{determineBattleRating()}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 mb-4">
          <button 
            onClick={handleFollowClick}
            className="bg-pink-500 text-white rounded-md px-4 py-3 hover:bg-pink-600 transition-colors font-bold"
          >
            フォローする
          </button>
          <button 
            onClick={handleLetterClick}
            className="bg-blue-500 text-white rounded-md px-4 py-3 hover:bg-blue-600 transition-colors font-bold"
          >
            レターを送る
          </button>
        </div>
        
        <button
          onClick={handleClose}
          className="w-full bg-white text-pink-500 rounded-md px-4 py-3 hover:bg-gray-100 transition-colors font-bold"
        >
          閉じる
        </button>
      </div>
      
      {/* BGM Toggle Button */}
      <button
        onClick={toggleBgm}
        className="fixed top-6 right-6 z-20 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
      >
        {bgmEnabled ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color="white" />}
      </button>
    </div>
  );
};

export default Victory1Screen;
