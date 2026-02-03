import { useState } from 'react';
import type { Bill } from '../../types';
import { formatDateThai } from '../../utils/date';

interface BillsOverlayProps {
    bills: Bill[];
    processingIds: Set<string>;
    onPayBill: (bill: Bill) => void;
    onEditBill: (bill: Bill) => void;
    onDeleteBill: (bill: Bill) => void;
    onMarkUnpaid: (bill: Bill) => void;
}

type TabType = 'unpaid' | 'paid';

export const BillsOverlay: React.FC<BillsOverlayProps> = ({
    bills,
    processingIds,
    onPayBill,
    onEditBill,
    onDeleteBill,
    onMarkUnpaid,
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('unpaid');

    // Filter bills based on active tab
    const filteredBills = bills.filter(bill =>
        activeTab === 'unpaid' ? !bill.isPaid : bill.isPaid
    ).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const unpaidCount = bills.filter(b => !b.isPaid).length;
    const paidCount = bills.filter(b => b.isPaid).length;

    // Calculate totals for summary
    const unpaidTotal = bills
        .filter(b => !b.isPaid)
        .reduce((sum, b) => sum + b.amount, 0);
    const paidTotal = bills
        .filter(b => b.isPaid)
        .reduce((sum, b) => sum + b.amount, 0);
    const grandTotal = unpaidTotal + paidTotal;

    return (
        <div className="overlay-panel">
            {/* Summary Section */}
            <div className="bills-summary">
                <div className="bills-summary__item bills-summary__item--unpaid">
                    <span className="bills-summary__label">ค้างจ่าย</span>
                    <span className="bills-summary__amount" data-testid="unpaid-total">
                        ฿{unpaidTotal.toLocaleString()}
                    </span>
                </div>
                <div className="bills-summary__item bills-summary__item--paid">
                    <span className="bills-summary__label">จ่ายแล้ว</span>
                    <span className="bills-summary__amount" data-testid="paid-total">
                        ฿{paidTotal.toLocaleString()}
                    </span>
                </div>
                <div className="bills-summary__item bills-summary__item--total">
                    <span className="bills-summary__label">รวมทั้งหมด</span>
                    <span className="bills-summary__amount" data-testid="grand-total">
                        ฿{grandTotal.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="overlay-tabs">
                <button
                    className={`overlay-tab ${activeTab === 'unpaid' ? 'active' : ''}`}
                    onClick={() => setActiveTab('unpaid')}
                >
                    ค้างจ่าย {unpaidCount > 0 && <span className="tab-badge">{unpaidCount}</span>}
                </button>
                <button
                    className={`overlay-tab ${activeTab === 'paid' ? 'active' : ''}`}
                    onClick={() => setActiveTab('paid')}
                >
                    จ่ายแล้ว {paidCount > 0 && <span className="tab-badge tab-badge--success">{paidCount}</span>}
                </button>
            </div>
            <div className="overlay-content">
                {filteredBills.length > 0 ? (
                    <div className="bills-scroll">
                        {filteredBills.map((bill, index) => {
                            const isProcessing = processingIds.has(bill.id);
                            return (
                                <div key={bill.id} className={`bill-bubble ${bill.isPaid ? 'bill-bubble--paid' : ''} ${isProcessing ? 'bill-bubble--processing' : ''}`}>
                                    <div className="bill-bubble__info">
                                        <span className="bill-bubble__name">{index + 1}. {bill.name}</span>
                                        <span className="bill-bubble__amount">฿{bill.amount.toLocaleString()}</span>
                                    </div>
                                    <div className="bill-bubble__date">
                                        ({formatDateThai(bill.dueDate)})
                                    </div>
                                    <div className="bill-bubble__actions">
                                        {!bill.isPaid ? (
                                            <button
                                                className="bill-bubble__action-btn bill-bubble__action-btn--pay"
                                                onClick={() => onPayBill(bill)}
                                                disabled={isProcessing}
                                                aria-label="จ่ายบิล"
                                                data-testid={`pay-bill-${bill.id}`}
                                            >
                                                {isProcessing ? '...' : '✓'}
                                            </button>
                                        ) : (
                                            <button
                                                className="bill-bubble__action-btn bill-bubble__action-btn--undo"
                                                onClick={() => onMarkUnpaid(bill)}
                                                disabled={isProcessing}
                                                aria-label="ยกเลิกการจ่าย"
                                                data-testid={`undo-bill-${bill.id}`}
                                            >
                                                {isProcessing ? '...' : '↩'}
                                            </button>
                                        )}
                                        <button
                                            className="bill-bubble__action-btn bill-bubble__action-btn--edit"
                                            onClick={() => onEditBill(bill)}
                                            disabled={isProcessing}
                                            aria-label="แก้ไขบิล"
                                            data-testid={`edit-bill-${bill.id}`}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="bill-bubble__action-btn bill-bubble__action-btn--delete"
                                            onClick={() => onDeleteBill(bill)}
                                            disabled={isProcessing}
                                            aria-label="ลบบิล"
                                            data-testid={`delete-bill-${bill.id}`}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="overlay-empty">
                        <p>{activeTab === 'unpaid' ? 'ไม่มีบิลค้างจ่าย 🎉' : 'ยังไม่มีบิลที่จ่ายแล้ว'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BillsOverlay;
