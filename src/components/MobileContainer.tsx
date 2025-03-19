
import React, { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// Constants for mobile device dimensions (updated to match 9:16 aspect ratio)
export const MOBILE_WIDTH = 375;
export const MOBILE_HEIGHT = 667; // Changed from 812 to 667 to match 9:16 ratio (375 * 16/9 ≈ 667)

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
      
      {/* Main content container with 9:16 aspect ratio for mobile, full height for desktop */}
      <div 
        className={`relative z-10 overflow-hidden ${isMobile ? 'w-full h-full safe-area-vertical' : 'mx-auto rounded-2xl shadow-2xl pc-container'}`}
        style={{
          width: isMobile ? '100vw' : `${MOBILE_WIDTH}px`,
          maxWidth: isMobile ? '100vw' : `${MOBILE_WIDTH}px`,
          height: isMobile ? '100vh' : 'auto',
          minHeight: isMobile ? '100vh' : 'auto',
          maxHeight: isMobile ? '100vh' : 'none',
          paddingTop: isMobile ? 'calc(env(safe-area-inset-top) + 7px)' : 0,
          paddingBottom: isMobile ? 'calc(env(safe-area-inset-bottom) + 7px)' : 0,
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
