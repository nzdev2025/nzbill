import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginOverlay } from './LoginOverlay';
import * as UseAuthModule from '../../hooks/useAuth';

// Mock AuthContext
const mockSignInWithGoogle = vi.fn();
const mockSignInWithEmail = vi.fn();
const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();

vi.spyOn(UseAuthModule, 'useAuth').mockReturnValue({
    user: null,
    session: null,
    loading: false,
    error: null,
    signInWithGoogle: mockSignInWithGoogle,
    signInWithEmail: mockSignInWithEmail,
    signInWithPassword: mockSignInWithPassword,
    signUp: mockSignUp,
    signOut: vi.fn(),
});

describe('LoginOverlay Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render login form correctly (Default Password Mode)', () => {
        render(<LoginOverlay />);

        expect(screen.getByText('NzBill')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/อีเมลของคุณ/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/รหัสผ่าน/i)).toBeInTheDocument();

        // Check for the presence of login buttons (Tab and Submit)
        const buttons = screen.getAllByRole('button', { name: /เข้าสู่ระบบ/i });
        expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('should call signInWithPassword when form is submitted in Login mode', async () => {
        render(<LoginOverlay />);

        const emailInput = screen.getByPlaceholderText(/อีเมลของคุณ/i);
        const passwordInput = screen.getByPlaceholderText(/รหัสผ่าน/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        // Select the submit button specifically by matching the "เลย" suffix which tab doesn't have
        const submitBtn = screen.getByRole('button', { name: /เข้าสู่ระบบเลย/i });

        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockSignInWithPassword).toHaveBeenCalledWith('test@example.com', 'password123');
        });
    });

    it('should call signUp when switching to Register mode', async () => {
        render(<LoginOverlay />);

        // Switch to Register tab
        const registerTab = screen.getByText(/สมัครสมาชิก/i);
        fireEvent.click(registerTab);

        const emailInput = screen.getByPlaceholderText(/อีเมลของคุณ/i);
        const passwordInput = screen.getByPlaceholderText(/รหัสผ่าน/i);

        fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'newpass123' } });

        const submitBtn = screen.getByRole('button', { name: /เริ่มใช้งานเลย/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockSignUp).toHaveBeenCalledWith('new@example.com', 'newpass123');
        });
    });

    it('should call signInWithEmail when using Magic Link mode', async () => {
        render(<LoginOverlay />);

        // Switch to Magic Link mode
        const magicLinkBtn = screen.getByText(/magic link/i);
        fireEvent.click(magicLinkBtn);

        const emailInput = screen.getByPlaceholderText(/อีเมลของคุณ/i);
        fireEvent.change(emailInput, { target: { value: 'magic@example.com' } });

        // Password should not be visible
        expect(screen.queryByPlaceholderText(/รหัสผ่าน/i)).not.toBeInTheDocument();

        const submitBtn = screen.getByRole('button', { name: /ส่งลิงก์วิเศษ/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockSignInWithEmail).toHaveBeenCalledWith('magic@example.com');
        });
    });

    it('should call signInWithGoogle when google button is clicked', async () => {
        render(<LoginOverlay />);

        const googleBtn = screen.getByText('เข้าสู่ระบบด้วย Google');
        fireEvent.click(googleBtn);

        expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
    });

    it('should show success message after successful registration', async () => {
        render(<LoginOverlay />);

        const registerTab = screen.getByText(/สมัครสมาชิก/i);
        fireEvent.click(registerTab);

        const emailInput = screen.getByPlaceholderText(/อีเมลของคุณ/i);
        const passwordInput = screen.getByPlaceholderText(/รหัสผ่าน/i);

        fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'newpass123' } });

        const submitBtn = screen.getByRole('button', { name: /เริ่มใช้งานเลย/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText(/สมัครสมาชิกสำเร็จ/i)).toBeInTheDocument();
        });
    });
});
