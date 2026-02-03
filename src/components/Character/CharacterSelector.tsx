import React from 'react';
import { useCharacterSystem } from '../../hooks/useCharacterSystem';
import './CharacterSelector.css';

interface CharacterSelectorProps {
    onSelect?: () => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ onSelect }) => {
    const {
        availableCharacters,
        currentCharacterId,
        setCharacterId,
        unlockCharacter
    } = useCharacterSystem();

    const handleSelect = (id: string, isLocked: boolean) => {
        if (isLocked) {
            unlockCharacter(id);
            return;
        }
        setCharacterId(id);
        if (onSelect) onSelect();
    };

    return (
        <div className="character-selector">
            <h3 className="character-selector__title">เลือกชุดตัวละคร (The Wardrobe)</h3>
            <div className="character-grid">
                {availableCharacters.map((char) => (
                    <div
                        key={char.id}
                        className={`character-card ${char.id === currentCharacterId ? 'active' : ''} ${char.isLocked ? 'locked' : ''}`}
                        onClick={() => handleSelect(char.id, char.isLocked)}
                    >
                        <div className="character-card__image-wrapper">
                            <img
                                src={char.assets.idle}
                                alt={char.name}
                                className="character-card__image"
                            />
                            {char.isLocked && <div className="character-card__lock-icon">🔒</div>}
                        </div>
                        <div className="character-card__info">
                            <div className="character-card__name">{char.name}</div>
                            <div className="character-card__desc">{char.description}</div>
                        </div>
                        {char.id === currentCharacterId && (
                            <div className="character-card__badge">ใช้อยู่</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CharacterSelector;
