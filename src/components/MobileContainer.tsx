
import React, { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Footer from './Footer';

// Constants for mobile device dimensions
export const MOBILE_WIDTH = 375;
export const MOBILE_HEIGHT = 812;

interface MobileContainerProps {
  children: ReactNode;
  backgroundClassName?: string;
  backgroundImage?: string;
  backgroundGradient?: string;
  pcBackgroundColor?: string;
}

const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  backgroundClassName,
  backgroundImage,
  backgroundGradient,
  pcBackgroundColor
}) => {
  const isMobile = useIsMobile();

  // Determine background style based on props
  let backgroundStyle: React.CSSProperties = {};
  
  if (backgroundImage) {
    backgroundStyle = {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  } else if (backgroundGradient) {
    backgroundStyle = {
      background: backgroundGradient,
      backgroundSize: 'cover',
    };
  }

  // Determine the container background style
  const containerStyle: React.CSSProperties = pcBackgroundColor && !isMobile 
    ? { backgroundColor: pcBackgroundColor }
    : {};

  return (
    <div 
      className={`min-h-screen w-full flex items-center justify-center ${backgroundClassName || 'bg-black'} pc-fixed-container`}
      style={containerStyle}
    >
      {/* Blurred background for desktop only */}
      {!isMobile && (
        <div 
          className="absolute inset-0 w-full h-full z-0"
          style={{
            ...backgroundStyle,
            filter: 'blur(30px)',
            opacity: 0.7,
            transform: 'scale(1.1)'
          }}
        />
      )}
      
      {/* Main content container with mobile aspect ratio */}
      <div 
        className={`relative z-10 overflow-hidden flex flex-col ${isMobile ? 'w-full h-full safe-area-vertical' : 'mx-auto rounded-2xl shadow-2xl'}`}
        style={{
          width: isMobile ? '100vw' : `${MOBILE_WIDTH}px`,
          maxWidth: isMobile ? '100vw' : `${MOBILE_WIDTH}px`,
          height: isMobile ? '100vh' : `${MOBILE_HEIGHT}px`,
          maxHeight: isMobile ? '100vh' : `${MOBILE_HEIGHT}px`,
          paddingTop: isMobile ? 'calc(env(safe-area-inset-top) + 7px)' : 0,
          paddingBottom: isMobile ? 'calc(env(safe-area-inset-bottom) + 7px)' : 0,
          paddingLeft: isMobile ? 'env(safe-area-inset-left)' : 0,
          paddingRight: isMobile ? 'env(safe-area-inset-right)' : 0,
          boxSizing: 'border-box',
        }}
      >
        <div className="flex-1 overflow-auto">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MobileContainer;
