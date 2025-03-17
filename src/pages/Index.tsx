
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-white p-4"
      style={{ width: '1080px', height: '1920px', maxWidth: '100vw', maxHeight: '100vh', margin: '0 auto' }}
    >
      <div className="text-center flex flex-col items-center justify-center gap-10">
        {/* Logo */}
        <img 
          src="/lovable-uploads/4cc74295-9825-4091-9728-1f2dc84f72c1.png" 
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
  );
};

export default Index;
