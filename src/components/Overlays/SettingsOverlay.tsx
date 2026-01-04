import React from 'react';
import { useProfile, useAuth } from '../../hooks';
import { useTheme } from '../../contexts/ThemeContext';
import type { AppSettings } from '../../types';
import './SettingsOverlay.css';

interface SettingsOverlayProps {
    onEditBalance: () => void;
}

export const SettingsOverlay: React.FC<SettingsOverlayProps> = ({ onEditBalance }) => {
    const { profile, updateSettings } = useProfile();
    const { signOut } = useAuth();
    const { theme, setTheme } = useTheme();

    // Default settings fallback
    const settings = profile?.settings || {
        soundEnabled: true,
        notificationsEnabled: true,
        language: 'th' as const,
    };

    const handleToggleSound = () => {
        updateSettings({
            ...settings,
            soundEnabled: !settings.soundEnabled
        } as AppSettings);
    };

    const handleToggleNotifications = () => {
        updateSettings({
            ...settings,
            notificationsEnabled: !settings.notificationsEnabled
        } as AppSettings);
    };

    const handleLanguageChange = () => {
        updateSettings({
            ...settings,
            language: settings.language === 'th' ? 'en' : 'th'
        } as AppSettings);
    };

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <div className="overlay-panel overlay-panel--settings">
            <div className="settings-header">
                <span className="settings-icon">⚙️</span>
                <span className="settings-title">ตั้งค่า</span>
            </div>
            <div className="settings-list">
                <div className="settings-row">
                    <span>เสียง</span>
                    <button
                        className={`toggle ${settings.soundEnabled ? 'active' : ''}`}
                        onClick={handleToggleSound}
                        aria-label="เปิด/ปิดเสียง"
                        data-testid="toggle-sound"
                    />
                </div>
                <div className="settings-row">
                    <span>การแจ้งเตือน</span>
                    <button
                        className={`toggle ${settings.notificationsEnabled ? 'active' : ''}`}
                        onClick={handleToggleNotifications}
                        aria-label="เปิด/ปิดการแจ้งเตือน"
                        data-testid="toggle-notifications"
                    />
                </div>
                <div className="settings-row">
                    <span>ภาษา</span>
                    <button
                        className="settings-btn"
                        onClick={handleLanguageChange}
                        data-testid="toggle-language"
                    >
                        {settings.language === 'th' ? '🇹🇭 ไทย' : '🇺🇸 English'}
                    </button>
                </div>
                <div className="settings-row">
                    <span>ธีม</span>
                    <button
                        className="settings-btn"
                        onClick={() => {
                            if (theme === 'light') setTheme('dark');
                            else if (theme === 'dark') setTheme('auto');
                            else setTheme('light');
                        }}
                        data-testid="toggle-theme"
                    >
                        {theme === 'light' && '☀️ สว่าง'}
                        {theme === 'dark' && '🌙 มืด'}
                        {theme === 'auto' && '🔄 อัตโนมัติ'}
                    </button>
                </div>
                <div className="settings-row">
                    <span>ข้อมูลการเงิน</span>
                    <button
                        className="settings-btn"
                        onClick={onEditBalance}
                        data-testid="edit-balance"
                    >
                        แก้ไขยอดเงิน
                    </button>
                </div>
                <div className="settings-row">
                    <button
                        className="settings-btn settings-btn--danger"
                        onClick={handleLogout}
                        data-testid="logout-btn"
                    >
                        ออกจากระบบ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsOverlay;
