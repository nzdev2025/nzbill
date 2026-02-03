import { useCallback } from 'react';
import type { Bill } from '../types';

export interface MonthlyStats {
    total: number;
    totalPaid: number;
    totalUnpaid: number;
}

export interface CategoryData {
    name: string;
    value: number;
    [key: string]: string | number;
}

export const useAnalytics = (bills: Bill[]) => {

    const getMonthlyStats = useCallback((monthIndex: number, year: number): MonthlyStats => {
        const targetBills = bills.filter(b => {
            const date = new Date(b.dueDate);
            return date.getMonth() === monthIndex && date.getFullYear() === year;
        });

        return targetBills.reduce((acc, bill) => {
            const amount = bill.amount || 0;
            acc.total += amount;
            if (bill.isPaid) {
                acc.totalPaid += amount;
            } else {
                acc.totalUnpaid += amount;
            }
            return acc;
        }, { total: 0, totalPaid: 0, totalUnpaid: 0 });
    }, [bills]);

    const getCategoryBreakdown = useCallback((monthIndex: number, year: number): CategoryData[] => {
        const targetBills = bills.filter(b => {
            const date = new Date(b.dueDate);
            return date.getMonth() === monthIndex && date.getFullYear() === year;
        });

        const aggregation: Record<string, number> = {};

        targetBills.forEach(bill => {
            const category = bill.category || 'other';
            const amount = bill.amount || 0;
            aggregation[category] = (aggregation[category] || 0) + amount;
        });

        return Object.entries(aggregation).map(([name, value]) => ({
            name,
            value
        }));
    }, [bills]);

    const getSixMonthTrend = useCallback((currentDate: Date) => {
        const trend = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthIndex = d.getMonth();
            const year = d.getFullYear();
            const stats = getMonthlyStats(monthIndex, year);

            trend.push({
                name: d.toLocaleString('th-TH', { month: 'short' }),
                total: stats.total
            });
        }
        return trend;
    }, [getMonthlyStats]);

    return {
        getMonthlyStats,
        getCategoryBreakdown,
        getSixMonthTrend
    };
};
