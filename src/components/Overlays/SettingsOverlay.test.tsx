import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SettingsOverlay } from './SettingsOverlay';
import { ThemeProvider } from '../../contexts/ThemeContext';

// Mock hooks
const mockUpdateSettings = vi.fn();
const mockSignOut = vi.fn();
const mockProfile = {
    balance: 1000,
    level: 1,
    settings: {
        soundEnabled: true,
        notificationsEnabled: true,
        language: 'th',
    }
};

vi.mock('../../hooks', async () => {
    return {
        useProfile: () => ({
            profile: mockProfile,
            updateSettings: mockUpdateSettings
        }),
        useAuth: () => ({
            signOut: mockSignOut
        })
    };
});

// Helper to render with ThemeProvider
const renderWithTheme = (ui: React.ReactElement) => {
    return render(
        <ThemeProvider>
            {ui}
        </ThemeProvider>
    );
};

// Mock matchMedia for ThemeProvider
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

describe('SettingsOverlay Component', () => {
    const mockOnEditBalance = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render settings title correctly', () => {
        renderWithTheme(<SettingsOverlay onEditBalance={mockOnEditBalance} />);
        expect(screen.getByText('ตั้งค่า')).toBeInTheDocument();
    });

    it('should call updateSettings when toggling sound', () => {
        renderWithTheme(<SettingsOverlay onEditBalance={mockOnEditBalance} />);

        const soundToggle = screen.getByTestId('toggle-sound');
        expect(soundToggle).toHaveClass('active'); // Default from mockProfile is true

        fireEvent.click(soundToggle);
        expect(mockUpdateSettings).toHaveBeenCalledWith(expect.objectContaining({
            soundEnabled: false
        }));
    });

    it('should call updateSettings when toggling notifications', () => {
        renderWithTheme(<SettingsOverlay onEditBalance={mockOnEditBalance} />);

        const notifToggle = screen.getByTestId('toggle-notifications');
        expect(notifToggle).toHaveClass('active');

        fireEvent.click(notifToggle);
        expect(mockUpdateSettings).toHaveBeenCalledWith(expect.objectContaining({
            notificationsEnabled: false
        }));
    });

    it('should call updateSettings when toggling language', () => {
        renderWithTheme(<SettingsOverlay onEditBalance={mockOnEditBalance} />);

        const langBtn = screen.getByTestId('toggle-language');
        expect(langBtn).toHaveTextContent('🇹🇭 ไทย');

        fireEvent.click(langBtn);
        expect(mockUpdateSettings).toHaveBeenCalledWith(expect.objectContaining({
            language: 'en'
        }));
    });

    it('should call onEditBalance when edit balance button is clicked', () => {
        renderWithTheme(<SettingsOverlay onEditBalance={mockOnEditBalance} />);

        fireEvent.click(screen.getByTestId('edit-balance'));
        expect(mockOnEditBalance).toHaveBeenCalledTimes(1);
    });

    it('should call signOut when logout button is clicked', () => {
        renderWithTheme(<SettingsOverlay onEditBalance={mockOnEditBalance} />);

        const logoutBtn = screen.getByTestId('logout-btn');
        fireEvent.click(logoutBtn);

        expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
});

