
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { Volume2, VolumeX } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';

const EndingCScreen = () => {
  const { bgmEnabled, toggleBgm, handleScreenTransition, resetBattleState } = useApp();
  const navigate = useNavigate();
  
  // BGM URL
  const endingBgmUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/df4d3cfd-d360-49ea-90b4-2446850bab38/kyoman.mp3?table=block&id=1ba25ac2-cb4e-800d-8735-d8d4f50eada9&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742335200000&signature=z4t7Uq9Gm_hiNsxycw86WXXMO9lt1btrtIm0Df-6u5E";
  
  useEffect(() => {
    // Reset game state or perform any cleanup needed
    window.scrollTo(0, 0);
  }, []);
  
  const handleReturnToStart = () => {
    // Reset battle state and redirect to index page
    resetBattleState();
    handleScreenTransition('index');
    navigate('/');
  };
  
  return (
    <div className="relative min-h-screen bg-black text-white p-4 flex flex-col items-center justify-between">
      {/* BGM Player */}
      <AudioPlayer src={endingBgmUrl} loop autoPlay />
      
      {/* BGM Toggle Button */}
      <button
        onClick={toggleBgm}
        className="absolute top-4 right-4 z-30 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
      >
        {bgmEnabled ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color="white" />}
      </button>
      
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-green-500">エンディングC: 社会貢献と自己成長</h1>
        
        <div className="mb-8 text-center">
          <p className="text-xl mb-4">おめでとうございます！</p>
          <p className="mb-6">あなたは自分の価値観に基づいて、社会に貢献しながら自己成長を遂げる道を選びました。</p>
          <p className="mb-6">お金や地位よりも、意義のある仕事と継続的な学びを大切にすることで、充実した人生を歩んでいます。</p>
        </div>
        
        <div className="mt-8">
          <Button variant="outline" className="mr-4" onClick={handleReturnToStart}>
            トップに戻る
          </Button>
        </div>
      </div>
      
      <footer className="mt-auto py-4 text-xs text-center text-gray-400 w-full">
        <p>© 2023 battle.fm All Rights Reserved.</p>
        <a 
          href="https://stand.fm/channels/5e82bebe4afcd351043886fe" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-green-400 hover:text-green-300 mt-2 inline-block"
        >
          presented by 巨万の富男
        </a>
      </footer>
    </div>
  );
};

export default EndingCScreen;
