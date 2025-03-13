
import React from 'react';
import { Character } from '@/context/AppContext';

interface CharacterPortraitsProps {
  player: Character;
  opponent: Character;
  onCharacterClick: (character: 'player' | 'opponent1') => void;
}

const CharacterPortraits: React.FC<CharacterPortraitsProps> = ({ 
  player, 
  opponent, 
  onCharacterClick 
}) => {
  return (
    <div className="grid grid-cols-4 mb-2">
      <div className="col-span-1"></div>
      <div 
        className="flex flex-col items-center col-span-1 cursor-pointer" 
        onClick={() => onCharacterClick('player')}
      >
        <img 
          src={player.icon} 
          alt={player.name} 
          className="w-16 h-16 rounded-full"
        />
        <span className="font-bold mt-1 truncate w-20 text-center text-[10px]">
          {player.name.length > 5 ? `${player.name.substring(0, 5)}...` : player.name}
        </span>
      </div>
      
      <div 
        className="flex flex-col items-center col-span-1 cursor-pointer" 
        onClick={() => onCharacterClick('opponent1')}
      >
        <img 
          src={opponent.icon} 
          alt={opponent.name} 
          className="w-16 h-16 rounded-full"
        />
        <span className="font-bold mt-1 truncate w-20 text-center text-[10px]">
          {opponent.name.length > 5 ? `${opponent.name.substring(0, 5)}...` : opponent.name}
        </span>
      </div>
      <div className="col-span-1"></div>
    </div>
  );
};

export default CharacterPortraits;
