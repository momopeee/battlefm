
import React, { useEffect, useState } from 'react';

interface PlayerInfoProps {
  name: string;
  icon: string;
  battleTimer: number;
  title?: string;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ name, icon, battleTimer, title = "さよならクソリプそーそー！" }) => {
  const [displayTime, setDisplayTime] = useState(battleTimer);
  const [localTimer, setLocalTimer] = useState(battleTimer);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // タイマーのカウントアップロジック
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    // タイマーがアクティブな場合、1秒ごとにカウントアップ
    if (isTimerActive) {
      interval = setInterval(() => {
        setLocalTimer(prevTime => prevTime + 1);
      }, 1000);
    }
    
    // クリーンアップ関数
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive]);

  // 初期値変更時に同期
  useEffect(() => {
    if (battleTimer > 0) {
      setLocalTimer(battleTimer);
    }
  }, [battleTimer]);

  // 表示する時間を更新
  useEffect(() => {
    setDisplayTime(localTimer);
  }, [localTimer]);

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center mb-2">
      <h1 className="text-[13px] font-bold mb-2">{title}</h1>
      <div className="flex items-start justify-start gap-4">
        <img 
          src={icon} 
          alt={name} 
          className="w-8 h-8 rounded-full"
        />
        <div className="flex flex-col items-start">
          <span className="text-[11px]">{name}</span>
          <span className="text-[10px]">{formatTime(displayTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
