
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import AudioPlayer from '@/components/AudioPlayer';
import { Volume2, VolumeX } from 'lucide-react';

const SelectScreen: React.FC = () => {
  const { bgmEnabled, toggleBgm, handleScreenTransition } = useApp();
  const [showAssault, setShowAssault] = useState(false);
  const [assaultText, setAssaultText] = useState(false);
  const [assaultAlarm, setAssaultAlarm] = useState(false);
  
  useEffect(() => {
    // Reset any game state for the next battle
  }, []);
  
  const handleSelectClick = () => {
    // Start assault mode sequence
    setShowAssault(true);
    setAssaultAlarm(true);
    
    // Play alarm for 3 seconds, then show scrolling text
    setTimeout(() => {
      setAssaultAlarm(false);
      setAssaultText(true);
    }, 3000);
    
    // Move to battle2 after 15 seconds total
    setTimeout(() => {
      handleScreenTransition('battle2');
    }, 15000);
  };
  
  return (
    <div className="relative min-h-screen">
      {!showAssault && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center cursor-pointer"
            style={{ backgroundImage: 'url(/lovable-uploads/d1281e41-ad0d-4d0b-af92-6493538673a9.png)' }}
            onClick={handleSelectClick}
          ></div>
          
          {/* BGM Toggle Button */}
          <button
            onClick={toggleBgm}
            className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
          >
            {bgmEnabled ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color="white" />}
          </button>
        </>
      )}
      
      {/* Assault Mode */}
      {showAssault && (
        <div className="min-h-screen bg-black relative overflow-hidden">
          {/* Audio */}
          {assaultAlarm && <AudioPlayer src="/audios/keihou.mp3" loop={false} autoPlay />}
          
          {/* Flashing image during alarm */}
          {assaultAlarm && (
            <div className="absolute inset-0 z-10 animate-blink">
              <img 
                src="/lovable-uploads/656bd67f-53fe-4f15-86f3-0db149cc7285.png"
                alt="ゆうじ"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Static image and scrolling text after alarm */}
          {assaultText && (
            <>
              <img 
                src="/lovable-uploads/656bd67f-53fe-4f15-86f3-0db149cc7285.png"
                alt="ゆうじ"
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
              
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="w-full max-w-lg px-4">
                  <div className="star-wars-text">
                    <div className="star-wars-text-inner text-red-500 font-bold">
                      <p>
                        うぇーい！ゆうじの陽気なおじさんです！！
                        <br /><br />
                        って、それはただの俺のおじさんやないかい！！
                        <br /><br />
                        陽気なおじさん＠ゆうじです！
                        <br /><br />
                        今日はやまにいに、経営について指南してやりますから、
                        <br /><br />
                        皆さん、どうぞよろしくウェイで～す！！
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectScreen;
