import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingScreen } from './LoadingScreen';

describe('LoadingScreen Component', () => {
    it('should render correctly', () => {
        render(<LoadingScreen />);
        expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
    });

    it('should display loading message in Thai', () => {
        render(<LoadingScreen />);
        expect(screen.getByText(/กำลังโหลด/i)).toBeInTheDocument();
    });

    it('should have loading spinner animation', () => {
        render(<LoadingScreen />);
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should display custom message when provided', () => {
        render(<LoadingScreen message="กำลังเตรียมข้อมูล..." />);
        expect(screen.getByText('กำลังเตรียมข้อมูล...')).toBeInTheDocument();
    });
});
