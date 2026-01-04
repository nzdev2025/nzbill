/**
 * Get current ISO date string
 */
export const getCurrentDate = (): string => {
    return new Date().toISOString();
};

/**
 * Helper function to get days until end of month
 */
export function getDaysUntilEndOfMonth(): number {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const diffTime = lastDayOfMonth.getTime() - today.getTime();
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

/**
 * Format date to Thai format (e.g. 31 ธ.ค.)
 */
export function formatDateThai(dateString: string): string {
    return new Date(dateString).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
}
