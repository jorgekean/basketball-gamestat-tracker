// src/components/GameSelector.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GameSelector: React.FC = () => {
    const [gameId, setGameId] = useState<string>('');
    const navigate = useNavigate();

    const handleSelectGame = () => {
        if (gameId.trim() !== '') {
            navigate(`/game/${gameId.trim()}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-extrabold mb-6">Select or Create a Game</h1>
            <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="Enter game id (e.g., game1)"
                className="border rounded p-3 mb-4 w-72"
            />
            <button
                onClick={handleSelectGame}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow transition"
            >
                Start Game
            </button>
        </div>
    );
};

export default GameSelector;
