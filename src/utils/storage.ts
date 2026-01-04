/**
 * Storage Keys Constants
 * Centralized storage keys for localStorage to ensure consistency
 */

export const STORAGE_KEYS = {
    /** Bills data array */
    BILLS: 'nzbill_bills',
    /** Total cash balance */
    TOTAL_CASH: 'nzbill_total_cash',
    /** User level (gamification) */
    LEVEL: 'nzbill_level',
    /** App settings */
    SETTINGS: 'nzbill_settings',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

/**
 * Default values for storage
 */
export const STORAGE_DEFAULTS = {
    [STORAGE_KEYS.BILLS]: [] as const,
    [STORAGE_KEYS.TOTAL_CASH]: 5000,
    [STORAGE_KEYS.LEVEL]: 1,
    [STORAGE_KEYS.SETTINGS]: {
        soundEnabled: true,
        notificationsEnabled: true,
        language: 'th' as const,
    },
} as const;
