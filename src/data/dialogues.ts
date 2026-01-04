// Dialog data for น้องเมย์ (May)
import type { DialogLine, CharacterExpression } from '../types';

// Greeting dialogs
export const GREETING_DIALOGS: DialogLine[] = [
    { id: 'g1', text: 'สวัสดีค่ะ! ยินดีต้อนรับกลับมา~', expression: 'happy' },
    { id: 'g2', text: 'วันนี้มีบิลอะไรต้องจ่ายบ้างมาดูกันนะคะ!', expression: 'excited' },
];

export const MORNING_GREETINGS: DialogLine[] = [
    { id: 'mg1', text: 'อรุณสวัสดิ์ค่ะ! ตื่นแล้วมาเช็คบิลกันเถอะ~', expression: 'happy' },
    { id: 'mg2', text: 'เช้านี้อากาศดีจังเลย มาดูการเงินกันนะคะ!', expression: 'excited' },
];

export const AFTERNOON_GREETINGS: DialogLine[] = [
    { id: 'ag1', text: 'สวัสดีตอนบ่ายค่ะ! พักผ่อนบ้างนะคะ~', expression: 'idle' },
    { id: 'ag2', text: 'บ่ายนี้เหนื่อยไหมคะ? มาดูสถานะการเงินกันเถอะ', expression: 'happy' },
];

export const EVENING_GREETINGS: DialogLine[] = [
    { id: 'eg1', text: 'สวัสดีตอนเย็นค่ะ~ เหนื่อยมาทั้งวันเลยใช่ไหม', expression: 'idle' },
    { id: 'eg2', text: 'ใกล้จะหมดวันแล้ว มาเช็คยอดกันก่อนนอนนะคะ', expression: 'happy' },
];

// Bill reminder dialogs
export const BILL_REMINDER_URGENT: DialogLine[] = [
    { id: 'br1', text: 'อ๊ะ! มีบิลใกล้ถึงกำหนดแล้วนะคะ!', expression: 'worried' },
    { id: 'br2', text: 'อย่าลืมจ่ายด้วยนะ ไม่งั้นจะมีค่าปรับ~', expression: 'thinking' },
];

export const BILL_REMINDER_OVERDUE: DialogLine[] = [
    { id: 'bo1', text: 'ไม่นะ! มีบิลเกินกำหนดแล้วค่ะ!! 😱', expression: 'worried' },
    { id: 'bo2', text: 'รีบไปจ่ายเลยนะคะ ก่อนจะโดนค่าปรับเพิ่ม!', expression: 'angry' },
];

export const BILL_PAID_SUCCESS: DialogLine[] = [
    { id: 'bp1', text: 'เก่งมากเลยค่ะ! จ่ายบิลเรียบร้อยแล้ว~ 🎉', expression: 'excited' },
    { id: 'bp2', text: 'ภูมิใจในตัวคุณมากเลย! ต่อไปเรื่อยนะคะ', expression: 'happy' },
];

// Financial advice dialogs
export const MONEY_LOW: DialogLine[] = [
    { id: 'ml1', text: 'อืม... เงินเหลือน้อยลงแล้วนะคะ', expression: 'worried' },
    { id: 'ml2', text: 'ลองลดค่าใช้จ่ายที่ไม่จำเป็นดูไหมคะ?', expression: 'thinking' },
];

export const MONEY_VERY_LOW: DialogLine[] = [
    { id: 'mvl1', text: 'ต้องระวังแล้วนะคะ เงินเหลือน้อยมาก!', expression: 'worried' },
    { id: 'mvl2', text: 'ใช้จ่ายเท่าที่จำเป็นจริงๆ นะคะ~', expression: 'thinking' },
];

export const MONEY_GOOD: DialogLine[] = [
    { id: 'mgg1', text: 'การเงินตอนนี้ดีมากเลยค่ะ! 💰', expression: 'happy' },
    { id: 'mgg2', text: 'เก่งมาก! เก็บเงินได้ดีเลยนะคะ~', expression: 'excited' },
];

