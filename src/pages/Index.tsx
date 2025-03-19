
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const MOBILE_WIDTH = 375;
const MOBILE_HEIGHT = 812;
const ASPECT_RATIO = MOBILE_WIDTH / MOBILE_HEIGHT;
// アプリケーションのバージョン
const APP_VERSION = "Ver.3.167.0";

const Index = () => {
  const isMobile = useIsMobile();
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Update container dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    
    // Initial update
    updateDimensions();
    
    // Add event listener for window resize
    window.addEventListener('resize', updateDimensions);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden pc-fixed-container"
    >
      {/* Blurred background for desktop only */}
      {!isMobile && (
        <div 
          className="absolute inset-0 w-full h-full z-0"
          style={{
            backgroundImage: 'url(/lovable-uploads/c8b9a8dd-129e-4ba6-ba66-c03a253d63f7.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(30px)',
            opacity: 0.4,
            transform: 'scale(1.1)'
          }}
        />
      )}
      
      {/* Main content container with mobile aspect ratio */}
      <div 
        className={`relative z-10 overflow-hidden ${isMobile ? 'w-full h-full' : 'mx-auto rounded-2xl shadow-2xl'}`}
        style={{
          width: isMobile ? '100%' : `${MOBILE_WIDTH}px`,
          maxWidth: isMobile ? '100%' : `${MOBILE_WIDTH}px`,
          height: isMobile ? '100vh' : `${MOBILE_HEIGHT}px`,
          maxHeight: isMobile ? '100vh' : `${MOBILE_HEIGHT}px`,
          backgroundColor: '#0a0a0a'
        }}
      >
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
              
              {/* Presenter credit moved above footer - now with smaller font and gray color matching version info */}
              <div className="mt-4">
                <a 
                  href="https://stand.fm/channels/5e82bebe4afcd351043886fe" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[8px] sm:text-[11px] text-gray-500 hover:text-gray-300"
                >
                  presented by 巨万の富男
                </a>
              </div>
            </div>
          </div>
          
          {/* Version info in footer with grey text */}
          <div className="mt-auto pb-4">
            <span className="text-[11px] text-gray-500">{APP_VERSION}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
