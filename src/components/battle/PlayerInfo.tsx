
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
    <div className="text-center mb-2">
      <h1 className="text-[13px] font-bold mb-2">さよならクソリプそーそー！</h1>
      <div className="flex items-start justify-start gap-4">
        <img 
          src={icon} 
          alt={name} 
          className="w-11 h-11 rounded-full"
        />
        <div className="flex flex-col items-start">
          <span className="text-[11px]">{name}</span>
          <p className="text-[11px]">{formatTime(battleTimer)}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
