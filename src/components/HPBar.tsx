
import React from 'react';

interface HPBarProps {
  currentHP: number;
  maxHP: number;
}

const HPBar: React.FC<HPBarProps> = ({ currentHP, maxHP }) => {
  const percentage = Math.max(0, Math.min(100, (currentHP / maxHP) * 100));
  
  return (
    <div className="hp-bar w-full">
      <div 
        className="hp-bar-inner" 
        style={{ width: `${percentage}%` }}
      ></div>
      <div className="hp-text">残りHP: {currentHP}</div>
    </div>
  );
};

export default HPBar;
