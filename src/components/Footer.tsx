
import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="h-[52px] w-full flex items-center justify-center">
      <div className="flex space-x-4 text-[12px] font-normal font-['Noto_Sans_JP',_sans-serif] text-[rgb(119,119,119)]">
        <a 
          href="#" 
          className="hover:text-pink-500"
        >
          シャープ
        </a>
        <a 
          href="#" 
          className="hover:text-pink-500"
        >
          コピーする
        </a>
        <a 
          href="#" 
          className="hover:text-pink-500"
        >
          編集する
        </a>
        <a 
          href="https://stand.fm/channels/5e82bebe4afcd351043886fe" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-pink-500"
        >
          presented by 巨万の富男
        </a>
      </div>
    </div>
  );
};

export default Footer;
