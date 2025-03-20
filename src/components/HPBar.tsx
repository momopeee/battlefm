
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
  
  // HPの残量に応じて色を変更
  let barColor = '';
  if (percentage > 70) {
    // 70%以上：ピンクのグラデーション（デフォルト）
    barColor = 'linear-gradient(270deg, rgba(255, 124, 200, 1), rgba(201, 100, 250, 1))';
  } else if (percentage > 30) {
    // 30-70%：オレンジのグラデーション
    barColor = 'linear-gradient(270deg, rgba(255, 159, 0, 1), rgba(255, 122, 0, 1))';
  } else {
    // 30%以下：赤のグラデーション
    barColor = 'linear-gradient(270deg, rgba(255, 0, 0, 1), rgba(205, 0, 0, 1))';
  }
  
  return (
    <div className="w-full">
      <div className="bg-gray-700 rounded-md overflow-hidden relative h-[20px]">
        <div 
          className="text-white rounded-md h-full transition-all duration-300 ease-out"
          style={{ 
            width: `${percentage}%`, 
            backgroundImage: barColor
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
