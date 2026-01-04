import { describe, it, expect } from 'vitest';
import { STORAGE_KEYS, STORAGE_DEFAULTS } from './storage';

describe('Storage Constants', () => {
    describe('STORAGE_KEYS', () => {
        it('should have BILLS key', () => {
            expect(STORAGE_KEYS.BILLS).toBe('nzbill_bills');
        });

        it('should have TOTAL_CASH key', () => {
            expect(STORAGE_KEYS.TOTAL_CASH).toBe('nzbill_total_cash');
        });

        it('should have LEVEL key', () => {
            expect(STORAGE_KEYS.LEVEL).toBe('nzbill_level');
        });

        it('should have SETTINGS key', () => {
            expect(STORAGE_KEYS.SETTINGS).toBe('nzbill_settings');
        });
    });

    describe('STORAGE_DEFAULTS', () => {
        it('should have empty array as default for BILLS', () => {
            expect(STORAGE_DEFAULTS[STORAGE_KEYS.BILLS]).toEqual([]);
        });

        it('should have 5000 as default for TOTAL_CASH', () => {
            expect(STORAGE_DEFAULTS[STORAGE_KEYS.TOTAL_CASH]).toBe(5000);
        });

        it('should have 1 as default for LEVEL', () => {
            expect(STORAGE_DEFAULTS[STORAGE_KEYS.LEVEL]).toBe(1);
        });

        it('should have correct default settings', () => {
            const settings = STORAGE_DEFAULTS[STORAGE_KEYS.SETTINGS];
            expect(settings.soundEnabled).toBe(true);
            expect(settings.notificationsEnabled).toBe(true);
            expect(settings.language).toBe('th');
        });
    });
});
