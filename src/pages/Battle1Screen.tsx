import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AudioPlayer from '@/components/AudioPlayer';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileContainer from '@/components/MobileContainer';
import { BATTLE_BGM, SOSO_SPECIAL_BGM, VICTORY_BGM, DEFEAT_BGM, BUTTON_SOUND } from '@/constants/audioUrls';
import { useBattleLogic } from '@/hooks/useBattleLogic';

const Battle1Screen: React.FC = () => {
  const { bgmEnabled, toggleBgm } = useApp();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [buttonSound, setButtonSound] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  // 連続クリック防止用の即時フラグ
  const actionInProgressRef = useRef(false);

  const {
    player,
    opponent1,
    battleTimer,
    isBattleOver,
    isPlayerTurn,
    attackCount,
    sosoHealMode,
    specialAttackAvailable,
    comments,
    showSkipButton,
    handlePlayerAttack,
    handlePlayerSpecial,
    handleRunAway,
    handleHighball,
    handleCharacterClick,
    showCharacterSheet,
    currentCharacterSheet,
    setShowCharacterSheet,
    handleSkip,
    battleResult,
  } = useBattleLogic();

  const getCurrentBgm = useCallback(() => {
    if (battleResult === 'victory') return VICTORY_BGM;
    if (battleResult === 'defeat') return DEFEAT_BGM;
    if (sosoHealMode) return SOSO_SPECIAL_BGM;
    return BATTLE_BGM;
  }, [battleResult, sosoHealMode]);

  const currentBgm = getCurrentBgm();
  const [bgmKey, setBgmKey] = useState(Date.now());

  useEffect(() => {
    setBgmKey(Date.now());
    const preloadAudios = [BATTLE_BGM, SOSO_SPECIAL_BGM, VICTORY_BGM, DEFEAT_BGM, BUTTON_SOUND];
    preloadAudios.forEach(url => {
      const audio = new Audio();
      audio.src = url;
    });
  }, [currentBgm]);

  // クリック時に即座に連打を防ぐ処理
  const playButtonSoundAndDoAction = (action: () => void) => {
    if (actionInProgressRef.current) return;
    actionInProgressRef.current = true;
    setActionInProgress(true);
    setButtonSound(BUTTON_SOUND);
    setTimeout(() => {
      action();
      setTimeout(() => {
        setButtonSound(null);
        setActionInProgress(false);
        actionInProgressRef.current = false;
      }, 500);
    }, 200);
  };

  const handleSkipWithSound = useCallback(() => {
    playButtonSoundAndDoAction(handleSkip);
  }, [handleSkip]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        handleSkipWithSound();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkipWithSound]);

  return (
    <MobileContainer backgroundGradient="linear-gradient(180deg, rgba(212,50,144,1), rgba(119,3,175,1))">
      <div
        className="flex flex-col h-full p-2 sm:p-4 text-white relative"
        style={{
          background: 'linear-gradient(180deg, rgba(212,50,144,1), rgba(119,3,175,1))',
          fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif',
          width: '100%',
          height: '100%',
        }}
      >
        <AudioPlayer
          src={currentBgm}
          loop={battleResult === null}
          autoPlay={true}
          volume={0.7}
          id={`battle1-bgm-${bgmKey}`}
          key={`bgm-${bgmKey}`}
        />

        {buttonSound && (
          <AudioPlayer
            src={buttonSound}
            loop={false}
            autoPlay={true}
            volume={0.7}
            id="button-sound"
          />
        )}

        <PlayerInfo name="とおる＠経営参謀" icon={player.icon} battleTimer={battleTimer} />

        <GaugesDisplay player={player} opponent={opponent1} attackCount={attackCount} sosoHealMode={sosoHealMode} />

        <CharacterPortraits player={player} opponent={opponent1} onCharacterClick={handleCharacterClick} sosoHealMode={sosoHealMode} />

        <div className="flex-1 mb-1 sm:mb-2 h-[20vh] sm:h-[25vh] overflow-hidden">
          <CommentArea comments={comments} />
        </div>

        <div className="mt-auto">
          <BattleActions
            isPlayerTurn={isPlayerTurn}
            isBattleOver={isBattleOver}
            specialAttackAvailable={specialAttackAvailable}
            onAttack={handlePlayerAttack}
            onSpecial={handlePlayerSpecial}
            onRunAway={handleRunAway}
            onHighball={handleHighball}
          />
          <CommentInput />
        </div>

        {showSkipButton && (
          <Button
            onClick={handleSkipWithSound}
            disabled={actionInProgress}
            className={`absolute bottom-16 sm:bottom-20 right-3 sm:right-6 z-20 bg-purple-600 hover:bg-purple-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md animate-pulse flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
              actionInProgress ? 'opacity-70' : ''
            }`}
            style={{ position: 'absolute' }}
          >
            <SkipForward size={isMobile ? 16 : 20} />
            スキップ
          </Button>
        )}

        <button
          onClick={toggleBgm}
          className="absolute top-3 sm:top-6 right-3 sm:right-6 z-20 bg-white/10 backdrop-blur-sm p-2 sm:p-3 rounded-full hover:bg-white/20 transition-colors"
        >
          {bgmEnabled ? <Volume2 size={isMobile ? 20 : 24} color="white" /> : <VolumeX size={isMobile ? 20 : 24} color="white" />}
        </button>

        {showCharacterSheet && (
          <CharacterSheet character={currentCharacterSheet} onClose={() => setShowCharacterSheet(false)} />
        )}
      </div>
    </MobileContainer>
  );
};

export default Battle1Screen;
