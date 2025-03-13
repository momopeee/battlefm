
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Volume2, VolumeX } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';

const SelectScreen: React.FC = () => {
  const { bgmEnabled, toggleBgm, handleScreenTransition } = useApp();
  const navigate = useNavigate();
  const [assaultMode, setAssaultMode] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [soundEffect, setSoundEffect] = useState<string | null>(null);
  
  // Handle screen click to start assault mode
  const handleScreenClick = () => {
    if (!assaultMode) {
      setAssaultMode(true);
      setSoundEffect("/audios/keihou.mp3");
      
      // Start text scroll after 3 seconds of flashing
      setTimeout(() => {
        setTextVisible(true);
      }, 3000);
      
      // Navigate to battle2 after 15 seconds
      setTimeout(() => {
        handleScreenTransition('battle2');
        navigate('/battle2');
      }, 15000);
    }
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 text-white cursor-pointer"
      onClick={handleScreenClick}
      style={{ 
        background: `url('/lovable-uploads/58d2783f-c865-4cbb-8f86-4528a9159ff0.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif'
      }}
    >
      {!assaultMode && (
        <div className="w-full max-w-md bg-black/50 backdrop-blur-sm rounded-lg p-6 shadow-xl">
          <h1 className="text-3xl font-bold text-center mb-6">いずれかをタップしてください</h1>
        </div>
      )}
      
      {/* Assault mode overlay */}
      {assaultMode && (
        <div 
          className={`fixed inset-0 z-30 flex items-center justify-center overflow-hidden ${!textVisible ? 'animate-pulse' : ''}`}
          style={{
            backgroundImage: "url('/lovable-uploads/87eeca18-7288-449e-b4dc-8a6b2d6ad9a9.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {textVisible && (
            <div className="absolute w-full max-w-3xl text-center perspective">
              <div className="star-wars-text-content text-red-500 font-bold text-lg md:text-xl leading-relaxed animate-text-scroll">
                <p>
                  うぇーい！ゆうじの陽気なおじさんです！！<br />
                  <br />
                  って、それはただの俺のおじさんやないかい！！<br />
                  <br />
                  陽気なおじさん＠ゆうじです！<br />
                  <br />
                  今日はやまにいに、経営について指南してやりますから、<br />
                  <br />
                  皆さん、どうぞよろしくウェイで～す！！<br />
                  <br />
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* BGM Toggle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleBgm();
        }}
        className="fixed top-6 right-6 z-40 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
      >
        {bgmEnabled ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color="white" />}
      </button>
      
      {/* Sound effect during assault mode */}
      {soundEffect && <AudioPlayer src={soundEffect} />}
    </div>
  );
};

export default SelectScreen;
