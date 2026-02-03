import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface TrendData {
    name: string;
    total: number;
}

interface SpendingTrendChartProps {
    data: TrendData[];
}

export const SpendingTrendChart = ({ data }: SpendingTrendChartProps) => {
    return (
        <div style={{ width: '100%', height: 250 }} className="flex justify-center items-center">
            <BarChart
                width={300}
                height={250}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis hide />
                <Tooltip
                    formatter={(value) => `${Number(value).toLocaleString()} ฿`}
                    cursor={{ fill: 'transparent' }}
                />
                <Legend />
                <Bar name="รายจ่าย (บาท)" dataKey="total" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
        </div>
    );
};
