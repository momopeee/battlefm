
import React from 'react';
import { Character } from '@/context/AppContext';

interface CharacterPortraitsProps {
  player: Character;
  opponent: Character;
  onCharacterClick: (character: 'player' | 'opponent1') => void;
  sosoHealMode: boolean;
}

const CharacterPortraits: React.FC<CharacterPortraitsProps> = ({ 
  player, 
  opponent, 
  onCharacterClick,
  sosoHealMode
}) => {
  return (
    <div className="grid grid-cols-4 mb-2">
      {!sosoHealMode && (
        <>
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
        </>
      )}
      
      {sosoHealMode && (
        <>
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
          
          <div className="flex flex-col items-center col-span-1">
            <img 
              src="/lovable-uploads/a9d33020-6655-47eb-919f-1417c213722e.png" 
              alt="ラムダ" 
              className="w-16 h-16 rounded-full"
            />
            <span className="font-bold mt-1 truncate w-20 text-center text-[10px]">
              ラムダ
            </span>
          </div>
          
          <div className="flex flex-col items-center col-span-1">
            <img 
              src="/lovable-uploads/ecbf0b74-7dad-4ec2-bdf6-1ec0a1bed255.png" 
              alt="松嶋こと" 
              className="w-16 h-16 rounded-full"
            />
            <span className="font-bold mt-1 truncate w-20 text-center text-[10px]">
              松嶋こと
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default CharacterPortraits;
