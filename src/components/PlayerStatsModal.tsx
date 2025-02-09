// src/components/PlayerStatsModal.tsx
import React from 'react';
import { Player, useGameContext } from '../context/GameContext';
import { FaTimes, FaPlus } from 'react-icons/fa';

interface PlayerStatsModalProps {
    player: Player;
    closeModal: () => void;
}

const PlayerStatsModal: React.FC<PlayerStatsModalProps> = ({ player, closeModal }) => {
    const { updatePlayerStat } = useGameContext();

    // Define all available stats.
    const allStats = [
        { label: "Free Throw Attempt", stat: "freeThrowAttempt" as const },
        { label: "Free Throw Made", stat: "freeThrowMade" as const },
        { label: "2PT Attempt", stat: "twoPtAttempt" as const },
        { label: "2PT Made", stat: "twoPtMade" as const },
        { label: "3PT Attempt", stat: "threePtAttempt" as const },
        { label: "3PT Made", stat: "threePtMade" as const },
        { label: "Rebounds", stat: "rebounds" as const },
        { label: "Steals", stat: "steals" as const },
        { label: "Assists", stat: "assists" as const },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6 relative">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                >
                    <FaTimes size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center">
                    {player.name} - All Stats
                </h2>
                <div className="space-y-3">
                    {allStats.map((item) => (
                        <div key={item.stat} className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                {item.label}: {player.stats[item.stat]}
                            </span>
                            <button
                                onClick={() => updatePlayerStat(player.id, item.stat)}
                                className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full w-7 h-7 transition"
                            >
                                <FaPlus size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlayerStatsModal;
