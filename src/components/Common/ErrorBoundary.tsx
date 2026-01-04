import { Component, type ErrorInfo, type ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can log to an error reporting service here
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div
                    className="error-boundary"
                    data-testid="error-boundary-fallback"
                >
                    <div className="error-boundary__content">
                        <div className="error-boundary__icon">😢</div>
                        <h2 className="error-boundary__title">
                            เกิดข้อผิดพลาดขึ้นค่ะ
                        </h2>
                        <p className="error-boundary__message">
                            น้องเมย์ขอโทษด้วยนะคะ มีบางอย่างผิดพลาด
                        </p>
                        <p className="error-boundary__detail">
                            {this.state.error?.message}
                        </p>
                        <button
                            className="error-boundary__button"
                            onClick={this.handleReload}
                        >
                            🔄 โหลดใหม่
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
