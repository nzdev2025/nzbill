import React from 'react';
import './LoadingScreen.css';

// Import character for loading
import mayIdle from '../../assets/characters/may_idle.png';

interface LoadingScreenProps {
    message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
    message = 'กำลังโหลด...'
}) => {
    return (
        <div className="loading-screen" data-testid="loading-screen">
            <div className="loading-screen__content">
                {/* Character silhouette */}
                <div className="loading-screen__character">
                    <img
                        src={mayIdle}
                        alt="น้องเมย์"
                        className="loading-screen__character-img"
                    />
                </div>

                {/* Spinner */}
                <div
                    className="loading-screen__spinner"
                    data-testid="loading-spinner"
                />

                {/* Message */}
                <p className="loading-screen__message">{message}</p>

                {/* Subtitle */}
                <p className="loading-screen__subtitle">
                    น้องเมย์กำลังเตรียมข้อมูลให้นะคะ~
                </p>
            </div>
        </div>
    );
};

export default LoadingScreen;
