import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBillBook } from './useBillBook';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

// Mock dependencies
const { mockSupabase } = vi.hoisted(() => {
  const mock = {
    from: vi.fn(),
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
    single: vi.fn(),
  } as unknown as Record<string, Mock>;

  // Helper to make chainable
  (mock.from as Mock).mockReturnValue(mock);
  (mock.select as Mock).mockReturnValue(mock);
  (mock.insert as Mock).mockReturnValue(mock);
  (mock.update as Mock).mockReturnValue(mock);
  (mock.delete as Mock).mockReturnValue(mock);
  (mock.eq as Mock).mockReturnValue(mock);
  (mock.order as Mock).mockReturnValue(mock);
  (mock.single as Mock).mockReturnValue(mock);

  return { mockSupabase: mock };
});

vi.mock('../lib/supabase', () => ({
  supabase: mockSupabase,
}));

vi.mock('./useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('useBillBook Hook', () => {
  const mockUser = { id: 'user-123' };
  const mockExpenses = [
    {
      id: '1',
      name: 'Test Expense',
      amount: 100,
      due_day: 1,
      category: 'other',
      active: true,
      is_installment: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as Mock).mockReturnValue({ user: mockUser });
    (mockSupabase.from as Mock).mockReturnValue(mockSupabase);
    (mockSupabase.select as Mock).mockReturnValue(mockSupabase);
    (mockSupabase.insert as Mock).mockReturnValue(mockSupabase);
    (mockSupabase.update as Mock).mockReturnValue(mockSupabase);
    (mockSupabase.delete as Mock).mockReturnValue(mockSupabase);
    (mockSupabase.eq as Mock).mockReturnValue(mockSupabase);
    (mockSupabase.order as Mock).mockReturnValue(mockSupabase);
    (mockSupabase.single as Mock).mockReturnValue(mockSupabase);
  });

  it('should fetch expenses on mount', async () => {
    (mockSupabase.order as Mock).mockResolvedValue({ data: mockExpenses, error: null });

    const { result } = renderHook(() => useBillBook());

    expect(result.current.loading).toBe(true);

    // Wait for the effect
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.expenses).toHaveLength(1);
    expect(result.current.expenses[0].name).toBe('Test Expense');
    expect(result.current.loading).toBe(false);
  });

  it('should add a new expense', async () => {
    const newExpenseData = {
      name: 'New Expense',
      amount: 200,
      dueDay: 15,
      category: 'electricity' as const,
      active: true,
      isInstallment: false,
    };

    const insertResult = {
      data: {
        ...newExpenseData,
        id: '2',
        due_day: 15,
        is_installment: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      error: null,
    };

    (supabase.from as Mock).mockReturnValue({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue(insertResult),
    });

    const { result } = renderHook(() => useBillBook());

    let added;
    await act(async () => {
      added = await result.current.addExpense(newExpenseData);
    });

    expect(added).not.toBeNull();
    expect(result.current.expenses).toContainEqual(expect.objectContaining({ name: 'New Expense' }));
  });

  it('should handle delete expense', async () => {
    (supabase.from as Mock).mockReturnValue({
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    const { result } = renderHook(() => useBillBook());

    await act(async () => {
      await result.current.deleteExpense('1');
    });

    expect(supabase.from).toHaveBeenCalledWith('recurring_expenses');
    // Note: Local state update check depends on initial state in hook
  });
});
