// src/components/ReportPageWrapper.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { GameProvider } from '../context/GameContext';
import ReportPage from './ReportPage';

const ReportPageWrapper: React.FC = () => {
    const { gameName } = useParams<{ gameName: string }>();
    if (!gameName) {
        return <div>Error: No game selected.</div>;
    }
    return (
        <GameProvider gameName={gameName}>
            <ReportPage />
        </GameProvider>
    );
};

export default ReportPageWrapper;
