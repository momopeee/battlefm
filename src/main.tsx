
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Function to handle viewport sizing for iOS devices
const handleResize = () => {
  // Set the viewport height for mobile browsers (fixes iOS Safari issues)
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  
  // Check if we need to adjust for iPhone notch/home indicator
  const safeAreaTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0');
  const safeAreaBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab') || '0');
  
  if (safeAreaTop > 0 || safeAreaBottom > 0) {
    document.documentElement.style.setProperty('--safe-area-top', `${safeAreaTop}px`);
    document.documentElement.style.setProperty('--safe-area-bottom', `${safeAreaBottom}px`);
  }
};

// Initial call
handleResize();

// Listen for resize and orientation change events
window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', () => {
  // Small delay to ensure correct dimensions after orientation change
  setTimeout(handleResize, 100);
});

createRoot(document.getElementById("root")!).render(<App />);
