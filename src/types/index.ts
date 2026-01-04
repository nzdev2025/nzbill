// ==========================================
// NzBill Type Definitions
// ==========================================

// Character Types
// Note: Available sprites: idle, happy, worried, thinking
// Other expressions use fallbacks defined in Character.tsx
export type CharacterExpression =
  | 'idle'
  | 'happy'
  | 'worried'
  | 'angry'     // Falls back to 'worried'
  | 'excited'   // Falls back to 'happy'
  | 'surprised' // Falls back to 'happy'
  | 'thinking';

export type CharacterOutfit =
  | 'default'
  | 'casual'
  | 'formal'
  | 'pajama';

export interface CharacterState {
  expression: CharacterExpression;
  outfit: CharacterOutfit;
  isBlinking: boolean;
  isTalking: boolean;
}

export interface CharacterConfig {
  id: string;
  name: string;
  sprites: Record<CharacterExpression, string>;
  outfits: Record<CharacterOutfit, Record<CharacterExpression, string>>;
}

// Bill Types
export type BillCategory =
  | 'electricity'
  | 'water'
  | 'internet'
  | 'credit_card'
  | 'phone'
  | 'rent'
  | 'insurance'
  | 'subscription'
  | 'loan'
  | 'other';

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  dueDay: number; // 1-31
  category: BillCategory;
  active: boolean;
  isInstallment: boolean;
  totalTerms?: number;
  currentTerm?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string; // ISO date string
  category: BillCategory;
  isPaid: boolean;
  reminderDaysBefore: number;
  isRecurring: boolean;
  recurringExpenseId?: string; // Link back to master template
  recurringDay?: number; // Day of month (1-31)
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
// Financial Types
export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'cash' | 'bank' | 'savings' | 'credit';
  icon?: string;
}

export interface FinancialSummary {
  totalCash: number;
  totalDebt: number;
  dailyBudget: number;
  daysUntilPayday: number;
  upcomingBills: Bill[];
}

export interface SpendingAdvice {
  message: string;
  type: 'warning' | 'success' | 'info' | 'danger';
  expression: CharacterExpression;
}

// Settings Types
export interface AppSettings {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  language: 'th' | 'en';
  characterId: string;
  characterOutfit: CharacterOutfit;
  reminderTime: string; // HH:mm format
  theme: 'light' | 'dark' | 'auto';
}

// Dialog Types
export interface DialogLine {
  id: string;
  text: string;
  expression: CharacterExpression;
  soundEffect?: string;
}

export interface DialogSequence {
  id: string;
  trigger: string;
  lines: DialogLine[];
}

// Navigation Types
export type AppPage = 'home' | 'bills' | 'planner' | 'settings' | 'bill-book' | 'analytics';

// User Level/Experience (Gamification)
export interface UserProgress {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  achievements: string[];
  streakDays: number;
}
