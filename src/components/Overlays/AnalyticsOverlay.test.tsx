import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnalyticsOverlay from './AnalyticsOverlay';

// Mock dependencies
vi.mock('../../hooks/useBills', () => ({
    useBills: () => ({
        bills: [],
        loading: false,
        error: null,
    }),
}));

vi.mock('../../hooks/useAuth', () => ({
    useAuth: () => ({
        user: { id: 'test-user' },
    }),
}));

// Mock the child dashboard component to isolate tests
vi.mock('../Analytics/AnalyticsDashboard', () => ({
    AnalyticsDashboard: () => <div data-testid="analytics-dashboard">Mock Dashboard</div>,
}));

describe('AnalyticsOverlay Component', () => {
    it('renders the title correctly', () => {
        render(<AnalyticsOverlay bills={[]} />);
        expect(screen.getByText('สถิติการใช้จ่าย')).toBeInTheDocument();
    });

    it('renders the AnalyticsDashboard component', () => {
        render(<AnalyticsOverlay bills={[]} />);
        expect(screen.getByTestId('analytics-dashboard')).toBeInTheDocument();
    });
});
