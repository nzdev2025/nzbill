import { render, screen, fireEvent } from '@testing-library/react';
import { UIProvider, useUI } from './UIContext';
import { describe, it, expect } from 'vitest';

const TestComponent = () => {
    const { showToast, confirm } = useUI();
    return (
        <div>
            <button onClick={() => showToast('Hello world')}>Show Toast</button>
            <button onClick={() => confirm({ title: 'Sure?', message: 'Really?', onConfirm: () => console.log('Confirmed') })}>
                Show Confirm
            </button>
        </div>
    );
};

describe('UIContext', () => {
    it('shows toast when called', () => {
        render(
            <UIProvider>
                <TestComponent />
            </UIProvider>
        );

        fireEvent.click(screen.getByText('Show Toast'));
        expect(screen.getByRole('status')).toHaveTextContent('Hello world');
    });

    it('shows confirm dialog when called', () => {
        render(
            <UIProvider>
                <TestComponent />
            </UIProvider>
        );

        fireEvent.click(screen.getByText('Show Confirm'));
        expect(screen.getByText('Sure?')).toBeInTheDocument();
        expect(screen.getByText('Really?')).toBeInTheDocument();
    });
});
