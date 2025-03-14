
import React from 'react';
import { UIProvider, useUI, Screen } from './UIContext';
import { CharacterProvider, useCharacter, Character } from './CharacterContext';
import { BattleProvider, useBattle, Comment } from './BattleContext';

// Re-export types and hooks for backward compatibility
export type { Screen, Character, Comment };

// Create a composite provider that combines all our contexts
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <UIProvider>
      <CharacterProvider>
        <BattleProvider>
          {children}
        </BattleProvider>
      </CharacterProvider>
    </UIProvider>
  );
};

// Create a composite hook that combines all our hooks
export const useApp = () => {
  const uiContext = useUI();
  const characterContext = useCharacter();
  const battleContext = useBattle();

  return {
    ...uiContext,
    ...characterContext,
    ...battleContext,
  };
};
