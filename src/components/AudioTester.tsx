
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

const AudioTester = () => {
  const { bgmEnabled, toggleBgm } = useApp();
  const [testResult, setTestResult] = useState<string | null>(null);
  
  const testAudio = () => {
    setTestResult("Testing audio...");
    
    try {
      // Create a temporary audio element
      const audio = new Audio();
      
      // Set up event listeners
      audio.addEventListener('canplaythrough', () => {
        setTestResult("✅ Audio loaded successfully");
        
        // Try to play
        const playPromise = audio.play();
        if (playPromise) {
          playPromise
            .then(() => {
              setTestResult("✅ Audio playing successfully");
              
              // Stop after a second
              setTimeout(() => {
                audio.pause();
                setTestResult("✅ Audio test completed successfully");
              }, 1000);
            })
            .catch(error => {
              setTestResult(`❌ Audio play failed: ${error.message}`);
            });
        }
      });
      
      audio.addEventListener('error', (e) => {
        const errorEvent = e as ErrorEvent;
        setTestResult(`❌ Audio load failed: ${errorEvent.message || 'Unknown error'}`);
      });
      
      // Use a very small sound file for testing
      audio.src = "https://file.notion.so/f/f/e08947dd-7133-4df9-a5bf-81ce352dd896/270027e7-c38f-4c1e-a4c8-63627ad75857/keihou.mp3?table=block&id=1ba25ac2-cb4e-8097-bf5b-fbd90ec67685&spaceId=e08947dd-7133-4df9-a5bf-81ce352dd896&expirationTimestamp=1742508000000&signature=s2l5GBC1fJ9-IgN891PveaTllhFB1p5fA0ekrqpT-48&downloadName=keihou.mp3";
      audio.volume = 0.3;
      
      // Load the audio
      audio.load();
    } catch (error) {
      setTestResult(`❌ Audio creation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 z-50 bg-white/80 backdrop-blur-sm p-3 rounded-tr-lg shadow-lg text-xs">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span>BGM: {bgmEnabled ? 'ON' : 'OFF'}</span>
          <Button
            size="sm"
            variant="outline"
            className="h-6 px-2 text-[10px]"
            onClick={toggleBgm}
          >
            {bgmEnabled ? 'Mute' : 'Unmute'}
          </Button>
        </div>
        
        <Button 
          size="sm" 
          variant="secondary" 
          className="h-6 text-[10px]" 
          onClick={testAudio}
        >
          Test Audio
        </Button>
        
        {testResult && (
          <div className="mt-1 text-[10px]">
            {testResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioTester;
