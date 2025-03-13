
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Volume2, VolumeX } from 'lucide-react';

const EndingCScreen: React.FC = () => {
  const { bgmEnabled, toggleBgm, handleScreenTransition } = useApp();
  const navigate = useNavigate();
  
  const handleReturnToTitle = () => {
    handleScreenTransition('start');
    navigate('/');
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 text-white"
      style={{ 
        background: `url('/lovable-uploads/c1b2b6d0-3acd-4ea0-b336-0631411ff128.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif'
      }}
    >
      <div className="w-full max-w-lg bg-black/50 backdrop-blur-sm rounded-lg p-6 shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-6 text-pink-500">GAME OVER</h1>
        
        <div className="mb-8">
          <div className="bg-white/10 p-4 rounded-md mb-6">
            <p className="text-sm mb-2">エンディングメッセージ</p>
            <p className="text-base leading-relaxed">
              とおるが敗北した、ゆうじは調子にのってしまった。<br/>
              とおるは5億の経験値を得た。<br/>
              とおるは敗北からも学べる男だった。<br/>
              とおるはレベルが7000上がった。<br/>
              だが、ゆうじはどんどん悪い方向に成長した。<br/>
              とおるは危機感を覚えた。<br/>
              あの時俺が本気でぶん殴って目を覚まさせてやればこんなことには・・・<br/>
              とおるは悔やんだ、そしてハイボールを飲んだ。<br/>
              夜空に輝く星の瞬きが、今日だけはいつもよりも多く感じた。
            </p>
          </div>
        </div>
        
        <button
          onClick={handleReturnToTitle}
          className="w-full bg-pink-500 text-white rounded-md px-4 py-3 hover:bg-pink-600 transition-colors font-bold"
        >
          タイトルに戻る
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

export default EndingCScreen;
