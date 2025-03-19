
import React from 'react';

interface HPBarProps {
  currentHP: number;
  maxHP: number;
}

const HPBar: React.FC<HPBarProps> = ({ currentHP, maxHP }) => {
  // Ensure we have valid numbers and calculate percentage
  const safeCurrentHP = typeof currentHP === 'number' ? currentHP : 0;
  const safeMaxHP = typeof maxHP === 'number' ? Math.max(1, maxHP) : 100;
  
  const percentage = Math.max(0, Math.min(100, (safeCurrentHP / safeMaxHP) * 100));
  
  // Enhanced debug log to track HP value rendering
  console.log(`HPBar rendering: currentHP=${safeCurrentHP}, maxHP=${safeMaxHP}, percentage=${percentage}%`);
  
  return (
    <div className="w-full">
      <div className="bg-gray-700 rounded-md overflow-hidden relative h-[20px]">
        <div 
          className="text-white rounded-md h-full"
          style={{ 
            width: `${percentage}%`, 
            backgroundImage: 'linear-gradient(270deg, rgba(255, 124, 200, 1), rgba(201, 100, 250, 1))' 
          }}
        >
        </div>
        <div className="absolute inset-0 flex justify-center items-center">
          <span className="text-white text-sm z-10">残りHP: {safeCurrentHP}</span>
        </div>
      </div>
    </div>
  );
};

export default HPBar;
