import './Header.css';

export interface HeaderProps {
    level?: number;
    balance?: number;
    onBalanceClick?: () => void;
}

export function Header({ level = 1, balance = 0, onBalanceClick }: HeaderProps) {
    // Format balance as Thai Baht
    const formatBalance = (amount: number): string => {
        return new Intl.NumberFormat('th-TH').format(amount);
    };

    return (
        <header className="app-header">
            {/* Level Badge */}
            <div className="level-badge">
                <span className="level-text">Lv.{level}</span>
            </div>

            {/* Balance Display */}
            <button className="balance-display" onClick={onBalanceClick}>
                <span className="money-icon">฿</span>
                <span className="balance-amount">{formatBalance(balance)}</span>
                <span className="balance-label">คงเหลือ</span>
            </button>
        </header>
    );
}

export default Header;
