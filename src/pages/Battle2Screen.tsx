
import React, { useState, useEffect } from 'react';
import MobileContainer from '@/components/MobileContainer';
import AudioPlayer from '@/components/AudioPlayer';
import { useApp } from '@/context/AppContext';
import { BATTLE_BGM } from '@/constants/audioUrls';

const Battle2Screen = () => {
  const [battleState, setBattleState] = useState({
    isLoading: true,
    roundCount: 0
  });
  const { bgmEnabled } = useApp();

  useEffect(() => {
    // Initialize battle
    setTimeout(() => {
      setBattleState(prev => ({
        ...prev,
        isLoading: false
      }));
    }, 1000);
  }, []);

  return (
    <MobileContainer backgroundClassName="bg-gray-900">
      <AudioPlayer
        src={BATTLE_BGM}
        loop={true}
        autoPlay={bgmEnabled}
        volume={0.7}
        id="battle2-bgm"
      />
      
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold text-white mb-4">Battle 2</h1>
        {battleState.isLoading ? (
          <p className="text-white">Loading battle...</p>
        ) : (
          <div className="text-white">
            <p>Battle content would go here</p>
            <button 
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setBattleState(prev => ({
                ...prev,
                roundCount: prev.roundCount + 1
              }))}
            >
              Advance Battle (Round: {battleState.roundCount})
            </button>
          </div>
        )}
      </div>
    </MobileContainer>
  );
};

export default Battle2Screen;
