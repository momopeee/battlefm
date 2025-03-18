
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between bg-black p-4"
      style={{ width: '1080px', height: '1920px', maxWidth: '100vw', maxHeight: '100vh', margin: '0 auto' }}
    >
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center flex flex-col items-center justify-center gap-10">
          {/* Updated Logo */}
          <img 
            src="/lovable-uploads/c8b9a8dd-129e-4ba6-ba66-c03a253d63f7.png" 
            alt="battle.fm" 
            className="w-64 md:w-80 mb-10"
          />
          
          <Button 
            asChild
            className="w-64 text-lg py-6 bg-pink-500 hover:bg-pink-600 rounded-full font-bold text-xl"
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
          className="text-sm text-white hover:text-gray-300"
        >
          presented by 巨万の富男
        </a>
      </div>
    </div>
  );
};

export default Index;
