export type AppPage = 'home' | 'bills' | 'planner' | 'settings' | 'analytics' | 'bill-book';

export type BillStatus = 'unpaid' | 'paid' | 'overdue';
export type BillCategory = 'utility' | 'subscription' | 'credit_card' | 'loan' | 'other';
export type RecurringType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export type NotificationType = 'none' | 'on_due_date' | '1_day_before' | '3_days_before' | '1_week_before';

export type CharacterExpression = 'idle' | 'happy' | 'worried' | 'angry' | 'thinking' | 'excited' | 'surprised';

// Bill Book Interface (Template for bills)
export interface BillBookItem {
  id: string; // UUID
  name: string;
  amount: number | null; // null means "ask every time"
  category: BillCategory;
  icon?: string;
  default_due_day?: number; // 1-31
  is_active: boolean;
  created_at?: string;
}

export interface Bill {
  id: string; // UUID
  name: string;
  amount: number;
  dueDate: string; // ISO Date string
  status: BillStatus;
  isPaid: boolean;
  category: BillCategory;
  recurring: RecurringType;
  notification: NotificationType;
  paidDate?: string; // ISO Date string
  userId?: string;

  // New fields for Bill Book integration
  bill_book_id?: string; // Link to source template
  note?: string;

  // Legacy fields (optional support)
  icon?: string;
  createdAt?: string;
  updatedAt?: string;

  // Missing fields from revert
  isRecurring?: boolean;
  reminderDaysBefore?: number;
  recurringExpenseId?: string;
  recurringDay?: number;
}

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: BillCategory;
  dueDay: number;
  active: boolean;
  isInstallment?: boolean;
  totalInstallments?: number;
  paidInstallments?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  level: number;
  exp: number;
  total_cash: number;
  onboarding_completed: boolean;
  settings: AppSettings;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  currency: 'THB' | 'USD';
  language: 'th' | 'en';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  biometricEnabled: boolean;
  lowDataMode: boolean; // New: for slower connections
}

export interface CharacterState {
  expression: CharacterExpression;
  isBlinking: boolean;
  isTalking: boolean;
  outfitId: string; // For future customization
}

// Dialog System Types
export interface DialogMessage {
  id: string;
  text: string;
  expression: CharacterExpression;
  duration?: number; // ms
  isQuestion?: boolean;
  options?: DialogOption[];
}

export interface DialogOption {
  id: string;
  text: string;
  action: () => void;
  nextDialogId?: string;
}

export type DialogSequence = DialogMessage[];
