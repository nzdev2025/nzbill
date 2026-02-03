import type { CharacterExpression } from '../types';

// Default Character Assets (School Uniform)
import mayIdle from '../assets/characters/may_idle.png';
import mayHappy from '../assets/characters/may_happy.png';
import mayWorried from '../assets/characters/may_worried.png';
import mayThinking from '../assets/characters/may_thinking.png';

// In a real app, you might import different assets for other costumes.
// For now, we reuse assets as placeholders or use the same ones.

export interface CharacterAsset {
    id: string;
    name: string;
    description: string;
    isLocked: boolean;
    price: number; // 0 for free
    assets: Record<CharacterExpression, string>;
}

export const CHARACTERS: CharacterAsset[] = [
    {
        id: 'may_school',
        name: 'น้องเม (ชุดนักเรียน)',
        description: 'ชุดนักเรียนสดใส แก่นแก้วตามวัย',
        isLocked: false,
        price: 0,
        assets: {
            idle: mayIdle,
            happy: mayHappy,
            worried: mayWorried,
            thinking: mayThinking,
            angry: mayWorried, // Fallback
            excited: mayHappy, // Fallback
            surprised: mayHappy, // Fallback
        }
    },
    {
        id: 'may_evening',
        name: 'น้องเม (ชุดราตรี)',
        description: 'ชุดราตรีหรูหรา สำหรับค่ำคืนพิเศษ',
        isLocked: false, // Unlocked for user to try
        price: 0,
        assets: {
            idle: mayIdle, // Placeholder: User can replace file in assets folder
            happy: mayHappy,
            worried: mayWorried,
            thinking: mayThinking,
            angry: mayWorried,
            excited: mayHappy,
            surprised: mayHappy,
        }
    },
    {
        id: 'may_casual',
        name: 'น้องเม (ชุดลำลอง)',
        description: 'ชุดลำลองสบายๆ ในวันหยุด',
        isLocked: false,
        price: 0,
        assets: {
            idle: mayIdle, // Placeholder
            happy: mayHappy,
            worried: mayWorried,
            thinking: mayThinking,
            angry: mayWorried,
            excited: mayHappy,
            surprised: mayHappy,
        }
    }
];

export const DEFAULT_CHARACTER_ID = 'may_school';
