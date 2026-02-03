import { describe, it, expect } from 'vitest';
import { getPaidBillsFromPreviousMonths } from './cleanupPaidBills';
import type { Bill } from '../types';

describe('cleanupPaidBills Service', () => {
    const createBill = (overrides: Partial<Bill> = {}): Bill => ({
        id: 'bill_1',
        name: 'Test Bill',
        amount: 1000,
        dueDate: new Date().toISOString(),
        category: 'utility',
        isPaid: false,
        status: 'unpaid',
        recurring: 'none',
        notification: 'none',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...overrides,
    });

    describe('getPaidBillsFromPreviousMonths', () => {
        it('ควร return บิลที่จ่ายแล้วของเดือนก่อน', () => {
            // เดือน ก.พ. 2026
            const currentDate = new Date(2026, 1, 3); // Feb 3, 2026

            const paidBillLastMonth = createBill({
                id: 'paid_jan',
                dueDate: new Date(2026, 0, 15).toISOString(), // Jan 15, 2026
                isPaid: true,
            });

            const result = getPaidBillsFromPreviousMonths([paidBillLastMonth], currentDate);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('paid_jan');
        });

        it('ไม่ควร return บิลที่จ่ายแล้วของเดือนปัจจุบัน', () => {
            const currentDate = new Date(2026, 1, 3); // Feb 3, 2026

            const paidBillThisMonth = createBill({
                id: 'paid_feb',
                dueDate: new Date(2026, 1, 1).toISOString(), // Feb 1, 2026
                isPaid: true,
            });

            const result = getPaidBillsFromPreviousMonths([paidBillThisMonth], currentDate);

            expect(result).toHaveLength(0);
        });

        it('ไม่ควร return บิลที่ยังไม่จ่ายของเดือนก่อน', () => {
            const currentDate = new Date(2026, 1, 3); // Feb 3, 2026

            const unpaidBillLastMonth = createBill({
                id: 'unpaid_jan',
                dueDate: new Date(2026, 0, 15).toISOString(), // Jan 15, 2026
                isPaid: false,
            });

            const result = getPaidBillsFromPreviousMonths([unpaidBillLastMonth], currentDate);

            expect(result).toHaveLength(0);
        });

        it('ควร handle กรณีข้ามปี (ธ.ค. 2025 → ม.ค. 2026)', () => {
            const currentDate = new Date(2026, 0, 5); // Jan 5, 2026

            const paidBillDec = createBill({
                id: 'paid_dec',
                dueDate: new Date(2025, 11, 20).toISOString(), // Dec 20, 2025
                isPaid: true,
            });

            const result = getPaidBillsFromPreviousMonths([paidBillDec], currentDate);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('paid_dec');
        });

        it('ควร return หลายบิลจากหลายเดือนก่อนหน้า', () => {
            const currentDate = new Date(2026, 2, 1); // Mar 1, 2026

            const paidBillJan = createBill({
                id: 'paid_jan',
                dueDate: new Date(2026, 0, 10).toISOString(), // Jan 10, 2026
                isPaid: true,
            });
            const paidBillFeb = createBill({
                id: 'paid_feb',
                dueDate: new Date(2026, 1, 15).toISOString(), // Feb 15, 2026
                isPaid: true,
            });
            const unpaidBillMar = createBill({
                id: 'unpaid_mar',
                dueDate: new Date(2026, 2, 5).toISOString(), // Mar 5, 2026
                isPaid: false,
            });

            const result = getPaidBillsFromPreviousMonths(
                [paidBillJan, paidBillFeb, unpaidBillMar],
                currentDate
            );

            expect(result).toHaveLength(2);
            expect(result.map(b => b.id)).toContain('paid_jan');
            expect(result.map(b => b.id)).toContain('paid_feb');
        });

        it('ควร return empty array เมื่อไม่มีบิลเลย', () => {
            const currentDate = new Date(2026, 1, 3);
            const result = getPaidBillsFromPreviousMonths([], currentDate);
            expect(result).toHaveLength(0);
        });
    });
});
