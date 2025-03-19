
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import MobileContainer from '@/components/MobileContainer';

// アプリケーションのバージョン
const APP_VERSION = "Ver.3.167.0";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <MobileContainer backgroundClassName="bg-[#0a0a0a]">
      <div className="flex flex-col items-center justify-between h-full px-4 py-8">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center flex flex-col items-center justify-center gap-6 sm:gap-10">
            {/* Logo */}
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
        
        {/* Version info in footer */}
        <div className="mt-auto pb-4">
          <span className="text-[11px] text-gray-500">{APP_VERSION}</span>
        </div>
      </div>
    </MobileContainer>
  );
};

export default Index;
