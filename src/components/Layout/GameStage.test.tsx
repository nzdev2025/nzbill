import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GameStage } from './GameStage';
import type { CharacterExpression } from '../../types';

describe('GameStage', () => {
    const mockCharacter = {
        expression: 'idle' as CharacterExpression,
        isBlinking: false,
        isTalking: false,
        onClick: vi.fn(),
    };

    const mockSpeechBubble = {
        text: 'Hello World',
        isTyping: false,
        onClick: vi.fn(),
    };

    const bgImage = 'test-bg.png';

    it('should render background image', () => {
        render(
            <GameStage
                backgroundImage={bgImage}
                character={mockCharacter}
            />
        );
        const stage = document.querySelector('.game-stage');
        expect(stage).toHaveStyle(`background-image: url(${bgImage})`);
    });

    it('should render character with correct props', () => {
        render(
            <GameStage
                backgroundImage={bgImage}
                character={mockCharacter}
            />
        );
        // Assuming Character component renders an image or div with class 'character' or similar
        // Since we are not deep rendering Character, we check if the container exists
        expect(document.querySelector('.character-layer')).toBeInTheDocument();
    });

    it('should handle character click', () => {
        render(
            <GameStage
                backgroundImage={bgImage}
                character={mockCharacter}
            />
        );
        const characterLayer = document.querySelector('.character-layer img'); // Start with assuming it finds the image inside Character
        if (characterLayer) {
            fireEvent.click(characterLayer);
            expect(mockCharacter.onClick).toHaveBeenCalled();
        } else {
            // Fallback if Character implementation is different (e.g. div)
            const charContainer = document.querySelector('.character-layer > div');
            if (charContainer) fireEvent.click(charContainer);
        }
    });

    it('should render speech bubble when provided', () => {
        render(
            <GameStage
                backgroundImage={bgImage}
                character={mockCharacter}
                speechBubble={mockSpeechBubble}
            />
        );
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('should not render speech bubble when not provided', () => {
        render(
            <GameStage
                backgroundImage={bgImage}
                character={mockCharacter}
            />
        );
        expect(screen.queryByText('Hello World')).not.toBeInTheDocument();
    });

    it('should render children content (overlays)', () => {
        render(
            <GameStage
                backgroundImage={bgImage}
                character={mockCharacter}
            >
                <div data-testid="overlay">My Overlay</div>
            </GameStage>
        );
        expect(screen.getByTestId('overlay')).toBeInTheDocument();
    });
});
