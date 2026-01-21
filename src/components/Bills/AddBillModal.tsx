import { useState } from 'react';
import type { Bill, BillCategory } from '../../types';
import './AddBillModal.css';

import { useUI } from '../../contexts/UIContext';

// Category options
const CATEGORIES: { value: BillCategory; label: string; icon: string }[] = [
    { value: 'electricity', label: 'ค่าไฟ', icon: '⚡' },
    { value: 'water', label: 'ค่าน้ำ', icon: '💧' },
    { value: 'internet', label: 'ค่าเน็ต', icon: '📶' },
    { value: 'credit_card', label: 'บัตรเครดิต', icon: '💳' },
    { value: 'phone', label: 'ค่าโทรศัพท์', icon: '📱' },
    { value: 'rent', label: 'ค่าเช่า', icon: '🏠' },
    { value: 'insurance', label: 'ประกัน', icon: '🛡️' },
    { value: 'subscription', label: 'สมาชิก', icon: '📺' },
    { value: 'loan', label: 'สินเชื่อ', icon: '🏦' },
    { value: 'other', label: 'อื่นๆ', icon: '📋' },
];

// Helper function to get initial form state
function getInitialFormState(bill: Bill | null | undefined) {
    if (bill) {
        return {
            name: bill.name || '',
            amount: bill.amount?.toString() || '',
            dueDate: bill.dueDate
                ? new Date(bill.dueDate).toISOString().split('T')[0]
                : '',
            category: bill.category || 'other' as BillCategory,
            isRecurring: bill.isRecurring || false,
            reminderDays: bill.reminderDaysBefore?.toString() || '3',
        };
    }
    return {
        name: '',
        amount: '',
        dueDate: '',
        category: 'other' as BillCategory,
        isRecurring: false,
        reminderDays: '3',
    };
}

export interface AddBillModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => void;
    editBill?: Bill | null;
}

// Inner component that gets remounted when editBill changes via key prop
function AddBillModalInner({
    onClose,
    onSave,
    editBill
}: Omit<AddBillModalProps, 'isOpen'>) {
    // Initialize state from editBill - this works because component remounts when key changes
    const [formState, setFormState] = useState(() => getInitialFormState(editBill));
    const { showToast } = useUI();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formState.name.trim() || !formState.amount || !formState.dueDate) {
            showToast('⚠️ กรุณากรอกข้อมูลให้ครบ');
            return;
        }

        onSave({
            name: formState.name.trim(),
            amount: parseFloat(formState.amount),
            dueDate: new Date(formState.dueDate).toISOString(),
            category: formState.category,
            isPaid: editBill?.isPaid || false,
            isRecurring: formState.isRecurring,
            reminderDaysBefore: parseInt(formState.reminderDays) || 3,
        });

        // Reset handled by parent closing modal
        onClose();
    };

    const updateField = <K extends keyof typeof formState>(
        field: K,
        value: typeof formState[K]
    ) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <h2 className="modal__title">
                        {editBill ? '✏️ แก้ไขบิล' : '➕ เพิ่มบิลใหม่'}
                    </h2>
                    <button className="modal__close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="modal__form">
                    {/* Bill Name */}
                    <div className="form-group">
                        <label className="form-label">ชื่อบิล</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="เช่น ค่าไฟเดือน ม.ค."
                            value={formState.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Amount */}
                    <div className="form-group">
                        <label className="form-label">จำนวนเงิน (บาท)</label>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="0.00"
                            value={formState.amount}
                            onChange={(e) => updateField('amount', e.target.value)}
                            min="0"
                            step="0.01"
                        />
                    </div>

                    {/* Due Date */}
                    <div className="form-group">
                        <label className="form-label">วันครบกำหนด</label>
                        <input
                            type="date"
                            className="form-input"
                            value={formState.dueDate}
                            onChange={(e) => updateField('dueDate', e.target.value)}
                        />
                    </div>

                    {/* Category */}
                    <div className="form-group">
                        <label className="form-label">หมวดหมู่</label>
                        <div className="category-grid">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    className={`category-btn ${formState.category === cat.value ? 'active' : ''}`}
                                    onClick={() => updateField('category', cat.value)}
                                >
                                    <span className="category-icon">{cat.icon}</span>
                                    <span className="category-label">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reminder Days */}
                    <div className="form-group">
                        <label className="form-label">แจ้งเตือนล่วงหน้า (วัน)</label>
                        <select
                            className="form-input"
                            value={formState.reminderDays}
                            onChange={(e) => updateField('reminderDays', e.target.value)}
                        >
                            <option value="1">1 วัน</option>
                            <option value="3">3 วัน</option>
                            <option value="5">5 วัน</option>
                            <option value="7">7 วัน</option>
                        </select>
                    </div>

                    {/* Recurring Toggle */}
                    <div className="form-group form-group--row">
                        <label className="form-label">บิลประจำเดือน</label>
                        <button
                            type="button"
                            className={`toggle ${formState.isRecurring ? 'active' : ''}`}
                            onClick={() => updateField('isRecurring', !formState.isRecurring)}
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="modal__actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            ยกเลิก
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editBill ? 'บันทึก' : 'เพิ่มบิล'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Wrapper component that handles key prop for remounting
export function AddBillModal({ isOpen, onClose, onSave, editBill }: AddBillModalProps) {
    if (!isOpen) return null;

    // Use key prop to remount inner component when editBill changes
    // This ensures form state is reset properly without using useEffect
    const key = editBill?.id ?? 'new';

    return (
        <AddBillModalInner
            key={key}
            onClose={onClose}
            onSave={onSave}
            editBill={editBill}
        />
    );
}

export default AddBillModal;
