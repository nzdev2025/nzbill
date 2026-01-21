import React from 'react';
import { AnalyticsDashboard } from '../Analytics/AnalyticsDashboard';
import type { Bill } from '../../types';
import './AnalyticsOverlay.css';

interface AnalyticsOverlayProps {
    bills: Bill[];
}

export const AnalyticsOverlay: React.FC<AnalyticsOverlayProps> = () => {
    return (
        <div className="overlay-panel">
            <div className="overlay-tabs">
                <button className="overlay-tab active">สถิติการใช้จ่าย</button>
            </div>
            <div className="overlay-content p-0 bg-gray-50 dark:bg-gray-900">
                <AnalyticsDashboard />
            </div>
        </div>
    );
};

export default AnalyticsOverlay;
