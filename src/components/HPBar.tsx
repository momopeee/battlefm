
import React from 'react';

interface HPBarProps {
  currentHP: number;
  maxHP: number;
}

const HPBar: React.FC<HPBarProps> = ({ currentHP, maxHP }) => {
  const percentage = Math.max(0, Math.min(100, (currentHP / maxHP) * 100));
  
  return (
    <div className="w-full">
      <div className="bg-gray-700 rounded-md overflow-hidden relative">
        <div 
          className="bg-battle-pink text-white rounded-md h-full p-2"
          style={{ width: `${percentage}%` }}
        >
        </div>
        <div className="absolute inset-0 flex justify-center items-center">
          <span className="text-white text-sm z-10">残りHP: {currentHP}</span>
        </div>
      </div>
    </div>
  );
};

export default HPBar;
