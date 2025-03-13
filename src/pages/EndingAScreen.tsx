
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Volume2, VolumeX } from 'lucide-react';

const EndingAScreen: React.FC = () => {
  const { bgmEnabled, toggleBgm, battleTimer, totalComments, handleScreenTransition } = useApp();
  const navigate = useNavigate();
  
  const handleReturnToTitle = () => {
    handleScreenTransition('start');
    navigate('/');
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 text-white"
      style={{ 
        background: `url('/lovable-uploads/a7ed22c9-2f94-4f5f-b517-35105068b4ba.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif'
      }}
    >
      <div className="w-full max-w-lg bg-black/50 backdrop-blur-sm rounded-lg p-6 shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-4 text-pink-500">GAME CLEAR</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">バトル結果</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 p-3 rounded-md">
              <p className="text-sm">バトル時間</p>
              <p className="text-xl font-bold">{Math.floor(battleTimer / 60)}分{battleTimer % 60}秒</p>
            </div>
            <div className="bg-white/10 p-3 rounded-md">
              <p className="text-sm">コメント数</p>
              <p className="text-xl font-bold">{totalComments}件</p>
            </div>
          </div>
          
          <div className="bg-white/10 p-4 rounded-md mb-6">
            <p className="text-sm mb-2">エンディングメッセージ</p>
            <p className="text-base leading-relaxed">
              とおるが勝利した、ゆうじは拗ねてタムタムにLINEをした。<br/>
              タムタムからの返事がない、ゆうじはリコさんにLINEをした。<br/>
              リコさんからの返事がない。<br/>
              ゆうじは殻に閉じこもってしまった。<br/>
              その後、風のうわさでゆうじが米国大統領に当選したと聞いた。<br/>
              とおるはゆうじを倒した。<br/>
              でも本当は、ゆうじを倒したくなかった。<br/>
              永遠にゆうじとの戯れをつづけたかった。<br/>
              だが、とおるはゆうじを倒してしまった。<br/>
              この戦いに勝利者はいない。<br/>
              とおるは一人涙して、今日もハイボールを飲む、とおるの心に7兆のダメージ。
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

export default EndingAScreen;
