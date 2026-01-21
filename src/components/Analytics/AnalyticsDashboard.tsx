import React, { useMemo, useState } from 'react';
import { useBills } from '../../hooks/useBills';
import { useAnalytics } from '../../hooks/useAnalytics';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { InsightCard } from './InsightCard';
import { SpendingTrendChart } from './SpendingTrendChart';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const AnalyticsDashboard: React.FC = () => {
    const { bills } = useBills();
    const { getMonthlyStats, getCategoryBreakdown, getSixMonthTrend } = useAnalytics(bills);
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthIndex = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const stats = useMemo(() => getMonthlyStats(monthIndex, year), [getMonthlyStats, monthIndex, year]);
    const categoryData = useMemo(() => getCategoryBreakdown(monthIndex, year), [getCategoryBreakdown, monthIndex, year]);
    const trendData = useMemo(() => getSixMonthTrend(currentDate), [getSixMonthTrend, currentDate]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, monthIndex - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, monthIndex + 1, 1));
    };

    const monthName = currentDate.toLocaleString('th-TH', { month: 'long', year: 'numeric' });

    return (
        <div className="p-4 space-y-6">
            {/* Header / Month Selector */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold">{monthName}</h2>
                <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <InsightCard title="ยอดรวม" value={stats.total} color="blue" />
                <InsightCard title="จ่ายแล้ว" value={stats.totalPaid} color="green" />
                <InsightCard title="ค้างจ่าย" value={stats.totalUnpaid} color="red" />
            </div>

            {/* Charts Area */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Category Breakdown */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm min-h-[300px]">
                    <h3 className="text-lg font-semibold mb-4">รายจ่ายตามหมวดหมู่</h3>
                    {categoryData.length > 0 ? (
                        <div style={{ width: '100%', height: 250 }} className="flex justify-center items-center">
                            <PieChart width={300} height={250}>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => [`${value.toLocaleString()} ฿`, 'ยอดเงิน']} />
                                <Legend />
                            </PieChart>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            ไม่พบข้อมูลในเดือนนี้
                        </div>
                    )}
                </div>

                {/* Monthly Trend Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm min-h-[300px]">
                    <h3 className="text-lg font-semibold mb-4">แนวโน้มรายเดือน</h3>
                    <SpendingTrendChart data={trendData} />
                </div>
            </div>
        </div>
    );
};
