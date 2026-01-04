import { useState, useEffect, useCallback } from 'react';

// Styles
import './styles/index.css';
import './styles/animations.css';
import './App.css';

// Components
import { Character, SpeechBubble } from './components/Character';
import { Header, BottomNav } from './components/Layout';
import { AddBillModal } from './components/Bills';
import { ConfirmDialog } from './components/Common/ConfirmDialog';
import { LoadingScreen } from './components/Common/LoadingScreen';
import {
  BillsOverlay,
  PlannerOverlay,
  SettingsOverlay,
  HomeBubble,
  LoginOverlay,
  AnalyticsOverlay
} from './components/Overlays';
import { BillBookView } from './components/BillBook';

// Hooks
import {
  useBills,
  useCharacterAnimation,
  useDialog,
  useLocalStorage,
  useBillGenerator,
  useAuth,
  useProfile
} from './hooks';

// Data
import {
  getRandomDialog,
  TAP_REACTIONS,
  BILL_PAID_SUCCESS,
  getExpressionForFinance,
  getUpcomingBillReminder,
} from './data/dialogues';

// Utils
import { getDaysUntilEndOfMonth } from './utils/date';

// Types
import type { AppPage, Bill } from './types';

// Background
import bgMain from './assets/backgrounds/bg_main.png';

