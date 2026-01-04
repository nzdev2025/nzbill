import React, { useState } from 'react';
import { BillBookForm } from './BillBookForm';
import { useBillBook } from '../../hooks/useBillBook';
import { generateMonthlyBills } from '../../services/billGenerator';
import type { Bill, RecurringExpense } from '../../types';
import './BillBook.css';

interface BillBookViewProps {
    bills: Bill[];
    addBill: (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Bill | null>;
}

export const BillBookView: React.FC<BillBookViewProps> = ({ bills, addBill }) => {
    const { expenses, addExpense, updateExpense, deleteExpense, toggleActive } = useBillBook();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSave = async (data: Omit<RecurringExpense, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingId) {
            await updateExpense(editingId, data);
            setEditingId(null);
        } else {
            const newExpense = await addExpense(data);
            if (newExpense) {
                // Generate bill immediately for this expense
                if (newExpense.active) {
                    const { newBills } = generateMonthlyBills([newExpense], bills);

                    // Add the generated bill(s)
                    for (const bill of newBills) {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { id: _id, createdAt: _created, updatedAt: _updated, ...billData } = bill;
                        await addBill(billData);
                    }

                    if (newBills.length > 0) {
                        // Bills generated for new expense
                    }
                }

                setIsAdding(false);
            } else {
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
            }
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`ต้องการลบรายการ "${name}" ออกจากสมุดบัญชีใช่ไหม?`)) {
            await deleteExpense(id);
        }
    };

    if (isAdding || editingId) {
        const editData = editingId ? expenses.find(e => e.id === editingId) : null;
        return (
            <div className="overlay-panel">
                <div className="settings-header">
                    <span className="settings-title">
                        {editingId ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'}
                    </span>
                </div>
                <div className="overlay-content">
                    <BillBookForm
                        initialData={editData}
                        onSave={handleSave}
                        onCancel={() => {
                            setIsAdding(false);
                            setEditingId(null);
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="overlay-panel">
            <div className="overlay-tabs">
                <button className="overlay-tab active">สมุดบัญชี</button>
            </div>
            <div className="overlay-content">
                <div className="bill-book-container">
                    {expenses.length === 0 ? (
                        <div className="overlay-empty">
                            <p>ยังไม่มีรายการค่าใช้จ่ายประจำ</p>
                            <p className="text-sm text-gray-500">บันทึกค่าใช้จ่ายที่ต้องจ่ายทุกเดือนไว้ที่นี่ เพื่อให้ระบบสร้างบิลให้อัตโนมัติ</p>
                        </div>
                    ) : (
                        expenses.map((expense, index) => (
                            <div key={expense.id} className={`bill-book-card ${!expense.active ? 'inactive' : ''}`}>
                                <div className="bill-book-info">
                                    <span className="bill-book-name">{index + 1}. {expense.name}</span>
                                    <div className="bill-book-detail">
                                        <span>ทุกวันที่ {expense.dueDay}</span>
                                        {expense.isInstallment && (
                                            <span className="bill-book-term">
                                                ผ่อนชำระ
                                            </span>
                                        )}
                                    </div>
                                    <span className="bill-book-amount">฿{expense.amount.toLocaleString()}</span>
                                </div>
                                <div className="bill-book-actions">
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={expense.active}
                                            onChange={() => toggleActive(expense.id)}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                    <button
                                        className="btn-icon"
                                        onClick={() => setEditingId(expense.id)}
                                        title="แก้ไข"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn-icon text-danger"
                                        onClick={() => handleDelete(expense.id, expense.name)}
                                        title="ลบ"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button
                    className="btn btn-primary btn-block"
                    onClick={() => setIsAdding(true)}
                    style={{ marginTop: 'auto' }}
                >
                    + เพิ่มรายการใหม่
                </button>
            </div>
        </div>
    );
};
