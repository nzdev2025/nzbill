import { useState, useEffect, useCallback } from 'react';

// Styles
import './styles/index.css';
import './styles/animations.css';
import './App.css';

// Components
import { GameStage } from './components/Layout/GameStage';
import { Header, BottomNav } from './components/Layout';
import { AddBillModal } from './components/Bills';
// ConfirmDialog and Toast are now handy globally via UIContext
import { LoadingScreen } from './components/Common/LoadingScreen';
import {
  BillsOverlay,
  PlannerOverlay,
  SettingsOverlay,
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
  useProfile,
  useCharacterSystem
} from './hooks';
import { useUI } from './contexts/UIContext';

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

  const { user, loading } = useAuth();
  const { updateBalance } = useProfile();
  const { showToast, confirm } = useUI();

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
      const reminder = getUpcomingBillReminder(bills.map(b => ({
        ...b,
        isPaid: b.isPaid
      })));
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
      showToast(`❌ ${billsError}`);
    }
  }, [billsError, showToast]);

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
    showToast(`💰 จ่าย "${bill.name}" สำเร็จ!`);
  }, [markAsPaid, dialog, showToast]);

  const handleMarkUnpaid = useCallback((bill: Bill) => {
    markAsUnpaid(bill.id);
    showToast(`↩ ยกเลิกการจ่าย "${bill.name}"`);
  }, [markAsUnpaid, showToast]);

  const handleEditBill = useCallback((bill: Bill) => {
    setEditingBill(bill);
    setShowAddBill(true);
  }, []);

  const handleDeleteBill = useCallback((bill: Bill) => {
    confirm({
      title: '🗑️ ยืนยันการลบ',
      message: `ต้องการลบ "${bill.name}" ใช่ไหม?`,
      variant: 'danger',
      confirmText: 'ลบ',
      cancelText: 'ยกเลิก',
      onConfirm: () => deleteBill(bill.id),
    });
  }, [deleteBill, confirm]);

  const handleSaveBill = useCallback(async (billData: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingBill) {
        await updateBill(editingBill.id, billData);
        showToast('✅ แก้ไขบิลเรียบร้อย');
      } else {
        const newBill = await addBill(billData);
        if (newBill) {
          showToast('✅ เพิ่มบิลเรียบร้อย');
        } else {
          showToast('❌ ไม่สามารถเพิ่มบิลได้');
        }
      }
      setEditingBill(null);
    } catch (error) {
      console.error('Error saving bill:', error);
      showToast('❌ เกิดข้อผิดพลาด กรุณาลองใหม่');
    }
  }, [editingBill, addBill, updateBill, showToast]);

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

  // Character System
  const { getCharacterAssets } = useCharacterSystem();

  // Get current asset based on expression
  const currentBodyAsset = getCharacterAssets(characterAnimation.currentExpression);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginOverlay />;
  }

  return (
    <div className="app-container">
      {/* Game Stage (Background + Character + Speech) */}
      <GameStage
        backgroundImage={bgMain}
        character={{
          // Pass the dynamic asset URL (Character component will handle it)
          // We need to update GameStage and Character component to accept 'imageSrc' or similar
          // But for now, let's assume Character component is updated to accept 'imageSrc' OR we pass it via expression if we change logic?
          // WAIT: Character component currently uses internal mapping. We need to update it to accept external src.
          // Let's check Character component again.

          expression: characterAnimation.currentExpression,
          isBlinking: characterAnimation.isBlinking,
          isTalking: dialog.isTyping,
          onClick: handleCharacterTap,
          customImageSrc: currentBodyAsset // New prop we will add to GameStage/Character
        }}
        speechBubble={
          currentPage === 'home' && dialog.currentText
            ? {
              text: dialog.currentText,
              isTyping: dialog.isTyping,
              onClick: () => dialog.nextLine(),
            }
            : undefined
        }
      >
        {/* Header - always on top of stage */}
        <Header
          level={level}
          balance={totalCash}
          onBalanceClick={handleEditBalance}
        />

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
      </GameStage>

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
    </div>
  );
}

export default App;
