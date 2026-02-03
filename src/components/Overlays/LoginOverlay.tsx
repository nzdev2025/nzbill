import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './LoginOverlay.css';

export const LoginOverlay = () => {
    const { signInWithGoogle, signInWithEmail, signInWithPassword, signUp, error: authError } = useAuth();
    const [mode, setMode] = useState<'login' | 'register' | 'magic'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

    // Clear message when switching modes
    const switchMode = (newMode: 'login' | 'register' | 'magic') => {
        setMode(newMode);
        setMessage(null);
    };

    // Initial check for auth error
    useEffect(() => {
        if (authError) {
            setMessage({ type: 'error', text: authError });
        }
    }, [authError]);

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setMessage(null);
            await signInWithGoogle();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google';
            setMessage({ type: 'error', text: errorMessage });
            setLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            if (mode === 'magic') {
                await signInWithEmail(email);
                setMessage({ type: 'success', text: 'ส่งลิงก์หมัศจรรย์ไปที่อีเมลแล้ว!' });
            } else if (mode === 'register') {
                await signUp(email, password);
                setMessage({ type: 'success', text: 'สมัครสมาชิกสำเร็จ! กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ' });
            } else {
                await signInWithPassword(email, password);
                // On success, auth state change will redirect/close overlay
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-overlay">
            <div className="login-card">
                <div className="login-header">
                    <h1 className="app-title">NzBill</h1>
                    <p className="app-subtitle">จัดการบิลแบบชิลๆ กับน้องเมย์</p>
                </div>

                <div className="login-tabs">
                    <button
                        className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => switchMode('login')}
                    >
                        🔐 เข้าสู่ระบบ
                    </button>
                    <button
                        className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
                        onClick={() => switchMode('register')}
                    >
                        ✨ สมัครสมาชิก
                    </button>
                </div>

                <div className="login-content">
                    {message && (
                        <div className={`login-message ${message.type}`}>
                            {message.type === 'error' ? '❌ ' : '✅ '}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="email-form">
                        <div className="login-input-wrapper">
                            <input
                                type="email"
                                className="login-input"
                                placeholder="📧 อีเมลของคุณ"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        {mode !== 'magic' && (
                            <div className="login-input-wrapper">
                                <input
                                    type="password"
                                    className="login-input"
                                    placeholder="🔒 รหัสผ่าน"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                    minLength={6}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary login-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading-spinner">◌ กำลังประมวลผล...</span>
                            ) : (
                                mode === 'login' ? '🔓 เข้าสู่ระบบเลย' :
                                    mode === 'register' ? '🚀 เริ่มใช้งานเลย' : '💌 ส่งลิงก์วิเศษ'
                            )}
                        </button>
                    </form>

                    <div className="login-footer-links">
                        {mode !== 'magic' ? (
                            <button className="link-btn" onClick={() => switchMode('magic')}>
                                🪄 ใช้ Magic Link แทน
                            </button>
                        ) : (
                            <button className="link-btn" onClick={() => switchMode('login')}>
                                🏠 กลับหน้าล็อกอินปกติ
                            </button>
                        )}
                    </div>

                    <div className="login-divider">
                        <span>หรือ</span>
                    </div>

                    <button
                        type="button"
                        className="btn btn-google login-btn"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <span className="google-icon">G</span>
                        เข้าสู่ระบบด้วย Google
                    </button>
                </div>
            </div>
        </div>
    );
};
