
import React from 'react';

interface HPBarProps {
  currentHP: number;
  maxHP: number;
}

const HPBar: React.FC<HPBarProps> = ({ currentHP, maxHP }) => {
  const percentage = Math.max(0, Math.min(100, (currentHP / maxHP) * 100));
  
  return (
    <div className="w-full">
      <div className="bg-gray-700 rounded-xl overflow-hidden relative h-[20px]">
        <div 
          className="text-white rounded-xl h-full"
          style={{ 
            width: `${percentage}%`, 
            backgroundImage: 'linear-gradient(270deg, rgba(255, 124, 200, 1), rgba(201, 100, 250, 1))' 
          }}
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
