
import React from 'react';

interface PlayerInfoProps {
  name: string;
  icon: string;
  battleTimer: number;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ name, icon, battleTimer }) => {
  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <img 
          src={icon} 
          alt={name} 
          className="w-12 h-12 rounded-full mr-2 border-2 border-white"
        />
        <div>
          <h1 className="text-[14px] font-bold">さよなら陽気なおじさん！</h1>
          <p className="text-sm opacity-80">{name}</p>
        </div>
      </div>
      <div className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
        {formatTime(battleTimer)}
      </div>
    </div>
  );
};

export default PlayerInfo;
