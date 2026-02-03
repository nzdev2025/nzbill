import { useLocalStorage } from './useLocalStorage';
import { CHARACTERS, DEFAULT_CHARACTER_ID } from '../config/characters';
import type { CharacterExpression } from '../types';

export function useCharacterSystem() {
    const [currentCharacterId, setCharacterId] = useLocalStorage<string>(
        'nzbill_character_id',
        DEFAULT_CHARACTER_ID
    );

    const currentCharacter = CHARACTERS.find(c => c.id === currentCharacterId) || CHARACTERS[0];

    const getCharacterAssets = (expression: CharacterExpression) => {
        return currentCharacter.assets[expression] || currentCharacter.assets.idle;
    };

    return {
        currentCharacterId,
        currentCharacter,
        availableCharacters: CHARACTERS,
        setCharacterId,
        getCharacterAssets,
        unlockCharacter: (id: string) => {
            // Future implementation for unlocking logic
            console.log('Unlocking character:', id);
        }
    };
}
