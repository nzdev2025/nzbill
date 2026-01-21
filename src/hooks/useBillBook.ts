import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { RecurringExpense } from '../types';

export interface UseBillBookReturn {
    expenses: RecurringExpense[];
    loading: boolean;
    error: string | null;
    addExpense: (expense: Omit<RecurringExpense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<RecurringExpense | null>;
    updateExpense: (id: string, updates: Partial<Omit<RecurringExpense, 'id' | 'createdAt'>>) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    toggleActive: (id: string) => Promise<void>;
}

export function useBillBook(): UseBillBookReturn {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState<RecurringExpense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchExpenses = useCallback(async () => {
        if (!user) {
            setExpenses([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('recurring_expenses')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mappedExpenses: RecurringExpense[] = (data || []).map((e: any) => ({
                id: e.id,
                name: e.name,
                amount: e.amount,
                dueDay: e.due_day,
                category: e.category,
                active: e.active,
                isInstallment: e.is_installment,
                createdAt: e.created_at,
                updatedAt: e.updated_at,
            }));

            setExpenses(mappedExpenses);
            setError(null);
        } catch (err: unknown) {
            console.error('Error fetching recurring expenses:', err);
            const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const addExpense = useCallback(
        async (expenseData: Omit<RecurringExpense, 'id' | 'createdAt' | 'updatedAt'>): Promise<RecurringExpense | null> => {
            if (!user) return null;
            try {
                const { data, error } = await supabase
                    .from('recurring_expenses')
                    .insert({
                        user_id: user.id,
                        name: expenseData.name,
                        amount: expenseData.amount,
                        due_day: expenseData.dueDay,
                        category: expenseData.category,
                        active: expenseData.active,
                        is_installment: expenseData.isInstallment,
                    })
                    .select()
                    .single();

                if (error) throw error;

                const newExpense: RecurringExpense = {
                    id: data.id,
                    name: data.name,
                    amount: data.amount,
                    dueDay: data.due_day,
                    category: data.category,
                    active: data.active,
                    isInstallment: data.is_installment,
                    createdAt: data.created_at,
                    updatedAt: data.updated_at,
                };

                setExpenses(prev => [newExpense, ...prev]);
                return newExpense;
            } catch (err: unknown) {
                console.error('Error adding recurring expense:', err);
                const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
                setError(message);
                return null;
            }
        },
        [user]
    );

    const updateExpense = useCallback(
        async (id: string, updates: Partial<Omit<RecurringExpense, 'id' | 'createdAt'>>) => {
            if (!user) return;
            try {
                const dbUpdates: Record<string, unknown> = {};
                if (updates.name !== undefined) dbUpdates.name = updates.name;
                if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
                if (updates.dueDay !== undefined) dbUpdates.due_day = updates.dueDay;
                if (updates.category !== undefined) dbUpdates.category = updates.category;
                if (updates.active !== undefined) dbUpdates.active = updates.active;
                if (updates.isInstallment !== undefined) dbUpdates.is_installment = updates.isInstallment;

                dbUpdates.updated_at = new Date().toISOString();

                const { error } = await supabase
                    .from('recurring_expenses')
                    .update(dbUpdates)
                    .eq('id', id);

                if (error) throw error;

                setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
            } catch (err: unknown) {
                console.error('Error updating recurring expense:', err);
                const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
                setError(message);
            }
        },
        [user]
    );

    const deleteExpense = useCallback(
        async (id: string) => {
            if (!user) return;
            try {
                const { error } = await supabase
                    .from('recurring_expenses')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                setExpenses(prev => prev.filter(e => e.id !== id));
            } catch (err: unknown) {
                console.error('Error deleting recurring expense:', err);
                const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
                setError(message);
            }
        },
        [user]
    );

    const toggleActive = useCallback(
        async (id: string) => {
            const expense = expenses.find(e => e.id === id);
            if (expense) {
                await updateExpense(id, { active: !expense.active });
            }
        },
        [expenses, updateExpense]
    );

    return {
        expenses,
        loading,
        error,
        addExpense,
        updateExpense,
        deleteExpense,
        toggleActive,
    };
}

export default useBillBook;
