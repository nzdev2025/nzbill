import { useState } from 'react';
import type { RecurringExpense, BillCategory } from '../../types';
import './BillBook.css';

interface BillBookFormProps {
    initialData?: RecurringExpense | null;
    onSave: (data: Omit<RecurringExpense, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
}

const CATEGORIES: { value: BillCategory; label: string }[] = [
    { value: 'electricity', label: '⚡ ค่าไฟ' },
    { value: 'water', label: '💧 ค่าน้ำ' },
    { value: 'internet', label: '🌐 อินเทอร์เน็ต' },
    { value: 'phone', label: '📱 ค่าโทรศัพท์' },
    { value: 'credit_card', label: '💳 บัตรเครดิต' },
    { value: 'rent', label: '🏠 ค่าเช่า/ที่พัก' },
    { value: 'insurance', label: '🛡️ ประกัน' },
    { value: 'subscription', label: '📺 บริการรายเดือน (Netflix/Spotify)' },
    { value: 'loan', label: '💸 เงินกู้/ผ่อนชำระ' },
    { value: 'other', label: '✨ อื่นๆ' },
];

export const BillBookForm: React.FC<BillBookFormProps> = ({ initialData, onSave, onCancel }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
    const [dueDay, setDueDay] = useState(initialData?.dueDay || 1);
    const [category, setCategory] = useState<BillCategory>(initialData?.category || 'other');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('กรุณากรอกชื่อรายการ');
            return;
        }

        if (name.length > 100) {
            setError('ชื่อรายการต้องไม่เกิน 100 ตัวอักษร');
            return;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError('จำนวนเงินต้องมากกว่า 0');
            return;
        }

        if (parsedAmount > 1000000) {
            setError('จำนวนเงินต้องไม่เกิน 1,000,000');
            return;
        }

        // Check decimal places
        const parts = amount.split('.');
        if (parts.length > 1 && parts[1].length > 2) {
            setError('ทศนิยมต้องไม่เกิน 2 ตำแหน่ง');
            return;
        }

        onSave({
            name: name.trim(),
            amount: parsedAmount,
            dueDay,
            category,
            active: initialData?.active ?? true,
            isInstallment: initialData?.isInstallment || false,
        });
    };

    return (
        <form className="bill-book-form" onSubmit={handleSubmit}>
            {error && <div className="error-message" style={{ color: 'var(--danger-color, red)', marginBottom: '1rem' }}>{error}</div>}

            <div className="form-group">
                <label htmlFor="bill-name" className="form-label">ชื่อรายการ</label>
                <input
                    id="bill-name"
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="เช่น ค่าเน็ต, ผ่อนรถ"
                />
            </div>

            <div className="form-group">
                <label htmlFor="bill-amount" className="form-label">จำนวนเงิน (บาท)</label>
                <input
                    id="bill-amount"
                    type="number"
                    className="form-input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="any"
                />
            </div>

            <div className="form-group">
                <label htmlFor="bill-due-day" className="form-label">จ่ายทุกวันที่</label>
                <select
                    id="bill-due-day"
                    className="form-select"
                    value={dueDay}
                    onChange={(e) => setDueDay(parseInt(e.target.value))}
                >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day}>
                            วันที่ {day}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="bill-category" className="form-label">หมวดหมู่</label>
                <select
                    id="bill-category"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BillCategory)}
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary">
                    บันทึก
                </button>
            </div>
        </form>
    );
};
