
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useApp } from '@/context/AppContext';
import { Volume2, VolumeX } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';

const Index = () => {
  const isMobile = useIsMobile();
  const { bgmEnabled, toggleBgm } = useApp();
  
  // BGM URL for Index page
  const indexBgmUrl = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/347fb19e-9f51-4b28-b1a5-038b53491d7e/kyoman.m4a?table=block&id=1ba25ac2-cb4e-80e7-ab17-e55dbcd295e1&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742335200000&signature=vAf3k_SCNNP3GocwUykfjOamF26fv8hNvFPAlBXZKQ8";
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between p-4 relative"
      style={{ 
        width: '100%', 
        maxWidth: '1080px', 
        height: isMobile ? '100vh' : '100vh',
        maxHeight: '100vh', 
        margin: '0 auto',
        backgroundColor: '#0a0a0a'
      }}
    >
      {/* Audio Player for BGM */}
      <AudioPlayer src={indexBgmUrl} loop autoPlay />
      
      {/* BGM Toggle Button */}
      <button
        onClick={toggleBgm}
        className="absolute top-6 right-6 z-30 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
      >
        {bgmEnabled ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color="white" />}
      </button>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center flex flex-col items-center justify-center gap-6 sm:gap-10">
          {/* Updated Logo */}
          <img 
            src="/lovable-uploads/c8b9a8dd-129e-4ba6-ba66-c03a253d63f7.png" 
            alt="battle.fm" 
            className="w-48 sm:w-64 md:w-80 mb-6 sm:mb-10"
          />
          
          <Button 
            asChild
            className="w-48 sm:w-64 text-base sm:text-lg py-4 sm:py-6 bg-pink-500 hover:bg-pink-600 rounded-full font-bold"
          >
            <Link to="/start">スタート</Link>
          </Button>
        </div>
      </div>
      
      {/* Presenter credit with white text */}
      <div className="mt-auto pb-4">
        <a 
          href="https://stand.fm/channels/5e82bebe4afcd351043886fe" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs sm:text-sm text-white hover:text-gray-300"
        >
          presented by 巨万の富男
        </a>
      </div>
    </div>
  );
};

export default Index;
