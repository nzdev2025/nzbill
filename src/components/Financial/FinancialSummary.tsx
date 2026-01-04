import type { Bill } from '../../types';
import './FinancialSummary.css';

export interface FinancialSummaryProps {
    totalCash: number;
    bills: Bill[];
    daysUntilPayday?: number;
    onEditBalance?: () => void;
}

export function FinancialSummary({
    totalCash,
    bills,
    daysUntilPayday = 30,
    onEditBalance,
}: FinancialSummaryProps) {
    // Calculate total unpaid debt
    const totalDebt = bills
        .filter((bill) => !bill.isPaid)
        .reduce((sum, bill) => sum + bill.amount, 0);

    // Calculate remaining after bills
    const remaining = totalCash - totalDebt;

    // Calculate daily budget
    const dailyBudget = daysUntilPayday > 0
        ? Math.max(0, remaining / daysUntilPayday)
        : 0;

    // Format amount
    const formatAmount = (amount: number): string => {
        return new Intl.NumberFormat('th-TH').format(Math.round(amount));
    };

    // Get status based on finances
    const getHealthStatus = () => {
        if (remaining < 0) {
            return { status: 'danger', text: 'เงินไม่พอจ่ายบิล! 😱' };
        }
        if (dailyBudget < 100) {
            return { status: 'warning', text: 'ต้องประหยัดหน่อยนะ 😥' };
        }
        if (dailyBudget < 300) {
            return { status: 'normal', text: 'พอใช้ได้นะ 😊' };
        }
        return { status: 'good', text: 'การเงินดีมาก! 🎉' };
    };

    const health = getHealthStatus();

    return (
        <div className="financial-summary">
            <div className="financial-summary__header">
                <h2 className="financial-summary__title">สรุปการเงิน</h2>
                <span className={`financial-summary__status ${health.status}`}>
                    {health.text}
                </span>
            </div>

            {/* Total Cash */}
            <div className="summary-card summary-card--highlight" onClick={onEditBalance}>
                <div className="summary-card__label">เงินทั้งหมด</div>
                <div className="summary-card__value summary-card__value--large">
                    <span className="currency">฿</span>
                    {formatAmount(totalCash)}
                </div>
                <div className="summary-card__hint">แตะเพื่อแก้ไข</div>
            </div>

            {/* Stats Grid */}
            <div className="summary-grid">
                {/* Total Debt */}
                <div className="summary-card">
                    <div className="summary-card__label">หนี้ที่ต้องจ่าย</div>
                    <div className="summary-card__value text-danger">
                        ฿{formatAmount(totalDebt)}
                    </div>
                    <div className="summary-card__sub">
                        {bills.filter((b) => !b.isPaid).length} รายการ
                    </div>
                </div>

                {/* Remaining */}
                <div className="summary-card">
                    <div className="summary-card__label">คงเหลือหลังจ่าย</div>
                    <div className={`summary-card__value ${remaining >= 0 ? 'text-success' : 'text-danger'}`}>
                        ฿{formatAmount(remaining)}
                    </div>
                </div>

                {/* Daily Budget */}
                <div className="summary-card summary-card--full">
                    <div className="summary-card__label">ใช้ได้ต่อวัน</div>
                    <div className="summary-card__value summary-card__value--primary">
                        ฿{formatAmount(dailyBudget)}
                    </div>
                    <div className="summary-card__sub">
                        อีก {daysUntilPayday} วันถึงสิ้นเดือน
                    </div>
                </div>
            </div>

            {/* Advice */}
            {remaining < 0 && (
                <div className="summary-advice summary-advice--danger">
                    ⚠️ เงินไม่พอจ่ายบิลทั้งหมด! ต้องหาเงินเพิ่มอีก ฿{formatAmount(Math.abs(remaining))}
                </div>
            )}

            {remaining >= 0 && dailyBudget < 100 && (
                <div className="summary-advice summary-advice--warning">
                    💡 ใช้จ่ายได้เพียง ฿{formatAmount(dailyBudget)} ต่อวัน ลองลดค่าใช้จ่ายที่ไม่จำเป็นนะ
                </div>
            )}
        </div>
    );
}

export default FinancialSummary;
