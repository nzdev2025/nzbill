import { useEffect, useRef } from 'react';
import type { CharacterExpression } from '../../types';
import './SpeechBubble.css';

export interface SpeechBubbleProps {
    text: string;
    speakerName?: string;
    expression?: CharacterExpression;
    isTyping?: boolean;
    showNotificationBtn?: boolean;
    onNotificationClick?: () => void;
    onClick?: () => void;
    className?: string;
}

export function SpeechBubble({
    text,
    speakerName = 'น้องเมย์',
    isTyping = false,
    showNotificationBtn = false,
    onNotificationClick,
    onClick,
    className = '',
}: SpeechBubbleProps) {
    const textRef = useRef<HTMLParagraphElement>(null);

    // Scroll to bottom when text changes
    useEffect(() => {
        if (textRef.current) {
            textRef.current.scrollTop = textRef.current.scrollHeight;
        }
    }, [text]);

    return (
        <div className={`speech-bubble ${className}`} onClick={onClick}>
            {/* Speaker name tag */}
            <div className="speech-bubble__header">
                <span className="speech-bubble__speaker">{speakerName}</span>

                {/* Notification button */}
                {showNotificationBtn && (
                    <button
                        className="speech-bubble__notify-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onNotificationClick?.();
                        }}
                    >
                        <span className="speech-bubble__notify-icon">🔔</span>
                        <span>แจ้งเตือน</span>
                    </button>
                )}
            </div>

            {/* Dialog text */}
            <p ref={textRef} className="speech-bubble__text">
                {text}
                {isTyping && <span className="speech-bubble__cursor">|</span>}
            </p>

            {/* Click indicator */}
            {!isTyping && (
                <div className="speech-bubble__indicator">
                    <span className="speech-bubble__arrow">▼</span>
                </div>
            )}
        </div>
    );
}

export default SpeechBubble;
