
import React from 'react';

interface HPBarProps {
  currentHP: number;
  maxHP: number;
}

const HPBar: React.FC<HPBarProps> = ({ currentHP, maxHP }) => {
  const percentage = Math.max(0, Math.min(100, (currentHP / maxHP) * 100));
  
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-white text-sm">{currentHP > 0 ? `残りHP: ${currentHP}` : '瀕死'}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-4">
        <div 
          className="bg-battle-pink h-4 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default HPBar;