function App() {
  // State
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [showAddBill, setShowAddBill] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [totalCash] = useLocalStorage<number>('nzbill_total_cash', 5000);
  const [level] = useLocalStorage<number>('nzbill_level', 1);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const { user, loading } = useAuth();
  const { updateBalance } = useProfile();

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  const [balanceDialog, setBalanceDialog] = useState<{
    isOpen: boolean;
    value: string;
  }>({
    isOpen: false,
    value: '',
  });

  // Hooks
  const {
    bills,
    addBill,
    updateBill,
    deleteBill,
    markAsPaid,
    markAsUnpaid,
    processingIds,
    error: billsError,
    getTotalDebt,
  } = useBills();

  // Auto-generate bills from Bill Book
  useBillGenerator();

  const characterAnimation = useCharacterAnimation('idle');

  const dialog = useDialog({
    typingSpeed: 25,
    onExpressionChange: (exp) => characterAnimation.setExpression(exp),
  });

  // Get total debt value once for use in effects
  const totalDebt = getTotalDebt();

  // Show bill reminder when bills data is loaded
  useEffect(() => {
    if (bills.length > 0 || !loading) {
      const reminder = getUpcomingBillReminder(bills);
      dialog.showDialog(reminder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bills.length]);

  // Update expression based on financial status
  useEffect(() => {
    if (dialog.isComplete) {
      const expression = getExpressionForFinance(totalCash, totalDebt);
      characterAnimation.setExpression(expression);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCash, totalDebt, dialog.isComplete]);

  // Show error toast when billsError changes
  useEffect(() => {
    if (billsError) {
      setToast({ message: `❌ ${billsError}`, visible: true });
      setTimeout(() => setToast({ message: '', visible: false }), 4000);
    }
  }, [billsError]);

  // Handle character tap
  const handleCharacterTap = useCallback(() => {
    if (!dialog.isComplete) {
      dialog.nextLine();
    } else {
      const reaction = getRandomDialog(TAP_REACTIONS);
      dialog.showSingleMessage(reaction.text, reaction.expression);
    }
  }, [dialog]);

  // Handle bill actions
  const handlePayBill = useCallback((bill: Bill) => {
    markAsPaid(bill.id);
    const successDialog = getRandomDialog(BILL_PAID_SUCCESS);
    dialog.showSingleMessage(successDialog.text, successDialog.expression);
    // Show toast
    setToast({ message: `💰 จ่าย "${bill.name}" สำเร็จ!`, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  }, [markAsPaid, dialog]);

  const handleMarkUnpaid = useCallback((bill: Bill) => {
    markAsUnpaid(bill.id);
    setToast({ message: `↩ ยกเลิกการจ่าย "${bill.name}"`, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  }, [markAsUnpaid]);

  const handleEditBill = useCallback((bill: Bill) => {
    setEditingBill(bill);
    setShowAddBill(true);
  }, []);

  const handleDeleteBill = useCallback((bill: Bill) => {
    setConfirmDialog({
      isOpen: true,
      title: '🗑️ ยืนยันการลบ',
      message: `ต้องการลบ "${bill.name}" ใช่ไหม?`,
      onConfirm: () => {
        deleteBill(bill.id);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  }, [deleteBill]);

  const handleSaveBill = useCallback((billData: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingBill) {
      updateBill(editingBill.id, billData);
    } else {
      addBill(billData);
    }
    setEditingBill(null);
  }, [editingBill, addBill, updateBill]);

  // Handle balance edit - using custom dialog
  const handleEditBalance = useCallback(() => {
    setBalanceDialog({
      isOpen: true,
      value: totalCash.toString(),
    });
  }, [totalCash]);

  const handleSaveBalance = useCallback(async () => {
    const amount = parseFloat(balanceDialog.value);
    if (!isNaN(amount) && amount >= 0) {
      await updateBalance(amount);
    }
    setBalanceDialog({ isOpen: false, value: '' });
  }, [balanceDialog.value, updateBalance]);

  // Calculate financial values
  const remaining = totalCash - totalDebt;
  const dailyBudget = Math.max(0, remaining / getDaysUntilEndOfMonth());

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginOverlay />;
  }

  return (
    <div className="app-container">
      {/* Full-screen background + character */}
      <div
        className="game-stage"
        style={{ backgroundImage: `url(${bgMain})` }}
      >
        {/* Header - always on top */}
        <Header
          level={level}
          balance={totalCash}
          onBalanceClick={handleEditBalance}
        />

        {/* Character - always visible */}
        <div className="character-layer">
          <Character
            expression={characterAnimation.currentExpression}
            isBlinking={characterAnimation.isBlinking}
            isTalking={dialog.isTyping}
            onClick={handleCharacterTap}
            size="large"
          />
        </div>

        {/* Speech Bubble - floating, only show on home */}
        {currentPage === 'home' && dialog.currentText && (
          <div className="speech-layer">
            <SpeechBubble
              text={dialog.currentText}
              isTyping={dialog.isTyping}
              onClick={() => dialog.nextLine()}
            />
          </div>
        )}

        {/* Overlay panel based on page */}
        {currentPage === 'bills' && (
          <BillsOverlay
            bills={bills}
            processingIds={processingIds}
            onPayBill={handlePayBill}
            onEditBill={handleEditBill}
            onDeleteBill={handleDeleteBill}
            onMarkUnpaid={handleMarkUnpaid}
          />
        )}

        {currentPage === 'bill-book' && (
          <BillBookView bills={bills} addBill={addBill} />
        )}

        {currentPage === 'planner' && (
          <PlannerOverlay
            totalCash={totalCash}
            totalDebt={totalDebt}
            dailyBudget={dailyBudget}
          />
        )}

        {currentPage === 'settings' && (
          <SettingsOverlay onEditBalance={handleEditBalance} />
        )}

        {currentPage === 'analytics' && (
          <AnalyticsOverlay bills={bills} />
        )}

        {/* Home quick info */}
        {currentPage === 'home' && !dialog.currentText && (
          <HomeBubble
            sortedBills={bills.filter(b => !b.isPaid).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())}
            onViewAll={() => setCurrentPage('bills')}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        activePage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* FAB - Add Bill */}
      <button
        className="btn btn-primary btn-fab"
        onClick={() => {
          setEditingBill(null);
          setShowAddBill(true);
        }}
        aria-label="เพิ่มบิล"
      >
        +
      </button>

      {/* Add/Edit Bill Modal */}
      <AddBillModal
        isOpen={showAddBill}
        onClose={() => {
          setShowAddBill(false);
          setEditingBill(null);
        }}
        onSave={handleSaveBill}
        editBill={editingBill}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="ลบ"
        cancelText="ยกเลิก"
        variant="danger"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Balance Edit Dialog */}
      {balanceDialog.isOpen && (
        <div className="modal-overlay" onClick={() => setBalanceDialog({ isOpen: false, value: '' })}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">💰 แก้ไขยอดเงินคงเหลือ</h2>
              <button
                className="modal__close"
                onClick={() => setBalanceDialog({ isOpen: false, value: '' })}
              >
                ✕
              </button>
            </div>
            <div className="modal__form">
              <div className="form-group">
                <label className="form-label">ยอดเงินคงเหลือ (บาท)</label>
                <input
                  type="number"
                  className="form-input"
                  value={balanceDialog.value}
                  onChange={(e) => setBalanceDialog((prev) => ({ ...prev, value: e.target.value }))}
                  min="0"
                  step="0.01"
                  autoFocus
                />
              </div>
              <div className="modal__actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setBalanceDialog({ isOpen: false, value: '' })}
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveBalance}
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast.visible && (
        <div className="toast-notification">
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default App;
