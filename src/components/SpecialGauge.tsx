
import React from 'react';

interface SpecialGaugeProps {
  currentValue: number;
  maxValue: number;
  label?: string;
}

const SpecialGauge: React.FC<SpecialGaugeProps> = ({ currentValue, maxValue, label }) => {
  const percentage = Math.max(0, Math.min(100, (currentValue / maxValue) * 100));
  const remainingToFull = maxValue - currentValue;
  
  return (
    <div className="w-full">
      <div className="bg-gray-700 rounded-md overflow-hidden relative">
        <div 
          className="bg-sky-500 text-white rounded-md h-full p-2"
          style={{ width: `${percentage}%` }}
        >
        </div>
        <div className="absolute inset-0 flex justify-center items-center">
          <span className="text-white text-sm z-10">
            {label ? label : `発動まで：${remainingToFull}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SpecialGauge;
