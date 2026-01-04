import React from 'react';
import type { Bill } from '../../types';

interface HomeBubbleProps {
    sortedBills: Bill[];
    onViewAll: () => void;
}

export const HomeBubble: React.FC<HomeBubbleProps> = ({ sortedBills, onViewAll }) => {
    const upcomingCount = sortedBills.filter(b => !b.isPaid).length;

    return (
        <div className="home-bubble">
            <h3>📋 บิลที่ใกล้ถึง</h3>
            <button
                className="home-bubble__btn"
                onClick={onViewAll}
            >
                ดูทั้งหมด
            </button>
            {sortedBills.length > 0 ? (
                <p className="home-bubble__count">
                    มี {upcomingCount} รายการ
                </p>
            ) : (
                <p className="home-bubble__empty">
                    ยังไม่มีบิลค่ะ กดปุ่ม + เพื่อเพิ่มบิลใหม่นะ
                </p>
            )}
        </div>
    );
};
