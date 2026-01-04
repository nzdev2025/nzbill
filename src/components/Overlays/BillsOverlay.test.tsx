import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BillsOverlay } from './BillsOverlay';
import type { Bill } from '../../types';

// Helper to create mock bills
const createMockBill = (overrides: Partial<Bill> = {}): Bill => ({
    id: `bill-${Math.random().toString(36).slice(2)}`,
    name: 'Test Bill',
    amount: 100,
    dueDate: new Date().toISOString(),
    category: 'electricity',
    isPaid: false,
    reminderDaysBefore: 3,
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
});

describe('BillsOverlay - Bill Total Summary', () => {
    const defaultProps = {
        bills: [],
        processingIds: new Set<string>(),
        onPayBill: vi.fn(),
        onEditBill: vi.fn(),
        onDeleteBill: vi.fn(),
        onMarkUnpaid: vi.fn(),
    };

    describe('Happy Path', () => {
        it('should display correct unpaid total when there are unpaid bills', () => {
            const bills = [
                createMockBill({ amount: 100, isPaid: false }),
                createMockBill({ amount: 200, isPaid: false }),
                createMockBill({ amount: 300, isPaid: false }),
            ];

            render(<BillsOverlay {...defaultProps} bills={bills} />);

            // Should display total unpaid amount
            expect(screen.getByTestId('unpaid-total')).toHaveTextContent('฿600');
        });

        it('should display correct paid total when there are paid bills', () => {
            const bills = [
                createMockBill({ amount: 150, isPaid: true }),
                createMockBill({ amount: 250, isPaid: true }),
            ];

            render(<BillsOverlay {...defaultProps} bills={bills} />);

            // Should display total paid amount
            expect(screen.getByTestId('paid-total')).toHaveTextContent('฿400');
        });

        it('should display correct grand total of all bills', () => {
            const bills = [
                createMockBill({ amount: 100, isPaid: false }),
                createMockBill({ amount: 200, isPaid: false }),
                createMockBill({ amount: 300, isPaid: false }),
                createMockBill({ amount: 150, isPaid: true }),
                createMockBill({ amount: 250, isPaid: true }),
            ];

            render(<BillsOverlay {...defaultProps} bills={bills} />);

            // Grand total = 600 + 400 = 1000
            expect(screen.getByTestId('grand-total')).toHaveTextContent('฿1,000');
        });

        it('should update totals correctly with mixed paid/unpaid bills', () => {
            const bills = [
                createMockBill({ amount: 500, isPaid: false }),
                createMockBill({ amount: 300, isPaid: true }),
            ];

            render(<BillsOverlay {...defaultProps} bills={bills} />);

            expect(screen.getByTestId('unpaid-total')).toHaveTextContent('฿500');
            expect(screen.getByTestId('paid-total')).toHaveTextContent('฿300');
            expect(screen.getByTestId('grand-total')).toHaveTextContent('฿800');
        });
    });

    describe('Edge Cases', () => {
        it('should display ฿0 for all totals when there are no bills', () => {
            render(<BillsOverlay {...defaultProps} bills={[]} />);

            expect(screen.getByTestId('unpaid-total')).toHaveTextContent('฿0');
            expect(screen.getByTestId('paid-total')).toHaveTextContent('฿0');
            expect(screen.getByTestId('grand-total')).toHaveTextContent('฿0');
        });

        it('should display ฿0 for unpaid total when all bills are paid', () => {
            const bills = [
                createMockBill({ amount: 100, isPaid: true }),
                createMockBill({ amount: 200, isPaid: true }),
            ];

            render(<BillsOverlay {...defaultProps} bills={bills} />);

            expect(screen.getByTestId('unpaid-total')).toHaveTextContent('฿0');
            expect(screen.getByTestId('paid-total')).toHaveTextContent('฿300');
        });

        it('should display ฿0 for paid total when no bills are paid', () => {
            const bills = [
                createMockBill({ amount: 100, isPaid: false }),
                createMockBill({ amount: 200, isPaid: false }),
            ];

            render(<BillsOverlay {...defaultProps} bills={bills} />);

            expect(screen.getByTestId('unpaid-total')).toHaveTextContent('฿300');
            expect(screen.getByTestId('paid-total')).toHaveTextContent('฿0');
        });

        it('should format large numbers with commas', () => {
            const bills = [
                createMockBill({ amount: 1000000, isPaid: false }),
            ];

            render(<BillsOverlay {...defaultProps} bills={bills} />);

            expect(screen.getByTestId('unpaid-total')).toHaveTextContent('฿1,000,000');
            expect(screen.getByTestId('grand-total')).toHaveTextContent('฿1,000,000');
        });
    });
});
