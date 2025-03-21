
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { Play, PauseCircle, Headphones, Volume2, VolumeX } from 'lucide-react';

const AudioTester = () => {
  const { bgmEnabled, toggleBgm } = useApp();
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testAudio, setTestAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioState, setAudioState] = useState<string>("idle");
  
  const runAudioTest = () => {
    setTestResult("Testing audio...");
    setAudioState("loading");
    
    try {
      // Create a temporary audio element
      const audio = new Audio();
      setTestAudio(audio);
      
      // Set up event listeners
      audio.addEventListener('canplaythrough', () => {
        setTestResult("✅ Audio loaded successfully");
        setAudioState("loaded");
        
        // Try to play
        const playPromise = audio.play();
        if (playPromise) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setAudioState("playing");
              setTestResult("✅ Audio playing successfully");
            })
            .catch(error => {
              setAudioState("error");
              setTestResult(`❌ Audio play failed: ${error.message}`);
            });
        }
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setAudioState("ended");
        setTestResult("✅ Audio playback completed");
      });
      
      audio.addEventListener('error', (e) => {
        const errorEvent = e as ErrorEvent;
        setAudioState("error");
        setTestResult(`❌ Audio load failed: ${errorEvent.message || 'Unknown error'} (${audio.error?.code || 'No code'})`);
      });
      
      // Use a short test sound
      audio.src = "https://tangerine-valkyrie-189847.netlify.app/3-c-nigeru.mp3";
      audio.volume = 0.5;
      
      // Load the audio
      audio.load();
    } catch (error) {
      setAudioState("error");
      setTestResult(`❌ Audio creation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  const togglePlayPause = () => {
    if (!testAudio) return;
    
    if (isPlaying) {
      testAudio.pause();
      setIsPlaying(false);
      setAudioState("paused");
      setTestResult("Audio paused");
    } else {
      testAudio.play()
        .then(() => {
          setIsPlaying(true);
          setAudioState("playing");
          setTestResult("Audio resumed");
        })
        .catch(error => {
          setAudioState("error");
          setTestResult(`❌ Play failed: ${error.message}`);
        });
    }
  };
  
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg text-xs">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="font-bold">Audio Debug</span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-6 px-2 text-[10px]"
              onClick={toggleBgm}
            >
              {bgmEnabled ? 
                <Volume2 size={12} className="mr-1" /> : 
                <VolumeX size={12} className="mr-1" />
              }
              {bgmEnabled ? 'Mute' : 'Unmute'}
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-6 text-[10px] flex-1" 
            onClick={runAudioTest}
            disabled={audioState === "loading"}
          >
            <Headphones size={12} className="mr-1" />
            Test Audio
          </Button>
          
          {testAudio && (
            <Button 
              size="sm" 
              variant={isPlaying ? "destructive" : "default"}
              className="h-6 w-6 p-0" 
              onClick={togglePlayPause}
              disabled={audioState === "loading" || audioState === "error"}
            >
              {isPlaying ? <PauseCircle size={12} /> : <Play size={12} />}
            </Button>
          )}
        </div>
        
        {testResult && (
          <div className="mt-1 text-[10px] p-1 bg-gray-100 rounded max-w-[200px] break-words">
            {testResult}
          </div>
        )}
        
        <div className="mt-1 text-[10px]">
          <span className="font-bold">Status:</span> {audioState}
        </div>
        
        <div className="text-[8px] text-gray-500 mt-1">
          BGM: {bgmEnabled ? 'Enabled' : 'Disabled'}
        </div>
      </div>
    </div>
  );
};

export default AudioTester;
