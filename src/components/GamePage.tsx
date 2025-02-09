// src/components/GamePage.tsx
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import GameTracker from './GameTracker';
import { GameProvider } from '../context/GameContext';

const GamePage: React.FC = () => {
    const { gameName } = useParams<{ gameName: string }>();
    const location = useLocation();
    const team = location.state?.team; // Optional team data

    if (!gameName) {
        return <div>Error: No game selected.</div>;
    }

    return (
        <GameProvider gameName={gameName} team={team}>
            <GameTracker />
        </GameProvider>
    );
};

export default GamePage;
