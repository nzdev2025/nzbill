import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCharacterSystem } from './useCharacterSystem';
import { CHARACTERS, DEFAULT_CHARACTER_ID } from '../config/characters';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        },
        removeItem: (key: string) => {
            delete store[key];
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

describe('useCharacterSystem', () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('should return default character initially', () => {
        const { result } = renderHook(() => useCharacterSystem());
        expect(result.current.currentCharacterId).toBe(DEFAULT_CHARACTER_ID);
        expect(result.current.currentCharacter).toEqual(CHARACTERS[0]);
    });

    it('should change character', () => {
        const { result } = renderHook(() => useCharacterSystem());

        act(() => {
            result.current.setCharacterId('may_evening');
        });

        expect(result.current.currentCharacterId).toBe('may_evening');
        expect(localStorage.getItem('nzbill_character_id')).toBe(JSON.stringify('may_evening'));
    });

    it('should list available characters', () => {
        const { result } = renderHook(() => useCharacterSystem());
        expect(result.current.availableCharacters).toHaveLength(CHARACTERS.length);
        expect(result.current.availableCharacters[0].id).toBe('may_school');
    });

    it('should get correct assets for expressions', () => {
        const { result } = renderHook(() => useCharacterSystem());
        const assets = result.current.getCharacterAssets('idle');
        // Since we used mayIdle imported, it should match what's in config
        expect(assets).toBeDefined();
        // Just checking it returns a string (path)
        expect(typeof assets).toBe('string');
    });

    it('should persist character selection across re-renders', () => {
        localStorage.setItem('nzbill_character_id', JSON.stringify('may_casual'));
        const { result } = renderHook(() => useCharacterSystem());

        expect(result.current.currentCharacterId).toBe('may_casual');
    });
});
