
import React, { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// Constants for mobile device dimensions
export const MOBILE_WIDTH = 375;
export const MOBILE_HEIGHT = 812;

interface MobileContainerProps {
  children: ReactNode;
  backgroundClassName?: string;
  backgroundImage?: string;
  backgroundGradient?: string;
}

const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  backgroundClassName,
  backgroundImage,
  backgroundGradient
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

  return (
    <div className={`min-h-screen w-full flex items-center justify-center ${backgroundClassName || 'bg-black'}`}>
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
        className={`relative z-10 overflow-hidden ${isMobile ? 'w-full h-full' : 'mx-auto rounded-2xl shadow-2xl'}`}
        style={{
          width: isMobile ? '100vw' : `${MOBILE_WIDTH}px`,
          maxWidth: isMobile ? '100vw' : `${MOBILE_WIDTH}px`,
          height: isMobile ? '100vh' : `${MOBILE_HEIGHT}px`,
          maxHeight: isMobile ? '100vh' : `${MOBILE_HEIGHT}px`,
          paddingTop: isMobile ? 'env(safe-area-inset-top)' : 0,
          paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : 0,
          paddingLeft: isMobile ? 'env(safe-area-inset-left)' : 0,
          paddingRight: isMobile ? 'env(safe-area-inset-right)' : 0,
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MobileContainer;
