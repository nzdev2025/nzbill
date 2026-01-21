import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BillBookForm } from './BillBookForm';

describe('BillBookForm Component', () => {
    const mockOnSave = vi.fn();
    const mockOnCancel = vi.fn();

    it('renders correctly with Thai labels', () => {
        render(<BillBookForm onSave={mockOnSave} onCancel={mockOnCancel} />);

        expect(screen.getByLabelText(/ชื่อรายการ/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/จำนวนเงิน/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/จ่ายทุกวันที่/i)).toBeInTheDocument();
        expect(screen.getByText(/บันทึก/i)).toBeInTheDocument();
        expect(screen.getByText(/ยกเลิก/i)).toBeInTheDocument();
    });

    it('shows error messages for invalid input', async () => {
        render(<BillBookForm onSave={mockOnSave} onCancel={mockOnCancel} />);

        const saveButton = screen.getByText(/บันทึก/i);
        fireEvent.click(saveButton);

        expect(await screen.findByText(/กรุณากรอกชื่อรายการ/i)).toBeInTheDocument();
    });

    it('calls onSave with correct data when valid', async () => {
        render(<BillBookForm onSave={mockOnSave} onCancel={mockOnCancel} />);

        fireEvent.change(screen.getByLabelText(/ชื่อรายการ/i), { target: { value: 'ค่าเน็ต' } });
        fireEvent.change(screen.getByLabelText(/จำนวนเงิน/i), { target: { value: '500' } });

        fireEvent.click(screen.getByText(/บันทึก/i));

        expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
            name: 'ค่าเน็ต',
            amount: 500,
        }));
    });

    it('shows error when name is too long', async () => {
        render(<BillBookForm onSave={mockOnSave} onCancel={mockOnCancel} />);

        const longName = 'a'.repeat(101);
        fireEvent.change(screen.getByLabelText(/ชื่อรายการ/i), { target: { value: longName } });
        fireEvent.click(screen.getByText(/บันทึก/i));

        expect(await screen.findByText(/ชื่อรายการต้องไม่เกิน 100 ตัวอักษร/i)).toBeInTheDocument();
    });

    it('shows error when amount is too high', async () => {
        render(<BillBookForm onSave={mockOnSave} onCancel={mockOnCancel} />);

        fireEvent.change(screen.getByLabelText(/ชื่อรายการ/i), { target: { value: 'Valid Name' } });
        fireEvent.change(screen.getByLabelText(/จำนวนเงิน/i), { target: { value: '1000001' } });
        fireEvent.click(screen.getByText(/บันทึก/i));

        expect(await screen.findByText(/จำนวนเงินต้องไม่เกิน 1,000,000/i)).toBeInTheDocument();
    });

    it('shows error when amount has too many decimals', async () => {
        render(<BillBookForm onSave={mockOnSave} onCancel={mockOnCancel} />);

        fireEvent.change(screen.getByLabelText(/ชื่อรายการ/i), { target: { value: 'Valid Name' } });
        fireEvent.change(screen.getByLabelText(/จำนวนเงิน/i), { target: { value: '100.555' } });
        fireEvent.click(screen.getByText(/บันทึก/i));

        expect(await screen.findByText(/ทศนิยมต้องไม่เกิน 2 ตำแหน่ง/i)).toBeInTheDocument();
    });
});
