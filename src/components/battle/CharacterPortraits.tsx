
import React from 'react';
import { Character } from '@/context/AppContext';

interface CharacterPortraitsProps {
  player: Character;
  opponent: Character;
  onCharacterClick: (character: 'player' | 'opponent1' | 'opponent2') => void;
  sosoHealMode: boolean;
}

const CharacterPortraits: React.FC<CharacterPortraitsProps> = ({ 
  player, 
  opponent, 
  onCharacterClick,
  sosoHealMode
}) => {
  return (
    <div className="flex justify-center gap-8 my-4">
      {/* Player icon */}
      <div 
        className="w-20 h-20 rounded-full overflow-hidden border-4 border-white cursor-pointer hover:scale-105 transition-transform"
        onClick={() => onCharacterClick('player')}
      >
        <img 
          src={player.icon} 
          alt={player.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Support characters or empty space (left) */}
      {sosoHealMode ? (
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-yellow-400">
          <img 
            src="/lovable-uploads/db3fdcd1-853f-40c3-be10-0826c9314e44.png" 
            alt="Lambda" 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-20 h-20 opacity-0"></div>
      )}
      
      {/* Opponent icon */}
      <div 
        className="w-20 h-20 rounded-full overflow-hidden border-4 border-pink-500 cursor-pointer hover:scale-105 transition-transform"
        onClick={() => onCharacterClick(opponent.name.includes('そーそー') ? 'opponent1' : 'opponent2')}
      >
        <img 
          src={opponent.icon} 
          alt={opponent.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Support characters or empty space (right) */}
      {sosoHealMode ? (
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-yellow-400">
          <img 
            src="/lovable-uploads/a9d33020-6655-47eb-919f-1417c213722e.png" 
            alt="Matsushima Koto" 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-20 h-20 opacity-0"></div>
      )}
    </div>
  );
};

export default CharacterPortraits;
