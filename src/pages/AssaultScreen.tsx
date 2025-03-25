import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AudioPlayer from '@/components/AudioPlayer';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileContainer from '@/components/MobileContainer';

// 新しいBGM、ボタン効果音のURL
const BGM_URL = "https://tangerine-valkyrie-189847.netlify.app/6-2-ugmode.mp3";
const BUTTON_SOUND_URL = "https://tangerine-valkyrie-189847.netlify.app/1-a-button.mp3";

const EndingAScreen: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { bgmEnabled, toggleBgm, handleScreenTransition, resetBattleState } = useApp();
  const [buttonSound, setButtonSound] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  // スキップボタン押下時に battle2Screen へ遷移
  const handleSkip = () => {
    if (actionInProgress) return;
    setActionInProgress(true);
    // ボタン効果音の再生が必要な場合は下記のように setButtonSound(BUTTON_SOUND_URL) を実行する（ここでは省略）
    resetBattleState();
    handleScreenTransition('battle2');
    navigate('/battle2');
  };

  return (
    <MobileContainer backgroundImage="https://tangerine-valkyrie-189847.netlify.app/ug3.jpg">
      <div 
        className="flex flex-col p-4 justify-center items-center text-white bg-cover bg-center h-full w-full"
        style={{ 
          backgroundImage: 'url("https://tangerine-valkyrie-189847.netlify.app/ug3.jpg")',
          fontFamily: '"Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif',
        }}
      >
        <AudioPlayer 
          src={BGM_URL} 
          loop={true} 
          autoPlay={true}
          volume={0.7}
          id="ending-a-bgm"
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
        
        {/* スターウォーズ風スクロールテキスト */}
        <div className="relative flex-1 flex items-center justify-center w-full overflow-hidden perspective" style={{ zIndex: 1, height: '100vh' }}>
          <div 
            className="absolute w-full max-w-3xl mx-auto text-center transform rotate3d"
            style={{ 
              transform: 'perspective(400px) rotateX(25deg)',
              top: '100%',
              animation: 'textScroll 30s linear infinite'
            }}
          >
            <div 
              style={{
                color: 'white',
                fontSize: isMobile ? 'calc(0.875rem + 2px)' : 'calc(1.125rem + 4px)',
                WebkitTextStroke: '1px black',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 5px #000000e6, 0 0 10px #0006',
              }}
            >
              <p>うぇーい！みんな～</p>
              <br />
              <p>「ゆうじの陽気なおじさん」</p>
              <p>でお馴染み、大久保です！！</p>
              <br /><br />
              <p>って、おいおい！</p>
              <p>それは俺のおじさんやないかい！！</p>
              <p>陽気なおじさん＠ゆうじです！</p>
              <br /><br />
              <p>今日はやってやりますよ</p>
              <p>実は、フリーになって</p>
              <p>ついに、やまにぃを超えちゃった</p>
              <p>って思ってるんですよ</p>
              <p>やまにぃには内緒ですよ</p>
              <p>また怒られちゃうから</p>
              <p>カルシウム足りてないのかな～</p>
              <br /><br />
              <p>さて、今日はやまにいに、</p>
              <p>経営について指南してやりますよ</p>
              <br />
              <p>ちぇけら！</p>
              <br />
              <p>皆さん、</p>
              <p>よろしくウェイで～す！！</p>
            </div>
          </div>
        </div>
        
        {/* 下部は旧ボタン群を削除し、代わりに以下の二つのボタンを設置 */}
        
        {/* スキップボタン */}
        <Button
          onClick={handleSkip}
          disabled={actionInProgress}
          className={`absolute bottom-8 right-6 z-30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white flex items-center gap-2 ${actionInProgress ? 'opacity-70' : ''}`}
          variant="ghost"
        >
          <span>スキップ</span>
          <SkipForward size={18} />
        </Button>

        {/* サウンドトグルボタン */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBgm();
          }}
          className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
        >
          {bgmEnabled ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color="white" />}
        </button>
      </div>
    </MobileContainer>
  );
};

export default EndingAScreen;