export const MONEY_NOT_ENOUGH: DialogLine[] = [
    { id: 'mne1', text: 'ไม่นะ... เงินไม่พอจ่ายบิลทั้งหมดเลย 😢', expression: 'worried' },
    { id: 'mne2', text: 'ต้องหาทางเพิ่มรายได้หรือเลื่อนบิลบางอันค่ะ', expression: 'thinking' },
];

// Spending advice based on daily budget
export const SPENDING_TIPS: Record<string, DialogLine[]> = {
    extreme_low: [
        { id: 'st1', text: 'วันนี้ใช้ได้แค่นิดเดียวนะคะ...', expression: 'worried' },
        { id: 'st2', text: 'ทำอาหารทานเองช่วยประหยัดได้เยอะเลย!', expression: 'thinking' },
    ],
    low: [
        { id: 'st3', text: 'งบวันนี้จำกัดหน่อยนะคะ~', expression: 'thinking' },
        { id: 'st4', text: 'ซื้อของจำเป็นก่อน ของอยากได้ไว้ทีหลังนะ', expression: 'idle' },
    ],
    normal: [
        { id: 'st5', text: 'วันนี้ใช้ได้ปกตินะคะ!', expression: 'happy' },
        { id: 'st6', text: 'อย่าลืมเก็บออมด้วยนะ~', expression: 'idle' },
    ],
    good: [
        { id: 'st7', text: 'การเงินดีมากเลยค่ะวันนี้! 🎉', expression: 'excited' },
        { id: 'st8', text: 'อยากซื้ออะไรก็ได้ แต่อย่าฟุ่มเฟือยนะคะ~', expression: 'happy' },
    ],
};

// Random interaction dialogs
export const IDLE_CHATS: DialogLine[] = [
    { id: 'ic1', text: 'มีอะไรให้ช่วยไหมคะ?', expression: 'idle' },
    { id: 'ic2', text: 'วันนี้เป็นยังไงบ้างคะ?', expression: 'happy' },
    { id: 'ic3', text: 'แตะที่เมย์ได้นะคะถ้าต้องการอะไร~', expression: 'idle' },
    { id: 'ic4', text: 'อย่าลืมดูแลตัวเองด้วยนะคะ!', expression: 'happy' },
];

export const TAP_REACTIONS: DialogLine[] = [
    { id: 'tr1', text: 'อะ! ทำอะไรคะ~? 😳', expression: 'surprised' },
    { id: 'tr2', text: 'เฮ้! ยินดีรับใช้ค่ะ~', expression: 'happy' },
    { id: 'tr3', text: 'ว่าไงคะ มีอะไรให้ช่วยไหม?', expression: 'idle' },
    { id: 'tr4', text: 'อิอิ~ แตะทำไมคะ?', expression: 'happy' },
];

// Bill Book Dialogs
export const BILL_BOOK_HIGH_COST: DialogLine[] = [
    { id: 'bb1', text: 'เดือนนี้รายจ่ายประจำสูงจัง... ระวังเรื่องเงินหน่อยนะคะนายท่าน!', expression: 'worried' },
    { id: 'bb2', text: 'ค่าใช้จ่ายคงที่เยอะจัง เดือนนี้ต้องรัดเข็มขัดหน่อยแล้ว~', expression: 'thinking' },
];

export const INSTALLMENT_COMPLETE: DialogLine[] = [
    { id: 'icp1', text: 'เย้! จ่ายครบทุกงวดแล้ว ดีใจด้วยนะคะ! 🎉', expression: 'excited' },
    { id: 'icp2', text: 'ปลดหนี้ไปอีกหนึ่ง! เก่งมากค่ะนายท่าน~', expression: 'happy' },
];

export const BILL_BOOK_ADDED: DialogLine[] = [
    { id: 'bba1', text: 'บันทึกรายการใหม่เรียบร้อยค่ะ! เดี๋ยวเมย์ช่วยจำให้นะคะ', expression: 'happy' },
    { id: 'bba2', text: 'เพิ่มรายการแล้วค่ะ! จะคอยเตือนให้ทุกเดือนเลย~', expression: 'excited' },
];

