
import React from 'react';

const Footer: React.FC = () => {
  return (
    <div 
      className="w-full flex items-center justify-center"
      style={{
        height: '52px',
        fontFamily: '"Noto Sans JP", sans-serif',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '17px',
      }}
    >
      <a 
        href="https://stand.fm/channels/5e82bebe4afcd351043886fe" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-[rgb(119,119,119)] hover:text-pink-500 transition-colors"
      >
        presented by 巨万の富男
      </a>
    </div>
  );
};

export default Footer;
