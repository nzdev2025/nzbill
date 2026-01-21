import { render, screen } from '@testing-library/react';
import { Toast } from './Toast';
import { describe, it, expect } from 'vitest';

describe('Toast Component', () => {
    it('renders message when visible is true', () => {
        render(<Toast message="Test Message" visible={true} />);
        expect(screen.getByRole('status')).toHaveTextContent('Test Message');
        expect(screen.getByText('Test Message')).toBeInTheDocument();
    });

    it('does not render when visible is false', () => {
        render(<Toast message="Test Message" visible={false} />);
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
});
