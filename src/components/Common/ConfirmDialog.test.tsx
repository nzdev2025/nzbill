import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog Component', () => {
    const defaultProps = {
        isOpen: true,
        title: 'ยืนยันการลบ',
        message: 'ต้องการลบรายการนี้ใช่ไหม?',
        onConfirm: vi.fn(),
        onCancel: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render title and message correctly', () => {
        render(<ConfirmDialog {...defaultProps} />);

        expect(screen.getByText('ยืนยันการลบ')).toBeInTheDocument();
        expect(screen.getByText('ต้องการลบรายการนี้ใช่ไหม?')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
        render(<ConfirmDialog {...defaultProps} isOpen={false} />);

        expect(screen.queryByText('ยืนยันการลบ')).not.toBeInTheDocument();
    });

    it('should call onConfirm when confirm button is clicked', () => {
        const onConfirm = vi.fn();
        render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

        fireEvent.click(screen.getByTestId('confirm-dialog-confirm'));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when cancel button is clicked', () => {
        const onCancel = vi.fn();
        render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

        fireEvent.click(screen.getByTestId('confirm-dialog-cancel'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when overlay is clicked', () => {
        const onCancel = vi.fn();
        render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

        fireEvent.click(screen.getByTestId('confirm-dialog-overlay'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when Escape key is pressed', () => {
        const onCancel = vi.fn();
        render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should use custom button text when provided', () => {
        render(
            <ConfirmDialog
                {...defaultProps}
                confirmText="ลบเลย"
                cancelText="ไม่ลบ"
            />
        );

        expect(screen.getByText('ลบเลย')).toBeInTheDocument();
        expect(screen.getByText('ไม่ลบ')).toBeInTheDocument();
    });

    it('should use default button text when not provided', () => {
        render(<ConfirmDialog {...defaultProps} />);

        expect(screen.getByText('ยืนยัน')).toBeInTheDocument();
        expect(screen.getByText('ยกเลิก')).toBeInTheDocument();
    });

    it('should apply danger variant style', () => {
        render(<ConfirmDialog {...defaultProps} variant="danger" />);

        const confirmButton = screen.getByTestId('confirm-dialog-confirm');
        expect(confirmButton).toHaveClass('btn-danger');
    });
});
