import { useEffect, useRef, useCallback } from 'react';
import { useBills } from './useBills';
import { useBillBook } from './useBillBook';
import { generateMonthlyBills } from '../services/billGenerator';
import type { Bill, RecurringExpense } from '../types';

export function useBillGenerator() {
    const { expenses, updateExpense, loading: expensesLoading } = useBillBook();
    const { bills, addBill, loading: billsLoading } = useBills();

    // Track generated keys to prevent duplicates
    // Key format: recurringExpenseId_Month_Year
    const processedGenerations = useRef<Set<string>>(new Set());

    // Flag to ensure generation runs only once per session
    const hasGenerated = useRef(false);

    // Flag to prevent concurrent generation
    const isGenerating = useRef(false);

    // Stable addBill reference using useCallback pattern with ref
    const addBillRef = useRef(addBill);
    addBillRef.current = addBill;

    const updateExpenseRef = useRef(updateExpense);
    updateExpenseRef.current = updateExpense;

    const stableAddBill = useCallback(async (billData: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => {
        return addBillRef.current(billData);
    }, []);

    const stableUpdateExpense = useCallback(async (id: string, updates: Partial<RecurringExpense>) => {
        return updateExpenseRef.current(id, updates);
    }, []);

    // Main generation effect - WAITS until data is loaded
    useEffect(() => {
        // ❌ Guard 1: Skip if still loading
        if (billsLoading || expensesLoading) {
            return;
        }

        // ❌ Guard 2: Skip if no expenses
        if (expenses.length === 0) {
            return;
        }

        // ❌ Guard 3: Skip if already generated or generating
        if (hasGenerated.current || isGenerating.current) {
            return;
        }

        const runGeneration = async () => {
            isGenerating.current = true;

            try {
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                // Pre-populate processedGenerations with existing bills from DB
                bills.forEach(bill => {
                    if (bill.recurringExpenseId) {
                        const billDate = new Date(bill.dueDate);
                        if (billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear) {
                            const key = `${bill.recurringExpenseId}_${currentMonth}_${currentYear}`;
                            processedGenerations.current.add(key);
                        }
                    }
                });

                // Generate new bills based on current data
                const { newBills, updatedExpenses } = generateMonthlyBills(
                    expenses,
                    bills // Use actual bills state now (not ref) - it's loaded!
                );

                const billsToAdd: Bill[] = [];

                for (const bill of newBills) {
                    if (!bill.recurringExpenseId) continue;

                    const key = `${bill.recurringExpenseId}_${currentMonth}_${currentYear}`;

                    // Skip if already processed in this session
                    if (processedGenerations.current.has(key)) {
                        continue;
                    }

                    // Mark as processed BEFORE adding to prevent race condition
                    processedGenerations.current.add(key);
                    billsToAdd.push(bill);
                }

                // Add bills sequentially to avoid race conditions
                for (const bill of billsToAdd) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { id: _id, createdAt: _created, updatedAt: _updated, ...billData } = bill;
                    await stableAddBill(billData);
                }

                // Update expenses if needed
                for (const exp of updatedExpenses) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { id, createdAt: _created, updatedAt: _updated, ...updates } = exp;
                    await stableUpdateExpense(id, updates);
                }

                if (billsToAdd.length > 0) {
                    // Bills generated successfully
                }

                // Mark as generated AFTER successful completion
                hasGenerated.current = true;
            } finally {
                isGenerating.current = false;
            }
        };

        runGeneration();
    }, [bills, expenses, billsLoading, expensesLoading, stableAddBill, stableUpdateExpense]);
}
