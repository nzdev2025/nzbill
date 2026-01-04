import { useState, useEffect, useCallback, useRef } from 'react';
import type { CharacterExpression } from '../types';

export interface UseCharacterAnimationReturn {
    isBlinking: boolean;
    isTalking: boolean;
    currentExpression: CharacterExpression;
    setExpression: (expression: CharacterExpression) => void;
    startTalking: () => void;
    stopTalking: () => void;
    triggerBlink: () => void;
    playHappyAnimation: () => void;
    playWorriedAnimation: () => void;
}

export function useCharacterAnimation(
    initialExpression: CharacterExpression = 'idle'
): UseCharacterAnimationReturn {
    const [isBlinking, setIsBlinking] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    const [currentExpression, setCurrentExpression] = useState<CharacterExpression>(initialExpression);

    const blinkTimeoutRef = useRef<number | null>(null);
    const expressionTimeoutRef = useRef<number | null>(null);

    // Trigger a single blink - defined before useEffect that uses it
    const triggerBlinkFn = useCallback(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
    }, []);

    // Auto-blink every 3-5 seconds
    useEffect(() => {
        const scheduleNextBlink = () => {
            const delay = 3000 + Math.random() * 2000; // 3-5 seconds
            blinkTimeoutRef.current = window.setTimeout(() => {
                triggerBlinkFn();
                scheduleNextBlink();
            }, delay);
        };

        scheduleNextBlink();

        return () => {
            if (blinkTimeoutRef.current) {
                clearTimeout(blinkTimeoutRef.current);
            }
        };
    }, [triggerBlinkFn]);

    // Set expression
    const setExpression = useCallback((expression: CharacterExpression) => {
        setCurrentExpression(expression);
    }, []);

    // Start talking animation
    const startTalking = useCallback(() => {
        setIsTalking(true);
    }, []);

    // Stop talking animation
    const stopTalking = useCallback(() => {
        setIsTalking(false);
    }, []);

    // Play happy animation (change expression temporarily)
    const playHappyAnimation = useCallback(() => {
        setCurrentExpression((prev) => {
            expressionTimeoutRef.current = window.setTimeout(() => {
                setCurrentExpression(prev);
            }, 2000);
            return 'happy';
        });
    }, []);

    // Play worried animation
    const playWorriedAnimation = useCallback(() => {
        setCurrentExpression((prev) => {
            expressionTimeoutRef.current = window.setTimeout(() => {
                setCurrentExpression(prev);
            }, 2000);
            return 'worried';
        });
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (blinkTimeoutRef.current) {
                clearTimeout(blinkTimeoutRef.current);
            }
            if (expressionTimeoutRef.current) {
                clearTimeout(expressionTimeoutRef.current);
            }
        };
    }, []);

    return {
        isBlinking,
        isTalking,
        currentExpression,
        setExpression,
        startTalking,
        stopTalking,
        triggerBlink: triggerBlinkFn,
        playHappyAnimation,
        playWorriedAnimation,
    };
}

export default useCharacterAnimation;