// Helper function to get random dialog
export function getRandomDialog(dialogs: DialogLine[]): DialogLine {
    const index = Math.floor(Math.random() * dialogs.length);
    return dialogs[index];
}

// Helper function to get greeting based on time
export function getTimeBasedGreeting(): DialogLine[] {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return MORNING_GREETINGS;
    } else if (hour >= 12 && hour < 17) {
        return AFTERNOON_GREETINGS;
    } else {
        return EVENING_GREETINGS;
    }
}

// Get spending tip based on daily budget
export function getSpendingTip(dailyBudget: number): DialogLine[] {
    if (dailyBudget < 50) {
        return SPENDING_TIPS.extreme_low;
    } else if (dailyBudget < 150) {
        return SPENDING_TIPS.low;
    } else if (dailyBudget < 500) {
        return SPENDING_TIPS.normal;
    } else {
        return SPENDING_TIPS.good;
    }
}

// Get character expression based on financial status
export function getExpressionForFinance(
    totalCash: number,
    totalDebt: number
): CharacterExpression {
    const remaining = totalCash - totalDebt;

    if (remaining < 0) return 'worried';
    if (remaining < totalCash * 0.2) return 'thinking';
    if (remaining > totalCash * 0.7) return 'excited';
    return 'happy';
}

// Bill type for upcoming bill reminder
interface BillForReminder {
    name: string;
    amount: number;
    dueDate: string;
    isPaid: boolean;
}

