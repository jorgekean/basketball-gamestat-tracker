// src/components/ManualEditModal.tsx
import React, { useState, useEffect } from 'react';
import { useGameContext, Player } from '../context/GameContext';

interface ManualEditModalProps {
    closeModal: () => void;
}

const ManualEditModal: React.FC<ManualEditModalProps> = ({ closeModal }) => {
    const { gameState, updatePlayers } = useGameContext();
    const [editedPlayers, setEditedPlayers] = useState<Player[]>(gameState.players);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        setEditedPlayers(gameState.players);
    }, [gameState.players]);

    const handleChange = (
        playerId: string,
        statKey: keyof Player['stats'],
        value: number
    ) => {
        setEditedPlayers((prevPlayers) =>
            prevPlayers.map((player) =>
                player.id === playerId
                    ? { ...player, stats: { ...player.stats, [statKey]: value } }
                    : player
            )
        );
    };

    // Filter players based on search term
    const filteredPlayers = editedPlayers.filter((player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = () => {
        updatePlayers(editedPlayers);
        closeModal();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold mb-4">Manual Edit Stats</h2>
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search players..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Scrollable Player Stats */}
                <div className="overflow-y-auto flex-1 p-4">
                    {filteredPlayers.map((player) => (
                        <div key={player.id} className="mb-4 p-4 border rounded-lg shadow-sm">
                            <h3 className="font-semibold text-lg mb-3">{player.name}</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(player.stats).map(([statKey, value]) => (
                                    <div key={statKey} className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-600">
                                            {statKey.charAt(0).toUpperCase() + statKey.slice(1)}
                                        </label>
                                        <input
                                            type="number"
                                            value={value}
                                            onChange={(e) =>
                                                handleChange(
                                                    player.id,
                                                    statKey as keyof Player['stats'],
                                                    parseInt(e.target.value) || 0
                                                )
                                            }
                                            className="mt-1 border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sticky Footer with Buttons */}
                <div className="sticky bottom-0 bg-white p-4 border-t">
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={closeModal}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-4 py-2 rounded-md transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManualEditModal;