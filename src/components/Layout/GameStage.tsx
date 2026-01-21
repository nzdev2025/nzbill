import React from 'react';
import { Character, SpeechBubble } from '../Character';
import type { CharacterExpression } from '../../types';

interface GameStageProps {
    backgroundImage: string;
    character: {
        expression: CharacterExpression;
        isBlinking: boolean;
        isTalking: boolean;
        onClick: () => void;
    };
    speechBubble?: {
        text: string;
        isTyping: boolean;
        onClick: () => void;
    };
    children?: React.ReactNode;
}

export const GameStage: React.FC<GameStageProps> = ({
    backgroundImage,
    character,
    speechBubble,
    children
}) => {
    return (
        <div
            className="game-stage"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            {/* Children elements (Header, Overlays, etc.) - rendered first to be under character if needed, 
          but usually overlays are z-indexed higher. 
          In App.tsx original structure, Header was first, then Character. 
          Let's keep children structure flexible. 
      */}
            {children}

            {/* Character Layer */}
            <div className="character-layer">
                <Character
                    expression={character.expression}
                    isBlinking={character.isBlinking}
                    isTalking={character.isTalking}
                    onClick={character.onClick}
                    size="large"
                />
            </div>

            {/* Speech Bubble Layer */}
            {speechBubble && speechBubble.text && (
                <div className="speech-layer">
                    <SpeechBubble
                        text={speechBubble.text}
                        isTyping={speechBubble.isTyping}
                        onClick={speechBubble.onClick}
                    />
                </div>
            )}
        </div>
    );
};
