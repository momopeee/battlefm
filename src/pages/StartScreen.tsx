
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Volume2, VolumeX } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';

const StartScreen: React.FC = () => {
  const { toggleBgm, bgmEnabled, handleScreenTransition } = useApp();
  const [showText, setShowText] = useState(false);
  
  useEffect(() => {
    // Start the intro text scrolling animation after a delay
    const timer = setTimeout(() => {
      setShowText(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleStart = () => {
    handleScreenTransition('battle1');
  };
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AudioPlayer src="/audios/toru1.mp3" loop autoPlay />
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url(/lovable-uploads/321e0f72-e749-492d-bb12-84c9daae40c6.png)' }}
      ></div>
      
      {/* Star Wars style scrolling text */}
      {showText && (
        <div className="star-wars-text w-full h-full">
          <div className="star-wars-text-inner text-white">
            <p>
              ファンキーな世の中をあなたはどう生きますか？
              <br />
              <br />
              一つの業種を一生涯やる必要がない自由な空気
              <br />
              <br />
              嫌な上司に我慢することなく転職できる環境
              <br />
              <br />
              大企業が良いとか中小企業がダメだとか
              <br />
              <br />
              ステレオタイプの価値観からの開放
              <br />
              <br />
              昔の成功体験ばかりを語るバブル世代の衰退
              <br />
              <br />
              家族のためにと自分の人生を押し殺す美学からの開放
              <br />
              <br />
              なんだかワクワクしますね。
              <br />
              <br />
              ニヤニヤが止まりません。
              <br />
              <br />
              ファンキーな世の中ですが
              <br />
              <br />
              どう捉えるか、どう生きるかは
              <br />
              <br />
              あなた次第なんです。
              <br />
              <br />
              そうなんです。
              <br />
              <br />
              あなたやあなたの会社に
              <br />
              <br />
              実力さえあれば実は楽しい世の中なんです。
              <br />
              <br />
              ファンキーな世の中を楽しめる
              <br />
              <br />
              実力を身につけましょう。
            </p>
          </div>
        </div>
      )}
      
      {/* Start Button */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center items-center z-10">
        <button
          onClick={handleStart}
          className="bg-battle-pink text-white text-3xl font-bold py-4 px-16 rounded-full hover:opacity-90 transition-opacity"
        >
          START
        </button>
      </div>
      
      {/* BGM Toggle Button */}
      <button
        onClick={toggleBgm}
        className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
      >
        {bgmEnabled ? <Volume2 size={24} color="white" /> : <VolumeX size={24} color="white" />}
      </button>
    </div>
  );
};

export default StartScreen;
