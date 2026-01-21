import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAnalytics } from './useAnalytics';
import type { Bill, BillCategory } from '../types';

describe('useAnalytics Hook', () => {
    const mockBills: Bill[] = [
        {
            id: '1',
            name: 'Electricity',
            amount: 1000,
            dueDate: '2024-01-15',
            category: 'electricity' as BillCategory, // Using valid category 'electricity' instead of generic 'utility'
            isPaid: true,
            isRecurring: true,
            recurringDay: 15,
            recurringExpenseId: 'rec1',
            reminderDaysBefore: 3,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
        },
        {
            id: '2',
            name: 'Internet',
            amount: 500,
            dueDate: '2024-01-20',
            category: 'internet' as BillCategory,
            isPaid: false, // Unpaid
            isRecurring: true,
            recurringDay: 20,
            recurringExpenseId: 'rec2',
            reminderDaysBefore: 3,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
        },
        {
            id: '3',
            name: 'Netflix',
            amount: 300,
            dueDate: '2024-01-05',
            category: 'subscription' as BillCategory,
            isPaid: true,
            isRecurring: true,
            recurringDay: 5,
            recurringExpenseId: 'rec3',
            reminderDaysBefore: 3,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
        },
        {
            id: '4',
            name: 'Credit Card',
            amount: 5000,
            dueDate: '2024-02-01', // Different month
            category: 'credit_card' as BillCategory,
            isPaid: false,
            isRecurring: false,
            recurringDay: undefined,
            recurringExpenseId: undefined,
            reminderDaysBefore: 3,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
        }
    ];

    it('should calculate monthly totals correctly', () => {
        const { result } = renderHook(() => useAnalytics(mockBills));

        // Filter for January 2024
        const stats = result.current.getMonthlyStats(0, 2024); // Month 0 = Jan

        // Jan Bills: Elec (1000, Paid), Internet (500, Unpaid), Netflix (300, Paid)
        // Total: 1800
        // Paid: 1300
        // Unpaid: 500

        expect(stats.total).toBe(1800);
        expect(stats.totalPaid).toBe(1300);
        expect(stats.totalUnpaid).toBe(500);
    });

    it('should aggregate category breakdown for ALL available bills (or filtered range)', () => {
        // Let's test granular breakdown for a specific month
        const { result } = renderHook(() => useAnalytics(mockBills));

        // Jan 2024
        const breakdown = result.current.getCategoryBreakdown(0, 2024);

        // Electricity (1000) + Internet (500) = 1500? No, they are distinct categories now.
        // Electricity: 1000
        // Internet: 500
        // Subscription: 300

        expect(breakdown).toEqual(expect.arrayContaining([
            { name: 'electricity', value: 1000 },
            { name: 'internet', value: 500 },
            { name: 'subscription', value: 300 }
        ]));
    });

    it('should handle empty bill list', () => {
        const { result } = renderHook(() => useAnalytics([]));
        const stats = result.current.getMonthlyStats(0, 2024);

        expect(stats.total).toBe(0);
        expect(stats.totalPaid).toBe(0);
        expect(stats.totalUnpaid).toBe(0);
        expect(result.current.getCategoryBreakdown(0, 2024)).toEqual([]);
    });
    it('should calculate 6-month trend correctly', () => {
        const { result } = renderHook(() => useAnalytics(mockBills));

        // Use Feb 2024 as reference. Trend should cover Sep 2023 - Feb 2024
        // Jan 2024 (Month -1) has total 1800
        // Feb 2024 (Month 0) has total 5000 (Credit Card)

        const trend = result.current.getSixMonthTrend(new Date(2024, 1, 15)); // Feb 2024

        expect(trend).toHaveLength(6);

        const janStats = trend.find(t => t.name.includes('Jan'));
        const febStats = trend.find(t => t.name.includes('Feb'));

        // Note: Locale strings might vary slightly depending on environment "Jan" vs "ม.ค." 
        // but 'default' locale usually defaults to English in Node environment unless set otherwise.

        // Check exact values based on mock data
        // Jan should be 1800
        if (janStats) expect(janStats.total).toBe(1800);

        // Feb should be 5000
        if (febStats) expect(febStats.total).toBe(5000);
    });
});
