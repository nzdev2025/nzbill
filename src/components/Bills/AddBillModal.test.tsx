import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AddBillModal from './AddBillModal';

// Mock useUI
const mockShowToast = vi.fn();
const mockConfirm = vi.fn();

vi.mock('../../contexts/UIContext', () => ({
    useUI: () => ({
        showToast: mockShowToast,
        confirm: mockConfirm,
    }),
}));

describe('AddBillModal Component', () => {
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();

    it('renders correctly when open', () => {
        render(
            <AddBillModal
                isOpen={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        expect(screen.getByText('➕ เพิ่มบิลใหม่')).toBeInTheDocument();
        expect(screen.getByText('ชื่อบิล')).toBeInTheDocument();
    });

    it('shows toast when submitting empty form', () => {
        render(
            <AddBillModal
                isOpen={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        // Click save directly without filling form
        fireEvent.click(screen.getByText('เพิ่มบิล'));

        expect(mockShowToast).toHaveBeenCalledWith('⚠️ กรุณากรอกข้อมูลให้ครบ');
        expect(mockOnSave).not.toHaveBeenCalled();
    });
});
