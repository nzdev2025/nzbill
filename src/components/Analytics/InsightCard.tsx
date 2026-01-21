import React from 'react';

interface InsightCardProps {
    title: string;
    value: number;
    color: 'blue' | 'green' | 'red';
}

export const InsightCard: React.FC<InsightCardProps> = ({ title, value, color }) => {
    const colorStyles = {
        blue: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            text: 'text-blue-600 dark:text-blue-400'
        },
        green: {
            bg: 'bg-green-50 dark:bg-green-900/20',
            text: 'text-green-600 dark:text-green-400'
        },
        red: {
            bg: 'bg-red-50 dark:bg-red-900/20',
            text: 'text-red-600 dark:text-red-400'
        }
    };

    const styles = colorStyles[color];

    return (
        <div className={`${styles.bg} p-4 rounded-xl`}>
            <p className={`text-sm ${styles.text}`}>{title}</p>
            <p className="text-2xl font-bold">{value.toLocaleString()} ฿</p>
        </div>
    );
};
