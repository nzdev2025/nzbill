import { describe, it, expect } from 'vitest';
import { generateId } from './common';

describe('Common Utilities', () => {
    describe('generateId', () => {
        it('should generate unique IDs', () => {
            const id1 = generateId();
            const id2 = generateId();
            expect(id1).not.toBe(id2);
        });

        it('should use default prefix "id" when not provided', () => {
            const id = generateId();
            expect(id).toMatch(/^id_/);
        });

        it('should use custom prefix when provided', () => {
            const id = generateId('bill');
            expect(id).toMatch(/^bill_/);
        });

        it('should include timestamp in the ID', () => {
            const before = Date.now();
            const id = generateId('test');
            const after = Date.now();

            // Extract timestamp from ID (format: prefix_timestamp_random)
            const parts = id.split('_');
            const timestamp = parseInt(parts[1], 10);

            expect(timestamp).toBeGreaterThanOrEqual(before);
            expect(timestamp).toBeLessThanOrEqual(after);
        });

        it('should have random suffix', () => {
            const id = generateId('test');
            const parts = id.split('_');
            expect(parts.length).toBe(3);
            expect(parts[2].length).toBeGreaterThan(0);
        });
    });
});
