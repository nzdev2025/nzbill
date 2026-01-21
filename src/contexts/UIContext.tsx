import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Toast } from '../components/Common/Toast';
import { ConfirmDialog } from '../components/Common/ConfirmDialog';

interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'danger';
    onConfirm: () => void;
    onCancel?: () => void;
}

interface UIContextType {
    showToast: (message: string) => void;
    confirm: (options: ConfirmOptions) => void;
}

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
    const [confirmDialog, setConfirmDialog] = useState<ConfirmOptions & { isOpen: boolean }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
    });

    const showToast = useCallback((message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => setToast({ message: '', visible: false }), 3000);
    }, []);

    const confirm = useCallback((options: ConfirmOptions) => {
        setConfirmDialog({ ...options, isOpen: true });
    }, []);

    const handleConfirm = useCallback(() => {
        confirmDialog.onConfirm();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
    }, [confirmDialog]);

    const handleCancel = useCallback(() => {
        if (confirmDialog.onCancel) confirmDialog.onCancel();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
    }, [confirmDialog]);

    return (
        <UIContext.Provider value={{ showToast, confirm }}>
            {children}
            <Toast message={toast.message} visible={toast.visible} />
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                confirmText={confirmDialog.confirmText}
                cancelText={confirmDialog.cancelText}
                variant={confirmDialog.variant}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
