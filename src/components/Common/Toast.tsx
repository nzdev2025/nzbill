
export interface ToastProps {
    message: string;
    visible: boolean;
}

export function Toast({ message, visible }: ToastProps) {
    if (!visible) return null;

    return (
        <div className="toast-notification" role="status">
            {message}
        </div>
    );
}
