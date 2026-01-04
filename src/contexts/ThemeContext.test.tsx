import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

// Test component to access theme context
const TestComponent = () => {
    const { theme, setTheme, isDark } = useTheme();
    return (
        <div>
            <span data-testid="current-theme">{theme}</span>
            <span data-testid="is-dark">{isDark ? 'dark' : 'light'}</span>
            <button onClick={() => setTheme('light')}>Light</button>
            <button onClick={() => setTheme('dark')}>Dark</button>
            <button onClick={() => setTheme('auto')}>Auto</button>
        </div>
    );
};

describe('ThemeContext', () => {
    beforeEach(() => {
        localStorage.clear();
        // Mock matchMedia for auto theme detection
        vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query) => ({
            matches: query === '(prefers-color-scheme: dark)',
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })));
    });

    it('should have light as default theme', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });

    it('should toggle to dark theme', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );
        fireEvent.click(screen.getByText('Dark'));
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
        expect(screen.getByTestId('is-dark')).toHaveTextContent('dark');
    });

    it('should toggle back to light theme', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );
        fireEvent.click(screen.getByText('Dark'));
        fireEvent.click(screen.getByText('Light'));
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });

    it('should save theme preference to localStorage', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );
        fireEvent.click(screen.getByText('Dark'));
        expect(localStorage.getItem('nzbill_theme')).toBe('dark');
    });

    it('should support auto mode', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );
        fireEvent.click(screen.getByText('Auto'));
        expect(screen.getByTestId('current-theme')).toHaveTextContent('auto');
    });
});
