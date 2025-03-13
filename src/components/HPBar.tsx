
import React from 'react';

interface HPBarProps {
  currentHP: number;
  maxHP: number;
}

const HPBar: React.FC<HPBarProps> = ({ currentHP, maxHP }) => {
  const percentage = Math.max(0, Math.min(100, (currentHP / maxHP) * 100));
  
  return (
    <div className="w-full">
      <div className="bg-gray-700 rounded-md overflow-hidden">
        <div 
          className="bg-battle-pink text-white rounded-md p-2 flex justify-center"
          style={{ width: `${percentage}%` }}
        >
          <span className="text-white text-sm z-10">残りHP: {currentHP}</span>
        </div>
      </div>
    </div>
  );
};

export default HPBar;