// Get upcoming bill reminder with specific details
export function getUpcomingBillReminder(bills: BillForReminder[]): DialogLine[] {
    // Filter unpaid bills and sort by due date
    const unpaidBills = bills
        .filter(b => !b.isPaid)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    if (unpaidBills.length === 0) {
        return [
            { id: 'ubr1', text: 'ไม่มีบิลค้างจ่ายเลยค่ะ! เก่งมาก~ 🎉', expression: 'excited' },
            { id: 'ubr2', text: 'ว่างๆ ก็เก็บเงินไว้เผื่อเดือนหน้านะคะ', expression: 'happy' },
        ];
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Group bills by due date
    const groupBillsByDate = (targetDate: Date) => {
        return unpaidBills.filter(b => {
            const billDate = new Date(b.dueDate);
            billDate.setHours(0, 0, 0, 0);
            return billDate.getTime() === targetDate.getTime();
        });
    };

    // Helper to format bill names list
    const formatBillNames = (billsList: BillForReminder[]): string => {
        if (billsList.length === 1) return `"${billsList[0].name}"`;
        if (billsList.length === 2) return `"${billsList[0].name}" และ "${billsList[1].name}"`;
        const firstTwo = billsList.slice(0, 2).map(b => `"${b.name}"`).join(', ');
        return `${firstTwo} และอีก ${billsList.length - 2} รายการ`;
    };

    // Helper to calculate total
    const getTotalAmount = (billsList: BillForReminder[]): number => {
        return billsList.reduce((sum, b) => sum + b.amount, 0);
    };

    const nextBill = unpaidBills[0];
    const dueDate = new Date(nextBill.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const formattedDate = dueDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });

    // Get all bills due on the same day
    const sameDayBills = groupBillsByDate(dueDate);
    const sameDayTotal = getTotalAmount(sameDayBills);
    const formattedTotal = sameDayTotal.toLocaleString();

    // Overdue bills
    if (diffDays < 0) {
        const overdueBills = unpaidBills.filter(b => {
            const bDate = new Date(b.dueDate);
            bDate.setHours(0, 0, 0, 0);
            return bDate.getTime() < today.getTime();
        });
        const overdueTotal = getTotalAmount(overdueBills);

        if (overdueBills.length === 1) {
            return [
                { id: 'ubr-od1', text: `ไม่นะ! บิล "${overdueBills[0].name}" เกินกำหนดไปแล้ว!! 😱`, expression: 'worried' },
                { id: 'ubr-od2', text: `ต้องจ่าย ฿${overdueTotal.toLocaleString()} รีบไปจ่ายเลยนะคะ!`, expression: 'angry' },
            ];
        }
        return [
            { id: 'ubr-od1', text: `ไม่นะ! มีบิลเกินกำหนด ${overdueBills.length} รายการแล้ว!! 😱`, expression: 'worried' },
            { id: 'ubr-od2', text: `${formatBillNames(overdueBills)} รวม ฿${overdueTotal.toLocaleString()} รีบจ่ายเลยนะคะ!`, expression: 'angry' },
        ];
    }

    // Due today
    if (diffDays === 0) {
        if (sameDayBills.length === 1) {
            return [
                { id: 'ubr-td1', text: `วันนี้ต้องจ่าย "${nextBill.name}" นะคะ!`, expression: 'worried' },
                { id: 'ubr-td2', text: `จำนวน ฿${formattedTotal} อย่าลืมล่ะ~`, expression: 'thinking' },
            ];
        }
        return [
            { id: 'ubr-td1', text: `วันนี้มี ${sameDayBills.length} บิลที่ต้องจ่ายนะคะ! 📋`, expression: 'worried' },
            { id: 'ubr-td2', text: `${formatBillNames(sameDayBills)} รวม ฿${formattedTotal}`, expression: 'thinking' },
        ];
    }

    // Due tomorrow
    if (diffDays === 1) {
        if (sameDayBills.length === 1) {
            return [
                { id: 'ubr-tm1', text: `พรุ่งนี้ต้องจ่าย "${nextBill.name}" ค่ะ!`, expression: 'thinking' },
                { id: 'ubr-tm2', text: `เตรียมเงิน ฿${formattedTotal} ไว้ด้วยนะคะ`, expression: 'idle' },
            ];
        }
        return [
            { id: 'ubr-tm1', text: `พรุ่งนี้มี ${sameDayBills.length} บิลครบกำหนดค่ะ!`, expression: 'thinking' },
            { id: 'ubr-tm2', text: `${formatBillNames(sameDayBills)} รวม ฿${formattedTotal}`, expression: 'idle' },
        ];
    }

    // Due within 3 days
    if (diffDays <= 3) {
        if (sameDayBills.length === 1) {
            return [
                { id: 'ubr-3d1', text: `"${nextBill.name}" ใกล้ถึงกำหนดแล้วนะคะ!`, expression: 'thinking' },
                { id: 'ubr-3d2', text: `จ่ายวันที่ ${formattedDate} จำนวน ฿${formattedTotal}`, expression: 'idle' },
            ];
        }
        return [
            { id: 'ubr-3d1', text: `วันที่ ${formattedDate} มี ${sameDayBills.length} บิลครบกำหนดค่ะ`, expression: 'thinking' },
            { id: 'ubr-3d2', text: `${formatBillNames(sameDayBills)} รวม ฿${formattedTotal}`, expression: 'idle' },
        ];
    }

    // Due within 7 days
    if (diffDays <= 7) {
        if (sameDayBills.length === 1) {
            return [
                { id: 'ubr-7d1', text: `บิลถัดไปคือ "${nextBill.name}" ค่ะ`, expression: 'happy' },
                { id: 'ubr-7d2', text: `กำหนดจ่ายวันที่ ${formattedDate} จำนวน ฿${formattedTotal}`, expression: 'idle' },
            ];
        }
        return [
            { id: 'ubr-7d1', text: `วันที่ ${formattedDate} มี ${sameDayBills.length} บิลครบกำหนดค่ะ`, expression: 'happy' },
            { id: 'ubr-7d2', text: `${formatBillNames(sameDayBills)} รวม ฿${formattedTotal}`, expression: 'idle' },
        ];
    }

    // More than 7 days - just greeting with bill count
    const totalUnpaid = unpaidBills.reduce((sum, b) => sum + b.amount, 0);
    return [
        { id: 'ubr-nrm1', text: `ตอนนี้มีบิลค้างจ่าย ${unpaidBills.length} รายการค่ะ`, expression: 'happy' },
        { id: 'ubr-nrm2', text: `รวมทั้งหมด ฿${totalUnpaid.toLocaleString()} ค่อยๆ จ่ายนะคะ~`, expression: 'idle' },
    ];
}

