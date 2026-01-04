import { useMemo } from 'react';
import type { CharacterExpression } from '../../types';
import './Character.css';

// Import character sprites
import mayIdle from '../../assets/characters/may_idle.png';
import mayHappy from '../../assets/characters/may_happy.png';
import mayWorried from '../../assets/characters/may_worried.png';
import mayThinking from '../../assets/characters/may_thinking.png';

// Sprite mapping
const SPRITES: Record<CharacterExpression, string> = {
    idle: mayIdle,
    happy: mayHappy,
    worried: mayWorried,
    angry: mayWorried, // Use worried as fallback
    excited: mayHappy, // Use happy as fallback (removed excited)
    surprised: mayHappy, // Use happy as fallback
    thinking: mayThinking,
};

export interface CharacterProps {
    expression?: CharacterExpression;
    isBlinking?: boolean;
    isTalking?: boolean;
    size?: 'small' | 'medium' | 'large';
    onClick?: () => void;
    className?: string;
}

export function Character({
    expression = 'idle',
    isBlinking = false,
    isTalking = false,
    size = 'large',
    onClick,
    className = '',
}: CharacterProps) {
    // Get current sprite based on expression
    const currentSprite = useMemo(() => {
        return SPRITES[expression] || SPRITES.idle;
    }, [expression]);

    // Generate class names
    const classNames = [
        'character',
        `character--${size}`,
        isBlinking ? 'character--blinking' : '',
        isTalking ? 'character--talking' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classNames} onClick={onClick}>
            <div className="character__sprite-wrapper">
                <img
                    src={currentSprite}
                    alt="น้องเมย์"
                    className="character__sprite"
                    draggable={false}
                />
            </div>
        </div>
    );
}

export default Character;
