
import React from 'react';
import { formatTime } from '@/lib/utils';

interface PlayerInfoProps {
  name: string;
  icon: string;
  battleTimer: number;
  battleTitle?: string;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ 
  name, 
  icon, 
  battleTimer,
  battleTitle = "さよならクソリプそーそー！"
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-lg font-bold">{battleTitle}</h1>
      <div className="flex items-center space-x-2">
        <span className="text-sm">{formatTime(battleTimer)}</span>
      </div>
    </div>
  );
};

export default PlayerInfo;
