
import React, { useMemo } from 'react';
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

// パフォーマンス最適化のためのpropsを比較する関数
const propsAreEqual = (
  prevProps: GaugesDisplayProps,
  nextProps: GaugesDisplayProps
): boolean => {
  return (
    prevProps.player.currentHp === nextProps.player.currentHp &&
    prevProps.player.maxHp === nextProps.player.maxHp &&
    prevProps.opponent.currentHp === nextProps.opponent.currentHp &&
    prevProps.opponent.maxHp === nextProps.opponent.maxHp &&
    prevProps.attackCount === nextProps.attackCount &&
    prevProps.sosoHealMode === nextProps.sosoHealMode
  );
};

const GaugesDisplay: React.FC<GaugesDisplayProps> = ({
  player,
  opponent,
  attackCount,
  sosoHealMode
}) => {
  const isMobile = useIsMobile();
  
  // Memoize classes to prevent recalculation
  const containerClasses = useMemo(() => 
    `flex gap-2 sm:gap-4 mb-1 sm:mb-2 w-full ${isMobile ? 'px-1' : ''}`
  , [isMobile]);
  
  // Memoize opponent's special gauge condition
  const opponentSpecialValue = useMemo(() => 
    sosoHealMode ? 0 : opponent.currentHp <= 30 ? 1 : 0
  , [sosoHealMode, opponent.currentHp]);
  
  // Memoize special gauge label
  const specialGaugeLabel = useMemo(() => 
    sosoHealMode ? "強制コラボ召喚中" : "とくぎはつどう：1"
  , [sosoHealMode]);
  
  return (
    <>
      {/* Health bars */}
      <div className={containerClasses}>
        <div className="flex-1">
          <HPBar currentHP={player.currentHp} maxHP={player.maxHp} />
        </div>
        <div className="flex-1">
          <HPBar currentHP={opponent.currentHp} maxHP={opponent.maxHp} />
        </div>
      </div>
      
      {/* Special attack gauges */}
      <div className={containerClasses}>
        <div className="flex-1">
          <SpecialGauge currentValue={attackCount} maxValue={3} />
        </div>
        <div className="flex-1">
          {/* Opponent's special gauge (heal mode gauge) - Updated condition to HP <= 30 */}
          <SpecialGauge 
            currentValue={opponentSpecialValue}
            maxValue={1} 
            label={specialGaugeLabel}
          />
        </div>
      </div>
    </>
  );
};

// React.memo で囲み、カスタム比較関数を提供してレンダリングを最適化
export default React.memo(GaugesDisplay, propsAreEqual);
