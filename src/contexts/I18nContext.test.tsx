import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nProvider, useTranslation } from './I18nContext';

// Test component to access i18n context
const TestComponent = () => {
    const { t, language, setLanguage } = useTranslation();
    return (
        <div>
            <span data-testid="current-language">{language}</span>
            <span data-testid="greeting">{t('common.loading')}</span>
            <span data-testid="bills-title">{t('bills.title')}</span>
            <button onClick={() => setLanguage('th')}>Thai</button>
            <button onClick={() => setLanguage('en')}>English</button>
        </div>
    );
};

describe('I18nContext', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should have Thai as default language', () => {
        render(
            <I18nProvider>
                <TestComponent />
            </I18nProvider>
        );
        expect(screen.getByTestId('current-language')).toHaveTextContent('th');
    });

    it('should display Thai text by default', () => {
        render(
            <I18nProvider>
                <TestComponent />
            </I18nProvider>
        );
        expect(screen.getByTestId('greeting')).toHaveTextContent('กำลังโหลด...');
        expect(screen.getByTestId('bills-title')).toHaveTextContent('รายการบิล');
    });

    it('should switch to English', () => {
        render(
            <I18nProvider>
                <TestComponent />
            </I18nProvider>
        );
        fireEvent.click(screen.getByText('English'));
        expect(screen.getByTestId('current-language')).toHaveTextContent('en');
        expect(screen.getByTestId('greeting')).toHaveTextContent('Loading...');
        expect(screen.getByTestId('bills-title')).toHaveTextContent('Bills');
    });

    it('should save language preference to localStorage', () => {
        render(
            <I18nProvider>
                <TestComponent />
            </I18nProvider>
        );
        fireEvent.click(screen.getByText('English'));
        expect(localStorage.getItem('nzbill_language')).toBe('en');
    });

    it('should fallback to key if translation not found', () => {
        const FallbackTest = () => {
            const { t } = useTranslation();
            return <span data-testid="missing">{t('nonexistent.key')}</span>;
        };

        render(
            <I18nProvider>
                <FallbackTest />
            </I18nProvider>
        );
        expect(screen.getByTestId('missing')).toHaveTextContent('nonexistent.key');
    });
});
