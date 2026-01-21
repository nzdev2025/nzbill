import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BillBookView } from './BillBookView';
import { useBillBook } from '../../hooks/useBillBook';

// Mock the hook
vi.mock('../../hooks/useBillBook', () => ({
    useBillBook: vi.fn(),
}));

// Mock useUI
const mockShowToast = vi.fn();
const mockConfirm = vi.fn();

vi.mock('../../contexts/UIContext', () => ({
    useUI: () => ({
        showToast: mockShowToast,
        confirm: mockConfirm,
    }),
}));

describe('BillBookView Component', () => {
    const mockExpenses = [
        {
            id: '1',
            name: 'ค่าหอ',
            amount: 4500,
            dueDay: 5,
            category: 'rent',
            active: true,
            isInstallment: false,
        },
    ];

    const mockAddExpense = vi.fn();
    const mockUpdateExpense = vi.fn();
    const mockDeleteExpense = vi.fn();
    const mockToggleActive = vi.fn();
    const mockAddBill = vi.fn();
    const mockBills: never[] = [];

    beforeEach(() => {
        vi.clearAllMocks();
        (useBillBook as Mock).mockReturnValue({
            expenses: mockExpenses,
            loading: false,
            error: null,
            addExpense: mockAddExpense,
            updateExpense: mockUpdateExpense,
            deleteExpense: mockDeleteExpense,
            toggleActive: mockToggleActive,
        });
    });

    it('renders existing expenses with Thai labels', () => {
        render(<BillBookView bills={mockBills} addBill={mockAddBill} />);

        expect(screen.getByText(/ค่าหอ/)).toBeInTheDocument();
        expect(screen.getByText(/ทุกวันที่ 5/i)).toBeInTheDocument();
        expect(screen.getByText(/฿4,500/i)).toBeInTheDocument();
    });

    it('shows empty state when no expenses', () => {
        (useBillBook as Mock).mockReturnValue({
            expenses: [],
            loading: false,
            error: null,
        });

        render(<BillBookView bills={mockBills} addBill={mockAddBill} />);
        expect(screen.getByText(/ยังไม่มีรายการค่าใช้จ่ายประจำ/i)).toBeInTheDocument();
    });

    it('opens add form when clicking "+ เพิ่มรายการใหม่"', () => {
        render(<BillBookView bills={mockBills} addBill={mockAddBill} />);

        const addButton = screen.getByText(/\+ เพิ่มรายการใหม่/i);
        fireEvent.click(addButton);

        expect(screen.getByText('เพิ่มรายการใหม่')).toBeInTheDocument(); // Form header
    });

    it('calls deleteExpense when confirmed via UI context', async () => {
        // Implement confirm logic
        mockConfirm.mockImplementation(({ onConfirm }) => onConfirm());

        render(<BillBookView bills={mockBills} addBill={mockAddBill} />);

        const deleteButton = screen.getByTitle('ลบ');
        fireEvent.click(deleteButton);

        expect(mockConfirm).toHaveBeenCalled();
        expect(mockDeleteExpense).toHaveBeenCalledWith('1');

        await waitFor(() => {
            expect(mockShowToast).toHaveBeenCalledWith(expect.stringContaining('ลบรายการเรียบร้อย'));
        });
    });
});
