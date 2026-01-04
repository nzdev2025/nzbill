import { createContext, useState, useCallback, type ReactNode } from 'react';

export type Language = 'th' | 'en';

// Thai translations
const th = {
    common: {
        loading: 'กำลังโหลด...',
        save: 'บันทึก',
        cancel: 'ยกเลิก',
        delete: 'ลบ',
        edit: 'แก้ไข',
        add: 'เพิ่ม',
        confirm: 'ยืนยัน',
        back: 'กลับ',
        close: 'ปิด',
        error: 'เกิดข้อผิดพลาด',
        success: 'สำเร็จ',
        yes: 'ใช่',
        no: 'ไม่',
    },
    nav: {
        home: 'หน้าแรก',
        bills: 'บิล',
        planner: 'วางแผน',
        settings: 'ตั้งค่า',
        billBook: 'สมุดบัญชี',
    },
    bills: {
        title: 'รายการบิล',
        unpaid: 'ค้างจ่าย',
        paid: 'จ่ายแล้ว',
        addBill: 'เพิ่มบิล',
        billName: 'ชื่อบิล',
        amount: 'จำนวนเงิน',
        dueDate: 'วันครบกำหนด',
        category: 'หมวดหมู่',
        markAsPaid: 'จ่ายแล้ว',
        markAsUnpaid: 'ยังไม่จ่าย',
        totalUnpaid: 'ยอดค้างจ่ายทั้งหมด',
        totalPaid: 'ยอดจ่ายแล้วทั้งหมด',
        total: 'รวมทั้งหมด',
        noBills: 'ไม่มีรายการบิล',
        confirmDelete: 'ต้องการลบบิลนี้หรือไม่?',
    },
    billBook: {
        title: 'สมุดบัญชี',
        addNew: 'เพิ่มรายการใหม่',
        recurringExpenses: 'ค่าใช้จ่ายประจำ',
        dueDay: 'วันที่ครบกำหนด',
        everyMonth: 'ทุกเดือน',
        active: 'ใช้งาน',
        inactive: 'ปิดใช้งาน',
        noExpenses: 'ยังไม่มีรายการค่าใช้จ่ายประจำ',
    },
    planner: {
        title: 'Debt Planner',
        summary: 'สรุปยอด',
        totalCash: 'เงินสด',
        totalDebt: 'หนี้ทั้งหมด',
        dailyBudget: 'ใช้ได้ต่อวัน',
        financialHealth: 'สุขภาพการเงิน',
    },
    settings: {
        title: 'ตั้งค่า',
        sound: 'เสียง',
        notifications: 'การแจ้งเตือน',
        language: 'ภาษา',
        theme: 'ธีม',
        themeLight: 'สว่าง',
        themeDark: 'มืด',
        themeAuto: 'อัตโนมัติ',
        financial: 'ข้อมูลการเงิน',
        editBalance: 'แก้ไขยอดเงิน',
        logout: 'ออกจากระบบ',
    },
    categories: {
        electricity: 'ค่าไฟ',
        water: 'ค่าน้ำ',
        internet: 'อินเทอร์เน็ต',
        credit_card: 'บัตรเครดิต',
        phone: 'ค่าโทรศัพท์',
        rent: 'ค่าเช่า',
        insurance: 'ประกัน',
        subscription: 'สมัครสมาชิก',
        loan: 'เงินกู้',
        other: 'อื่นๆ',
    },
    character: {
        name: 'น้องเมย์',
        greeting: 'สวัสดีค่ะ!',
        loading: 'น้องเมย์กำลังเตรียมข้อมูลให้นะคะ~',
    },
    analytics: {
        title: 'สถิติการใช้จ่าย',
        monthly: 'รายเดือน',
        byCategory: 'ตามหมวดหมู่',
        trend: 'แนวโน้ม',
        noData: 'ยังไม่มีข้อมูล',
    },
};

// English translations
const en: typeof th = {
    common: {
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        confirm: 'Confirm',
        back: 'Back',
        close: 'Close',
        error: 'Error occurred',
        success: 'Success',
        yes: 'Yes',
        no: 'No',
    },
    nav: {
        home: 'Home',
        bills: 'Bills',
        planner: 'Planner',
        settings: 'Settings',
        billBook: 'Bill Book',
    },
    bills: {
        title: 'Bills',
        unpaid: 'Unpaid',
        paid: 'Paid',
        addBill: 'Add Bill',
        billName: 'Bill Name',
        amount: 'Amount',
        dueDate: 'Due Date',
        category: 'Category',
        markAsPaid: 'Mark as Paid',
        markAsUnpaid: 'Mark as Unpaid',
        totalUnpaid: 'Total Unpaid',
        totalPaid: 'Total Paid',
        total: 'Total',
        noBills: 'No bills',
        confirmDelete: 'Delete this bill?',
    },
    billBook: {
        title: 'Bill Book',
        addNew: 'Add New',
        recurringExpenses: 'Recurring Expenses',
        dueDay: 'Due Day',
        everyMonth: 'Every month',
        active: 'Active',
        inactive: 'Inactive',
        noExpenses: 'No recurring expenses yet',
    },
    planner: {
        title: 'Debt Planner',
        summary: 'Summary',
        totalCash: 'Total Cash',
        totalDebt: 'Total Debt',
        dailyBudget: 'Daily Budget',
        financialHealth: 'Financial Health',
    },
    settings: {
        title: 'Settings',
        sound: 'Sound',
        notifications: 'Notifications',
        language: 'Language',
        theme: 'Theme',
        themeLight: 'Light',
        themeDark: 'Dark',
        themeAuto: 'Auto',
        financial: 'Financial Data',
        editBalance: 'Edit Balance',
        logout: 'Logout',
    },
    categories: {
        electricity: 'Electricity',
        water: 'Water',
        internet: 'Internet',
        credit_card: 'Credit Card',
        phone: 'Phone',
        rent: 'Rent',
        insurance: 'Insurance',
        subscription: 'Subscription',
        loan: 'Loan',
        other: 'Other',
    },
    character: {
        name: 'May',
        greeting: 'Hello!',
        loading: 'May is preparing your data~',
    },
    analytics: {
        title: 'Spending Analytics',
        monthly: 'Monthly',
        byCategory: 'By Category',
        trend: 'Trend',
        noData: 'No data yet',
    },
};

const translations = { th, en };

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = 'nzbill_language';

export function I18nProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return (saved as Language) || 'th';
    });

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem(STORAGE_KEY, lang);
    }, []);

    // Translation function with dot notation support
    const t = useCallback((key: string): string => {
        const keys = key.split('.');
        let value: unknown = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = (value as Record<string, unknown>)[k];
            } else {
                return key; // Fallback to key if not found
            }
        }

        return typeof value === 'string' ? value : key;
    }, [language]);

    return (
        <I18nContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
}

// Re-export hook from separate file
export { useTranslation } from './useTranslation';

