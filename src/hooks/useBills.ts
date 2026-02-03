import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Bill, BillCategory } from '../types';

export interface UseBillsReturn {
    bills: Bill[];
    loading: boolean;
    error: string | null;
    processingIds: Set<string>;
    addBill: (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Bill | null>;
    updateBill: (id: string, updates: Partial<Omit<Bill, 'id' | 'createdAt'>>) => Promise<void>;
    deleteBill: (id: string) => Promise<void>;
    markAsPaid: (id: string) => Promise<void>;
    markAsUnpaid: (id: string) => Promise<void>;
    getBillsByCategory: (category: BillCategory) => Bill[];
    getUpcomingBills: (days?: number) => Bill[];
    getOverdueBills: () => Bill[];
    getTotalDebt: () => number;
    sortedBills: Bill[];
    refetch: () => Promise<void>;
}

export function useBills(): UseBillsReturn {
    const { user } = useAuth();
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

    const fetchBills = useCallback(async () => {
        if (!user) {
            setBills([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('bills')
                .select('*')
                .order('due_date', { ascending: true });

            if (error) throw error;

            // Map DB snake_case to camelCase if needed, but our schema uses camelCase for some?
            // Wait, schema used snake_case for columns like due_date, reminder_days_before
            // But our frontend uses camelCase: dueDate, reminderDaysBefore
            // We need to map them.

            const mappedBills: Bill[] = (data || []).map((b) => {
                const isPaid = b.is_paid;
                const dueDate = b.due_date;
                let status: 'paid' | 'unpaid' | 'overdue' = 'unpaid';

                if (isPaid) {
                    status = 'paid';
                } else {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const due = new Date(dueDate);
                    if (due < today) {
                        status = 'overdue';
                    }
                }

                return {
                    id: b.id,
                    name: b.name,
                    amount: b.amount,
                    dueDate: b.due_date,
                    category: b.category,
                    isPaid: b.is_paid,
                    status,
                    recurring: 'monthly' as const,
                    notification: 'none' as const,
                    isRecurring: b.is_recurring,
                    reminderDaysBefore: b.reminder_days_before,
                    recurringExpenseId: b.recurring_expense_id,
                    recurringDay: b.recurring_day,
                    createdAt: b.created_at,
                    updatedAt: b.updated_at,
                };
            });

            setBills(mappedBills);
            setError(null);
        } catch (err: unknown) {
            console.error('Error fetching bills:', err);
            const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchBills();

        // Realtime subscription
        if (user) {
            const channel = supabase
                .channel('bills_updates')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'bills',
                        filter: `user_id=eq.${user.id}`,
                    },
                    () => {
                        fetchBills();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user, fetchBills]);

    // Add a new bill
    const addBill = useCallback(
        async (billData: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bill | null> => {
            if (!user) return null;
            try {
                const { data, error } = await supabase
                    .from('bills')
                    .insert({
                        user_id: user.id,
                        name: billData.name,
                        amount: billData.amount,
                        due_date: billData.dueDate,
                        category: billData.category,
                        is_paid: billData.isPaid,
                        is_recurring: billData.isRecurring,
                        reminder_days_before: billData.reminderDaysBefore,
                        recurring_expense_id: billData.recurringExpenseId,
                        recurring_day: billData.recurringDay,
                    })
                    .select()
                    .single();

                if (error) throw error;

                const newBill: Bill = {
                    id: data.id,
                    name: data.name,
                    amount: data.amount,
                    dueDate: data.due_date,
                    category: data.category,
                    isPaid: data.is_paid,
                    status: data.is_paid ? 'paid' : (new Date(data.due_date) < new Date() ? 'overdue' : 'unpaid'),
                    recurring: 'monthly',
                    notification: 'none',
                    isRecurring: data.is_recurring,
                    reminderDaysBefore: data.reminder_days_before,
                    recurringExpenseId: data.recurring_expense_id,
                    recurringDay: data.recurring_day,
                    createdAt: data.created_at,
                    updatedAt: data.updated_at,
                };

                // Optimistic update: add to local state immediately
                setBills(prev => [...prev, newBill]);

                return newBill;
            } catch (err: unknown) {
                console.error('Error adding bill:', err);
                const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
                setError(message);
                return null;
            }
        },
        [user]
    );

    // Update an existing bill
    const updateBill = useCallback(
        async (id: string, updates: Partial<Omit<Bill, 'id' | 'createdAt'>>) => {
            if (!user) return;
            try {
                // Map updates to snake_case
                const dbUpdates: Record<string, unknown> = {};
                if (updates.name !== undefined) dbUpdates.name = updates.name;
                if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
                if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
                if (updates.category !== undefined) dbUpdates.category = updates.category;
                if (updates.isPaid !== undefined) dbUpdates.is_paid = updates.isPaid;
                if (updates.isRecurring !== undefined) dbUpdates.is_recurring = updates.isRecurring;
                if (updates.reminderDaysBefore !== undefined) dbUpdates.reminder_days_before = updates.reminderDaysBefore;

                const { error } = await supabase
                    .from('bills')
                    .update(dbUpdates)
                    .eq('id', id);

                if (error) throw error;
            } catch (err: unknown) {
                console.error('Error updating bill:', err);
                const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
                setError(message);
            }
        },
        [user]
    );

    // Delete a bill
    const deleteBill = useCallback(
        async (id: string) => {
            if (!user) return;

            // Store original for rollback
            const originalBills = bills;

            // Optimistic update: remove from local state immediately
            setBills(prev => prev.filter(b => b.id !== id));

            try {
                const { error } = await supabase
                    .from('bills')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
            } catch (err: unknown) {
                // Rollback on error
                setBills(originalBills);
                console.error('Error deleting bill:', err);
                const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
                setError(message);
            }
        },
        [user, bills]
    );

    // Mark bill as paid
    const markAsPaid = useCallback(
        async (id: string) => {
            // Add to processing
            setProcessingIds(prev => new Set(prev).add(id));

            // Optimistic update
            setBills(prev => prev.map(b => b.id === id ? { ...b, isPaid: true } : b));

            try {
                await updateBill(id, { isPaid: true });
            } catch (err) {
                // Rollback on error
                setBills(prev => prev.map(b => b.id === id ? { ...b, isPaid: false } : b));
                const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด';
                setError(message);
            } finally {
                // Remove from processing
                setProcessingIds(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
            }
        },
        [updateBill]
    );

    // Mark bill as unpaid
    const markAsUnpaid = useCallback(
        async (id: string) => {
            // Add to processing
            setProcessingIds(prev => new Set(prev).add(id));

            // Optimistic update
            setBills(prev => prev.map(b => b.id === id ? { ...b, isPaid: false } : b));

            try {
                await updateBill(id, { isPaid: false });
            } catch (err) {
                // Rollback on error
                setBills(prev => prev.map(b => b.id === id ? { ...b, isPaid: true } : b));
                const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด';
                setError(message);
            } finally {
                // Remove from processing
                setProcessingIds(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
            }
        },
        [updateBill]
    );

    // Get bills by category
    const getBillsByCategory = useCallback(
        (category: BillCategory): Bill[] => {
            return bills.filter((bill) => bill.category === category);
        },
        [bills]
    );

    // Get upcoming bills (within specified days, default 30)
    const getUpcomingBills = useCallback(
        (days = 30): Bill[] => {
            const now = new Date();
            const futureDate = new Date();
            futureDate.setDate(now.getDate() + days);

            return bills
                .filter((bill) => {
                    if (bill.isPaid) return false;
                    const dueDate = new Date(bill.dueDate);
                    return dueDate >= now && dueDate <= futureDate;
                })
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        },
        [bills]
    );

    // Get overdue bills
    const getOverdueBills = useCallback((): Bill[] => {
        const now = new Date();
        return bills
            .filter((bill) => {
                if (bill.isPaid) return false;
                const dueDate = new Date(bill.dueDate);
                return dueDate < now;
            })
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }, [bills]);

    // Get total unpaid debt
    const getTotalDebt = useCallback((): number => {
        return bills
            .filter((bill) => !bill.isPaid)
            .reduce((total, bill) => total + (bill.amount || 0), 0);
    }, [bills]);

    // Get bills sorted by due date (closest first)
    const sortedBills = useMemo(() => {
        return [...bills]
            .filter((bill) => !bill.isPaid)
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }, [bills]);

    return {
        bills,
        loading,
        error,
        processingIds,
        addBill,
        updateBill,
        deleteBill,
        markAsPaid,
        markAsUnpaid,
        getBillsByCategory,
        getUpcomingBills,
        getOverdueBills,
        getTotalDebt,
        sortedBills,
        refetch: fetchBills,
    };
}

export default useBills;
