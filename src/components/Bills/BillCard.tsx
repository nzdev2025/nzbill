import { useState } from 'react';
import type { Bill, BillCategory } from '../../types';
import './BillCard.css';

// Category icons
const CATEGORY_ICONS: Record<BillCategory, string> = {
    electricity: '⚡',
    water: '💧',
    internet: '📶',
    credit_card: '💳',
    phone: '📱',
    rent: '🏠',
    insurance: '🛡️',
    subscription: '📺',
    loan: '🏦',
    other: '📋',
};

// Category labels (Thai)
const CATEGORY_LABELS: Record<BillCategory, string> = {
    electricity: 'ค่าไฟ',
    water: 'ค่าน้ำ',
    internet: 'ค่าเน็ต',
    credit_card: 'บัตรเครดิต',
    phone: 'ค่าโทรศัพท์',
    rent: 'ค่าเช่า',
    insurance: 'ประกัน',
    subscription: 'สมาชิก',
    loan: 'สินเชื่อ',
    other: 'อื่นๆ',
};

export interface BillCardProps {
    bill: Bill;
    onPay?: (bill: Bill) => void;
    onEdit?: (bill: Bill) => void;
    onDelete?: (bill: Bill) => void;
    onNotify?: (bill: Bill) => void;
}

export function BillCard({ bill, onPay, onEdit, onDelete, onNotify }: BillCardProps) {
    const [showActions, setShowActions] = useState(false);

    // Calculate days until due
    const getDaysUntilDue = (): number => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(bill.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        const diffTime = dueDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const daysUntilDue = getDaysUntilDue();
    const isOverdue = daysUntilDue < 0 && !bill.isPaid;
    const isUrgent = daysUntilDue <= 3 && daysUntilDue >= 0 && !bill.isPaid;

    // Format date
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
        });
    };

    // Format amount
    const formatAmount = (amount: number): string => {
        return new Intl.NumberFormat('th-TH').format(amount);
    };

    // Get status text
    const getStatusText = (): string => {
        if (bill.isPaid) return 'จ่ายแล้ว';
        if (isOverdue) return `เกินกำหนด ${Math.abs(daysUntilDue)} วัน`;
        if (daysUntilDue === 0) return 'ครบกำหนดวันนี้!';
        if (daysUntilDue === 1) return 'ครบกำหนดพรุ่งนี้';
        return `อีก ${daysUntilDue} วัน`;
    };

    // Card classes
    const cardClasses = [
        'bill-card',
        bill.isPaid ? 'bill-card--paid' : '',
        isOverdue ? 'bill-card--overdue' : '',
        isUrgent ? 'bill-card--urgent' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={cardClasses}
            onClick={() => setShowActions(!showActions)}
        >
            {/* Category Icon */}
            <div className="bill-card__icon">
                {CATEGORY_ICONS[bill.category]}
            </div>

            {/* Bill Info */}
            <div className="bill-card__info">
                <h3 className="bill-card__name">{bill.name}</h3>
                <p className="bill-card__category">{CATEGORY_LABELS[bill.category]}</p>
                <p className="bill-card__date">
                    <span className="bill-card__date-label">ครบกำหนด:</span>
                    <span className="bill-card__date-value">{formatDate(bill.dueDate)}</span>
                    <span className={`bill-card__status ${isOverdue ? 'danger' : isUrgent ? 'warning' : ''}`}>
                        ({getStatusText()})
                    </span>
                </p>
            </div>

            {/* Amount */}
            <div className="bill-card__amount-section">
                <span className="bill-card__amount">฿{formatAmount(bill.amount)}</span>
                {!bill.isPaid && (
                    <button
                        className="bill-card__notify-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onNotify?.(bill);
                        }}
                    >
                        🔔
                    </button>
                )}
            </div>

            {/* Actions (shown on click) */}
            {showActions && (
                <div className="bill-card__actions">
                    {!bill.isPaid && (
                        <button
                            className="bill-card__action bill-card__action--pay"
                            onClick={(e) => {
                                e.stopPropagation();
                                onPay?.(bill);
                            }}
                        >
                            ✓ จ่ายแล้ว
                        </button>
                    )}
                    <button
                        className="bill-card__action bill-card__action--edit"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(bill);
                        }}
                    >
                        ✏️ แก้ไข
                    </button>
                    <button
                        className="bill-card__action bill-card__action--delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(bill);
                        }}
                    >
                        🗑️ ลบ
                    </button>
                </div>
            )}
        </div>
    );
}

export default BillCard;
