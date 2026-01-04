import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnalyticsOverlay } from './AnalyticsOverlay';
import type { Bill } from '../../types';

// Mock bills data
const mockBills: Bill[] = [
    {
        id: '1',
        name: 'ค่าไฟ',
        amount: 1500,
        dueDate: '2026-01-15',
        category: 'electricity',
        isPaid: true,
        reminderDaysBefore: 3,
        isRecurring: false,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
    },
    {
        id: '2',
        name: 'ค่าน้ำ',
        amount: 300,
        dueDate: '2026-01-10',
        category: 'water',
        isPaid: true,
        reminderDaysBefore: 3,
        isRecurring: false,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
    },
    {
        id: '3',
        name: 'ค่าเน็ต',
        amount: 599,
        dueDate: '2026-01-20',
        category: 'internet',
        isPaid: false,
        reminderDaysBefore: 3,
        isRecurring: false,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
    },
];

describe('AnalyticsOverlay Component', () => {
    it('should render the analytics title', () => {
        render(<AnalyticsOverlay bills={mockBills} />);
        expect(screen.getByText(/สถิติ/i)).toBeInTheDocument();
    });

    it('should calculate correct total amount', () => {
        render(<AnalyticsOverlay bills={mockBills} />);
        // Total: 1500 + 300 + 599 = 2399
        expect(screen.getByText(/2,399/)).toBeInTheDocument();
    });

    it('should show expenses by category', () => {
        render(<AnalyticsOverlay bills={mockBills} />);
        expect(screen.getByText(/ค่าไฟ/)).toBeInTheDocument();
        expect(screen.getByText(/1,500/)).toBeInTheDocument();
    });

    it('should display empty state when no bills', () => {
        render(<AnalyticsOverlay bills={[]} />);
        expect(screen.getByText(/ยังไม่มีข้อมูล/i)).toBeInTheDocument();
    });

    it('should show paid vs unpaid breakdown', () => {
        render(<AnalyticsOverlay bills={mockBills} />);
        expect(screen.getByTestId('paid-amount')).toBeInTheDocument();
        expect(screen.getByTestId('unpaid-amount')).toBeInTheDocument();
    });
});
