import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { AuthContext } from './AuthContext';
import { AuthProvider } from './AuthProvider';
import { useContext } from 'react';
import { supabase } from '../lib/supabase';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(),
            onAuthStateChange: vi.fn(),
            signInWithOAuth: vi.fn(),
            signInWithOtp: vi.fn(),
            signOut: vi.fn(),
        },
    },
}));

const TestComponent = () => {
    const context = useContext(AuthContext);
    if (!context) return null;
    if (context.loading) return <div>Loading...</div>;
    if (context.error) return <div>Error: {context.error}</div>;
    return <div>User: {context.user ? context.user.id : 'Guest'}</div>;
};

describe('AuthContext', () => {
    const mockGetSession = supabase.auth.getSession as Mock;
    const mockOnAuthStateChange = supabase.auth.onAuthStateChange as Mock;

    beforeEach(() => {
        vi.clearAllMocks();
        // Default mocks
        mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
        mockOnAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
    });

    it('should show loading initially', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should set user if session exists', async () => {
        const mockSession = { user: { id: 'test-user' } };
        mockGetSession.mockResolvedValue({ data: { session: mockSession }, error: null });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('User: test-user')).toBeInTheDocument();
        });
    });

    it('should catch hash errors from URL (simulated)', async () => {
        // We can't easily reproduce the hash parsing logic of Supabase client here as it's internal.
        // But we can check if we are handling the error returned by getSession

        mockGetSession.mockResolvedValue({ data: { session: null }, error: { message: 'Auth error' } });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Error: Auth error')).toBeInTheDocument();
        });
    });
});
