
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
  
  // バーの色を決定 - HP残量に基づいて色を変化させる
  const getBarColor = () => {
    if (percentage <= 25) {
      // 25%以下は赤色
      return 'linear-gradient(270deg, rgba(239, 68, 68, 1), rgba(220, 38, 38, 1))';
    } else if (percentage <= 50) {
      // 50%以下はオレンジ色
      return 'linear-gradient(270deg, rgba(249, 115, 22, 1), rgba(234, 88, 12, 1))';
    } else {
      // 50%以上はデフォルトのピンク/紫のグラデーション
      return 'linear-gradient(270deg, rgba(255, 124, 200, 1), rgba(201, 100, 250, 1))';
    }
  };
  
  return (
    <div className="w-full">
      <div className="bg-gray-700 rounded-md overflow-hidden relative h-[20px]">
        <div 
          className="text-white rounded-md h-full"
          style={{ 
            width: `${percentage}%`, 
            backgroundImage: getBarColor(),
            transition: 'width 0.3s ease-out, background-image 0.3s ease-out'
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
