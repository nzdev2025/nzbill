import React from 'react';

interface PlannerOverlayProps {
    totalCash: number;
    totalDebt: number;
    dailyBudget: number;
}

export const PlannerOverlay: React.FC<PlannerOverlayProps> = ({ totalCash, totalDebt, dailyBudget }) => {
    return (
        <div className="overlay-panel">
            <div className="overlay-tabs">
                <button className="overlay-tab">สรุปยอด</button>
                <button className="overlay-tab active">Debt Planner</button>
            </div>
            <div className="overlay-content">
                <div className="financial-card">
                    <h3 className="financial-card__title">Financial Health</h3>
                    <div className="financial-card__main">
                        <span className="financial-card__label">Total cash:</span>
                        <span className="financial-card__value">฿{totalCash.toLocaleString()}</span>
                    </div>
                </div>
                <div className="financial-bubbles">
                    <div className="financial-bubble">
                        <span className="financial-bubble__label">ใช้ได้ต่อวัน:</span>
                        <span className="financial-bubble__value">฿{Math.round(dailyBudget).toLocaleString()}</span>
                    </div>
                    <div className="financial-bubble financial-bubble--danger">
                        <span className="financial-bubble__label">หนี้ทั้งหมด:</span>
                        <span className="financial-bubble__value">฿{totalDebt.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
