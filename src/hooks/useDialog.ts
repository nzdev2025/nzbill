import { useState, useCallback, useEffect, useRef } from 'react';
import type { DialogLine, CharacterExpression } from '../types';

export interface UseDialogReturn {
    currentText: string;
    isTyping: boolean;
    currentExpression: CharacterExpression;
    showDialog: (lines: DialogLine[]) => void;
    showSingleMessage: (text: string, expression?: CharacterExpression) => void;
    skipTyping: () => void;
    nextLine: () => void;
    isComplete: boolean;
    hasMoreLines: boolean;
}

export interface UseDialogOptions {
    typingSpeed?: number; // ms per character
    onComplete?: () => void;
    onExpressionChange?: (expression: CharacterExpression) => void;
}

export function useDialog(options: UseDialogOptions = {}): UseDialogReturn {
    const {
        typingSpeed = 30,
        onComplete,
        onExpressionChange
    } = options;

    const [currentText, setCurrentText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentExpression, setCurrentExpression] = useState<CharacterExpression>('idle');
    const [isComplete, setIsComplete] = useState(true);

    const linesRef = useRef<DialogLine[]>([]);
    const currentLineIndexRef = useRef(0);
    const fullTextRef = useRef('');
    const typingIntervalRef = useRef<number | null>(null);

    // Clear typing interval
    const clearTypingInterval = useCallback(() => {
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
        }
    }, []);

    // Type text character by character
    const typeText = useCallback((text: string, expression: CharacterExpression) => {
        clearTypingInterval();

        fullTextRef.current = text;
        setCurrentText('');
        setIsTyping(true);
        setCurrentExpression(expression);
        onExpressionChange?.(expression);

        let charIndex = 0;

        typingIntervalRef.current = window.setInterval(() => {
            if (charIndex < text.length) {
                setCurrentText(text.substring(0, charIndex + 1));
                charIndex++;
            } else {
                clearTypingInterval();
                setIsTyping(false);
            }
        }, typingSpeed);
    }, [typingSpeed, clearTypingInterval, onExpressionChange]);

    // Show dialog lines
    const showDialog = useCallback((lines: DialogLine[]) => {
        if (lines.length === 0) return;

        linesRef.current = lines;
        currentLineIndexRef.current = 0;
        setIsComplete(false);

        const firstLine = lines[0];
        typeText(firstLine.text, firstLine.expression);
    }, [typeText]);

    // Show single message
    const showSingleMessage = useCallback((
        text: string,
        expression: CharacterExpression = 'idle'
    ) => {
        linesRef.current = [{ id: 'single', text, expression }];
        currentLineIndexRef.current = 0;
        setIsComplete(false);
        typeText(text, expression);
    }, [typeText]);

    // Skip typing animation
    const skipTyping = useCallback(() => {
        if (isTyping) {
            clearTypingInterval();
            setCurrentText(fullTextRef.current);
            setIsTyping(false);
        }
    }, [isTyping, clearTypingInterval]);

    // Go to next line
    const nextLine = useCallback(() => {
        if (isTyping) {
            skipTyping();
            return;
        }

        const nextIndex = currentLineIndexRef.current + 1;

        if (nextIndex < linesRef.current.length) {
            currentLineIndexRef.current = nextIndex;
            const nextLineData = linesRef.current[nextIndex];
            typeText(nextLineData.text, nextLineData.expression);
        } else {
            setIsComplete(true);
            onComplete?.();
        }
    }, [isTyping, skipTyping, typeText, onComplete]);

    // Check if there are more lines
    const hasMoreLines = currentLineIndexRef.current < linesRef.current.length - 1 || isTyping;

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearTypingInterval();
        };
    }, [clearTypingInterval]);

    return {
        currentText,
        isTyping,
        currentExpression,
        showDialog,
        showSingleMessage,
        skipTyping,
        nextLine,
        isComplete,
        hasMoreLines,
    };
}

export default useDialog;
