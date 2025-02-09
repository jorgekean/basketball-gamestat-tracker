// src/components/GameTracker.tsx
import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import PlayerCard from './PlayerCard';
import SubstitutionModal from './SubstitutionModal';
import { FaCloudUploadAlt, FaCloudDownloadAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const GameTracker: React.FC = () => {
    const { gameState, syncToFirestore, syncFromFirestore, loading } = useGameContext();
    const [showSubModal, setShowSubModal] = useState(false);
    const [defaultSubOutId, setDefaultSubOutId] = useState<string>('');
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="p-4 text-center">
                <h1 className="text-2xl font-bold">Loading game data...</h1>
            </div>
        );
    }

    // Filter for on-court players (assumed to be the "first five")
    const onCourtPlayers = gameState.players.filter((player) => player.onCourt);

    // Calculate team total points from all players.
    const teamTotalPoints = gameState.players.reduce((total, player) => {
        const playerPoints =
            player.stats.freeThrowMade +
            player.stats.twoPtMade * 2 +
            player.stats.threePtMade * 3;
        return total + playerPoints;
    }, 0);

    // Function to open the substitution modal pre-populated with the sub-out candidate.
    const openSubModal = (playerId: string) => {
        setDefaultSubOutId(playerId);
        setShowSubModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sticky header */}
            <div className="sticky top-0 z-50 bg-gray-50 shadow-md p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-extrabold">Game Tracker</h1>
                    <div className="flex flex-col items-end">
                        <div className="flex space-x-2">
                            <button
                                onClick={syncToFirestore}
                                className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded transition"
                                title="Sync to Firestore"
                            >
                                <FaCloudUploadAlt className="w-4 h-4" />
                            </button>
                            <button
                                onClick={syncFromFirestore}
                                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition"
                                title="Sync from Firestore"
                            >
                                <FaCloudDownloadAlt className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="mt-1 text-gray-800 text-sm font-bold whitespace-nowrap">
                            Team Total Points: {teamTotalPoints}
                        </div>
                        {/* New "View Report" button */}
                        <button
                            onClick={() => navigate(`/report/${encodeURIComponent(gameState.gameName)}`)}
                            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                            View Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content with player cards */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {onCourtPlayers.map((player) => (
                        <PlayerCard key={player.id} player={player} onSubOut={openSubModal} />
                    ))}
                </div>
            </div>

            {showSubModal && (
                <SubstitutionModal
                    defaultSubOutId={defaultSubOutId}
                    closeModal={() => setShowSubModal(false)}
                />
            )}
        </div>
    );
};

export default GameTracker;
