
import { useEffect, useState } from 'react';

/**
 * Custom hook to get and update viewport dimensions
 * Particularly useful for iOS Safari where viewport heights can be inconsistent
 */
export function useDimensions() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      // Update dimensions
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
        aspectRatio: window.innerWidth / window.innerHeight,
      });
      
      // Set CSS custom property for viewport height
      // This fixes the iOS Safari issue with vh units
      document.documentElement.style.setProperty(
        '--vh', 
        `${window.innerHeight * 0.01}px`
      );
    };

    // Set initial dimensions
    handleResize();

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      // Small delay to ensure correct values after orientation change
      setTimeout(handleResize, 100);
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return dimensions;
}

export default useDimensions;
