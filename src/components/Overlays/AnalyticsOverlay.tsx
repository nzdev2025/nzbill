import React, { useMemo } from 'react';
import type { Bill, BillCategory } from '../../types';
import './AnalyticsOverlay.css';

interface AnalyticsOverlayProps {
    bills: Bill[];
}

// Category display names and colors
const categoryConfig: Record<BillCategory, { name: string; color: string; icon: string }> = {
    electricity: { name: 'ค่าไฟ', color: '#F1C40F', icon: '⚡' },
    water: { name: 'ค่าน้ำ', color: '#3498DB', icon: '💧' },
    internet: { name: 'อินเทอร์เน็ต', color: '#9B59B6', icon: '🌐' },
    credit_card: { name: 'บัตรเครดิต', color: '#E74C3C', icon: '💳' },
    phone: { name: 'ค่าโทรศัพท์', color: '#2ECC71', icon: '📱' },
    rent: { name: 'ค่าเช่า', color: '#E67E22', icon: '🏠' },
    insurance: { name: 'ประกัน', color: '#1ABC9C', icon: '🛡️' },
    subscription: { name: 'สมัครสมาชิก', color: '#34495E', icon: '📺' },
    loan: { name: 'เงินกู้', color: '#C0392B', icon: '💰' },
    other: { name: 'อื่นๆ', color: '#95A5A6', icon: '📋' },
};

export const AnalyticsOverlay: React.FC<AnalyticsOverlayProps> = ({ bills }) => {
    // Calculate analytics
    const analytics = useMemo(() => {
        const total = bills.reduce((sum, b) => sum + b.amount, 0);
        const paidTotal = bills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0);
        const unpaidTotal = bills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.amount, 0);

        // Group by category
        const byCategory = bills.reduce((acc, bill) => {
            if (!acc[bill.category]) {
                acc[bill.category] = 0;
            }
            acc[bill.category] += bill.amount;
            return acc;
        }, {} as Record<BillCategory, number>);

        // Sort categories by amount
        const sortedCategories = Object.entries(byCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => ({
                category: category as BillCategory,
                amount,
                percentage: total > 0 ? (amount / total) * 100 : 0,
                ...categoryConfig[category as BillCategory],
            }));

        return {
            total,
            paidTotal,
            unpaidTotal,
            paidCount: bills.filter(b => b.isPaid).length,
            unpaidCount: bills.filter(b => !b.isPaid).length,
            byCategory: sortedCategories,
        };
    }, [bills]);

    if (bills.length === 0) {
        return (
            <div className="overlay-panel">
                <div className="overlay-tabs">
                    <button className="overlay-tab active">สถิติ</button>
                </div>
                <div className="overlay-content analytics-empty">
                    <div className="analytics-empty__icon">📊</div>
                    <p className="analytics-empty__text">ยังไม่มีข้อมูล</p>
                    <p className="analytics-empty__subtext">
                        เริ่มเพิ่มบิลเพื่อดูสถิติการใช้จ่าย
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="overlay-panel">
            <div className="overlay-tabs">
                <button className="overlay-tab active">สถิติการใช้จ่าย</button>
            </div>
            <div className="overlay-content">
                {/* Summary Cards */}
                <div className="analytics-summary">
                    <div className="analytics-card analytics-card--total">
                        <span className="analytics-card__label">รวมทั้งหมด</span>
                        <span className="analytics-card__value">
                            ฿{analytics.total.toLocaleString()}
                        </span>
                    </div>
                    <div className="analytics-row">
                        <div className="analytics-card analytics-card--paid">
                            <span className="analytics-card__label">จ่ายแล้ว</span>
                            <span
                                className="analytics-card__value"
                                data-testid="paid-amount"
                            >
                                ฿{analytics.paidTotal.toLocaleString()}
                            </span>
                            <span className="analytics-card__count">
                                {analytics.paidCount} รายการ
                            </span>
                        </div>
                        <div className="analytics-card analytics-card--unpaid">
                            <span className="analytics-card__label">ค้างจ่าย</span>
                            <span
                                className="analytics-card__value"
                                data-testid="unpaid-amount"
                            >
                                ฿{analytics.unpaidTotal.toLocaleString()}
                            </span>
                            <span className="analytics-card__count">
                                {analytics.unpaidCount} รายการ
                            </span>
                        </div>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="analytics-section">
                    <h3 className="analytics-section__title">
                        📊 แยกตามหมวดหมู่
                    </h3>
                    <div className="analytics-categories">
                        {analytics.byCategory.map(({ category, name, amount, percentage, color, icon }) => (
                            <div key={category} className="analytics-category">
                                <div className="analytics-category__header">
                                    <span className="analytics-category__icon">{icon}</span>
                                    <span className="analytics-category__name">{name}</span>
                                    <span className="analytics-category__amount">
                                        ฿{amount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="analytics-category__bar">
                                    <div
                                        className="analytics-category__progress"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: color,
                                        }}
                                    />
                                </div>
                                <span className="analytics-category__percent">
                                    {percentage.toFixed(1)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsOverlay;
