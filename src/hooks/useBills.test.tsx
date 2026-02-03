import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useBills from './useBills';

// Mock Supabase
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockSingle = vi.fn();

// Chain mock setup
mockSelect.mockReturnValue({ order: mockOrder });
mockOrder.mockReturnValue({ data: [], error: null });
mockInsert.mockReturnValue({ select: () => ({ single: mockSingle }) });
mockUpdate.mockReturnValue({ eq: mockEq });
mockDelete.mockReturnValue({ eq: mockEq });
mockEq.mockReturnValue({ error: null });

vi.mock('../lib/supabase', () => ({
    supabase: {
        from: () => ({
            select: mockSelect,
            insert: mockInsert,
            update: mockUpdate,
            delete: mockDelete,
        }),
        channel: () => ({
            on: () => ({
                subscribe: () => ({})
            })
        }),
        removeChannel: vi.fn(),
    }
}));

// Mock useAuth
const mockUser = { id: 'test-user-id' };
vi.mock('./useAuth', () => ({
    useAuth: () => ({
        user: mockUser
    })
}));

describe('useBills Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Reset default mock behaviors
        mockSelect.mockReturnValue({ order: mockOrder });
        mockOrder.mockReturnValue({ data: [], error: null });
        mockSingle.mockReturnValue({ data: {}, error: null });
    });

    const mockBillData = {
        name: 'Test Bill',
        amount: 1000,
        dueDate: new Date().toISOString(),
        category: 'electricity' as const,
        status: 'unpaid' as const,
        isPaid: false,
        recurring: 'monthly' as const,
        notification: 'none' as const,
        reminderDaysBefore: 3,
        isRecurring: false,
    };

    const mockDBBill = {
        id: 'bill-123',
        name: 'Test Bill',
        amount: 1000,
        due_date: mockBillData.dueDate,
        category: 'electricity',
        is_paid: false,
        reminder_days_before: 3,
        is_recurring: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    it('should fetch bills on mount', async () => {
        mockOrder.mockReturnValueOnce({ data: [mockDBBill], error: null });

        const { result } = renderHook(() => useBills());

        // Initial state
        expect(result.current.loading).toBe(true);

        // Wait for effect
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.bills).toHaveLength(1);
        expect(result.current.bills[0].name).toBe('Test Bill');
        expect(mockSelect).toHaveBeenCalled();
    });

    it('should add a bill successfully', async () => {
        mockSingle.mockReturnValueOnce({ data: mockDBBill, error: null });

        const { result } = renderHook(() => useBills());

        await waitFor(() => expect(result.current.loading).toBe(false));

        let newBill: { id: string } | null | undefined;
        await act(async () => {
            newBill = await result.current.addBill(mockBillData);
        });

        expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
            name: mockBillData.name,
            amount: mockBillData.amount,
            user_id: mockUser.id
        }));

        expect(newBill).toBeDefined();
        expect(newBill?.id).toBe(mockDBBill.id);
    });

    it('should update a bill successfully', async () => {
        const { result } = renderHook(() => useBills());
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.updateBill('bill-123', { amount: 2000 });
        });

        expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
            amount: 2000
        }));
        expect(mockEq).toHaveBeenCalledWith('id', 'bill-123');
    });

    it('should delete a bill successfully', async () => {
        const { result } = renderHook(() => useBills());
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.deleteBill('bill-123');
        });

        expect(mockDelete).toHaveBeenCalled();
        expect(mockEq).toHaveBeenCalledWith('id', 'bill-123');
    });

    it('should calculate total debt correctly', async () => {
        // Mock 2 bills
        const bill1 = { ...mockDBBill, id: '1', amount: 1000 };
        const bill2 = { ...mockDBBill, id: '2', amount: 500 };
        mockOrder.mockReturnValueOnce({ data: [bill1, bill2], error: null });

        const { result } = renderHook(() => useBills());
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.getTotalDebt()).toBe(1500);
    });
});
