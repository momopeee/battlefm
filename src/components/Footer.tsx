
import React from 'react';

const Footer: React.FC = () => {
  return (
    <div 
      className="w-full flex items-center justify-center py-3"
      style={{ height: '52px' }}
    >
      <a 
        href="https://stand.fm/channels/5e82bebe4afcd351043886fe" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-[11px] text-gray-500 hover:text-pink-500 transition-colors"
        style={{ 
          fontFamily: '"Noto Sans JP", sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: '11px',
          lineHeight: '16px'
        }}
      >
        presented by 巨万の富男
      </a>
    </div>
  );
};

export default Footer;
