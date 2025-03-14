
import React, { createContext, useContext, useState } from 'react';

export interface Character {
  name: string;
  icon: string;
  maxHp: number;
  currentHp: number;
  attackMin: number;
  attackMax: number;
  specialPower: number;
}

interface CharacterContextType {
  player: Character;
  opponent1: Character;
  opponent2: Character;
  showCharacterSheet: boolean;
  currentCharacterSheet: 'player' | 'opponent1' | 'opponent2' | null;
  
  setPlayer: (player: Character) => void;
  setOpponent1: (opponent: Character) => void;
  setOpponent2: (opponent: Character) => void;
  setShowCharacterSheet: (show: boolean) => void;
  setCurrentCharacterSheet: (character: 'player' | 'opponent1' | 'opponent2' | null) => void;
}

const CharacterContext = createContext<CharacterContextType>({
  player: {
    name: 'とおる＠経営参謀',
    icon: '/lovable-uploads/c1b2b6d0-3acd-4ea0-b336-0631411ff128.png',
    maxHp: 100,
    currentHp: 100,
    attackMin: 15,
    attackMax: 25,
    specialPower: 40
  },
  opponent1: {
    name: 'そーそー＠狂犬ツイート',
    icon: '/lovable-uploads/b62bfeb2-59a1-4f1b-976a-d026638e0416.png',
    maxHp: 70,
    currentHp: 70,
    attackMin: 20,
    attackMax: 30,
    specialPower: 0
  },
  opponent2: {
    name: 'ゆうじ＠陽気なおじさん',
    icon: '/lovable-uploads/988ea3ef-2efe-4616-a292-04d0d01fb33c.png',
    maxHp: 100,
    currentHp: 100,
    attackMin: 15,
    attackMax: 25,
    specialPower: 40
  },
  showCharacterSheet: false,
  currentCharacterSheet: null,
  
  setPlayer: () => {},
  setOpponent1: () => {},
  setOpponent2: () => {},
  setShowCharacterSheet: () => {},
  setCurrentCharacterSheet: () => {},
});

export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayerState] = useState<Character>({
    name: 'とおる＠経営参謀',
    icon: '/lovable-uploads/c1b2b6d0-3acd-4ea0-b336-0631411ff128.png',
    maxHp: 100,
    currentHp: 100,
    attackMin: 15,
    attackMax: 25,
    specialPower: 40
  });
  const [opponent1, setOpponent1State] = useState<Character>({
    name: 'そーそー＠狂犬ツイート',
    icon: '/lovable-uploads/b62bfeb2-59a1-4f1b-976a-d026638e0416.png',
    maxHp: 70,
    currentHp: 70,
    attackMin: 20,
    attackMax: 30,
    specialPower: 0
  });
  const [opponent2, setOpponent2State] = useState<Character>({
    name: 'ゆうじ＠陽気なおじさん',
    icon: '/lovable-uploads/988ea3ef-2efe-4616-a292-04d0d01fb33c.png',
    maxHp: 100,
    currentHp: 100,
    attackMin: 15,
    attackMax: 25,
    specialPower: 40
  });
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  const [currentCharacterSheet, setCurrentCharacterSheet] = useState<'player' | 'opponent1' | 'opponent2' | null>(null);

  // Update player character
  const setPlayer = (updatedPlayer: Character) => {
    setPlayerState(updatedPlayer);
  };

  // Update opponent1 character
  const setOpponent1 = (updatedOpponent: Character) => {
    setOpponent1State(updatedOpponent);
  };

  // Update opponent2 character
  const setOpponent2 = (updatedOpponent: Character) => {
    setOpponent2State(updatedOpponent);
  };

  const value = {
    player,
    opponent1,
    opponent2,
    showCharacterSheet,
    currentCharacterSheet,
    setPlayer,
    setOpponent1,
    setOpponent2,
    setShowCharacterSheet,
    setCurrentCharacterSheet,
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => useContext(CharacterContext);
