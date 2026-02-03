import type { Bill } from '../types';

/**
 * ดึงรายการบิลที่จ่ายแล้วจากเดือนก่อนๆ ที่ควรถูกลบออก
 * @param bills รายการบิลทั้งหมด
 * @param currentDate วันที่ปัจจุบัน (สำหรับ testing)
 * @returns รายการบิลที่จ่ายแล้วและ dueDate อยู่ก่อนเดือนปัจจุบัน
 */
export function getPaidBillsFromPreviousMonths(
    bills: Bill[],
    currentDate: Date = new Date()
): Bill[] {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return bills.filter((bill) => {
        // ต้องจ่ายแล้ว
        if (!bill.isPaid) return false;

        // เช็คว่า dueDate อยู่ก่อนเดือนปัจจุบัน
        const dueDate = new Date(bill.dueDate);
        const dueMonth = dueDate.getMonth();
        const dueYear = dueDate.getFullYear();

        // ถ้าปีเก่ากว่า → ควรลบ
        if (dueYear < currentYear) return true;

        // ถ้าปีเดียวกันแต่เดือนก่อนหน้า → ควรลบ
        if (dueYear === currentYear && dueMonth < currentMonth) return true;

        return false;
    });
}
