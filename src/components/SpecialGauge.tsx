
import React from 'react';

interface SpecialGaugeProps {
  currentValue: number;
  maxValue: number;
}

const SpecialGauge: React.FC<SpecialGaugeProps> = ({ currentValue, maxValue }) => {
  const percentage = Math.max(0, Math.min(100, (currentValue / maxValue) * 100));
  const remainingToFull = maxValue - currentValue;
  
  return (
    <div className="w-full">
      <div className="bg-gray-700 rounded-md overflow-hidden">
        <div 
          className="bg-sky-500 text-white rounded-md p-2 flex justify-center"
          style={{ width: `${percentage}%` }}
        >
          <span className="text-white text-sm z-10">とくぎ発動まで：{remainingToFull}</span>
        </div>
      </div>
    </div>
  );
};

export default SpecialGauge;
