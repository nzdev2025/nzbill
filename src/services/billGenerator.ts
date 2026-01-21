import type { Bill, RecurringExpense } from '../types';
import { generateId } from '../utils/common';
import { getCurrentDate } from '../utils/date';

export interface GenerationResult {
    newBills: Bill[];
    updatedExpenses: RecurringExpense[];
}

export function generateMonthlyBills(
    expenses: RecurringExpense[],
    existingBills: Bill[],
    targetDate: Date = new Date()
): GenerationResult {
    const newBills: Bill[] = [];
    const updatedExpenses: RecurringExpense[] = [];
    const currentMonth = targetDate.getMonth();
    const currentYear = targetDate.getFullYear();

    expenses.forEach(expense => {
        if (!expense.active) return;

        // Check if bill already exists for this expense in this month/year
        const alreadyGenerated = existingBills.some(bill => {
            if (bill.recurringExpenseId !== expense.id) return false;
            const billDate = new Date(bill.dueDate);
            return billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear;
        });

        if (alreadyGenerated) return;

        // Calculate Due Date safely
        // Start with the 1st of the month
        const dueDate = new Date(currentYear, currentMonth, 1);
        // Find the last day of the month
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        // Set day to min(dueDay, lastDayOfMonth)
        dueDate.setDate(Math.min(expense.dueDay, lastDayOfMonth));

        // Prepare Name
        let billName = expense.name;
        if (expense.isInstallment) {
            billName = `${expense.name} (ผ่อนชำระ)`;
        }

        // Determine status
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let status: 'paid' | 'unpaid' | 'overdue' = 'unpaid';
        if (dueDate < today) {
            status = 'overdue';
        }

        const newBill: Bill = {
            id: generateId('bill'),
            name: billName,
            amount: expense.amount,
            dueDate: dueDate.toISOString(),
            category: expense.category,
            isPaid: false,
            status,
            reminderDaysBefore: 3,
            isRecurring: true,
            recurringExpenseId: expense.id,
            recurringDay: expense.dueDay,
            createdAt: getCurrentDate(),
            updatedAt: getCurrentDate(),
        };

        newBills.push(newBill);
    });

    return { newBills, updatedExpenses };
}
