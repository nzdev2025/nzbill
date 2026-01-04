import { useEffect, useCallback } from 'react';
import './ConfirmDialog.css';

export interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'default' | 'danger';
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = 'ยืนยัน',
    cancelText = 'ยกเลิก',
    onConfirm,
    onCancel,
    variant = 'default',
}: ConfirmDialogProps) {
    // Handle escape key
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        },
        [onCancel]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
        <div className="confirm-dialog-overlay" onClick={onCancel} data-testid="confirm-dialog-overlay">
            <div
                className="confirm-dialog"
                onClick={(e) => e.stopPropagation()}
                role="alertdialog"
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-message"
            >
                <h2 id="confirm-dialog-title" className="confirm-dialog__title">
                    {title}
                </h2>
                <p id="confirm-dialog-message" className="confirm-dialog__message">
                    {message}
                </p>
                <div className="confirm-dialog__actions">
                    <button
                        className="btn btn-secondary"
                        onClick={onCancel}
                        data-testid="confirm-dialog-cancel"
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
                        onClick={onConfirm}
                        data-testid="confirm-dialog-confirm"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
