
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
      <div className="bg-gray-700 rounded-xl overflow-hidden relative h-[20px]">
        <div 
          className="text-white rounded-xl h-full"
          style={{ 
            width: `${percentage}%`, 
            backgroundImage: 'linear-gradient(270deg, rgba(124, 238, 255, 1), rgba(201, 100, 250, 1))' 
          }}
        >
        </div>
        <div className="absolute inset-0 flex justify-center items-center">
          <span className="text-white text-sm z-10">
            {label ? label : `とくぎはつどう：${remainingToFull}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SpecialGauge;
