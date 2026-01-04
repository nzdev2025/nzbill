import { describe, it, expect } from 'vitest';
import { generateMonthlyBills } from './billGenerator';
import type { RecurringExpense, Bill } from '../types';

describe('billGenerator Service', () => {
    const mockExpense: RecurringExpense = {
        id: 'rec_1',
        name: 'ค่าเน็ต',
        amount: 500,
        dueDay: 5,
        category: 'internet',
        active: true,
        isInstallment: false,
        createdAt: '',
        updatedAt: ''
    };

    const mockInstallment: RecurringExpense = {
        id: 'rec_2',
        name: 'ผ่อนคอม',
        amount: 2000,
        dueDay: 10,
        category: 'loan',
        active: true,
        isInstallment: true,
        totalTerms: 10,
        currentTerm: 2,
        createdAt: '',
        updatedAt: ''
    };

    it('should generate a bill if none exists for the current month', () => {
        const targetDate = new Date(2025, 0, 15); // Jan 2025
        const result = generateMonthlyBills([mockExpense], [], targetDate);

        expect(result.newBills).toHaveLength(1);
        expect(result.newBills[0].name).toBe('ค่าเน็ต');
        expect(result.newBills[0].amount).toBe(500);
        // Due date should be Jan 5, 2025
        expect(new Date(result.newBills[0].dueDate).getDate()).toBe(5);
        expect(new Date(result.newBills[0].dueDate).getMonth()).toBe(0);
    });

    it('should NOT generate a bill if it already exists', () => {
        const targetDate = new Date(2025, 0, 15);
        const existingBill: Bill = {
            id: 'bill_1',
            name: 'ค่าเน็ต',
            amount: 500,
            dueDate: new Date(2025, 0, 5).toISOString(),
            category: 'internet',
            isPaid: false,
            reminderDaysBefore: 3,
            isRecurring: true,
            recurringExpenseId: 'rec_1',
            createdAt: '',
            updatedAt: ''
        };

        const result = generateMonthlyBills([mockExpense], [existingBill], targetDate);

        expect(result.newBills).toHaveLength(0);
    });

    it('should handle installment logic correctly', () => {
        const targetDate = new Date(2025, 0, 15);
        const result = generateMonthlyBills([mockInstallment], [], targetDate);

        expect(result.newBills).toHaveLength(1);
        expect(result.newBills[0].name).toBe('ผ่อนคอม (ผ่อนชำระ)');
        
        // No updates expected since we removed counting logic
        expect(result.updatedExpenses).toHaveLength(0);
    });

    it('should NOT deactivate installment automatically', () => {
        const lastTermInstallment: RecurringExpense = {
            ...mockInstallment,
            currentTerm: 9
        };
        
        const targetDate = new Date(2025, 0, 15);
        const result = generateMonthlyBills([lastTermInstallment], [], targetDate);

        expect(result.newBills[0].name).toBe('ผ่อนคอม (ผ่อนชำระ)');
        expect(result.updatedExpenses).toHaveLength(0);
    });

    it('should handle end of month correctly (e.g., dueDay 31 in Feb)', () => {
        const endOfMonthExpense: RecurringExpense = {
            ...mockExpense,
            dueDay: 31
        };
        const targetDate = new Date(2024, 1, 15); // Feb 2024 (Leap year)
        
        const result = generateMonthlyBills([endOfMonthExpense], [], targetDate);
        
        const dueDate = new Date(result.newBills[0].dueDate);
        expect(dueDate.getDate()).toBe(29); // Feb 29
        expect(dueDate.getMonth()).toBe(1);
    });
});
