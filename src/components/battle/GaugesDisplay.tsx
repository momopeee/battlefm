
import React from 'react';
import HPBar from '@/components/HPBar';
import SpecialGauge from '@/components/SpecialGauge';
import { Character } from '@/context/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface GaugesDisplayProps {
  player: Character;
  opponent: Character;
  attackCount: number;
  sosoHealMode: boolean;
}

const GaugesDisplay: React.FC<GaugesDisplayProps> = ({
  player,
  opponent,
  attackCount,
  sosoHealMode
}) => {
  const isMobile = useIsMobile();
  
  return (
    <>
      {/* Health bars */}
      <div className={`flex gap-2 sm:gap-4 mb-1 sm:mb-2 w-full ${isMobile ? 'px-1' : ''}`}>
        <div className="flex-1">
          <HPBar currentHP={player.currentHp} maxHP={player.maxHp} />
        </div>
        <div className="flex-1">
          <HPBar currentHP={opponent.currentHp} maxHP={opponent.maxHp} />
        </div>
      </div>
      
      {/* Special attack gauges */}
      <div className={`flex gap-2 sm:gap-4 mb-1 sm:mb-2 w-full ${isMobile ? 'px-1' : ''}`}>
        <div className="flex-1">
          <SpecialGauge currentValue={attackCount} maxValue={3} />
        </div>
        <div className="flex-1">
          {/* Opponent's special gauge (heal mode gauge) - Updated condition to HP <= 30 */}
          <SpecialGauge 
            currentValue={sosoHealMode ? 0 : opponent.currentHp <= 30 ? 1 : 0} 
            maxValue={1} 
            label={sosoHealMode ? "強制コラボ召喚中" : "とくぎはつどう：1"}
          />
        </div>
      </div>
    </>
  );
};

export default GaugesDisplay;
