// src/components/PlayerSelectionModal.tsx
import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';

interface PlayerSelectionModalProps {
    closeModal: () => void;
}

const PlayerSelectionModal: React.FC<PlayerSelectionModalProps> = ({ closeModal }) => {
    const { gameState, setPlayersOnCourt } = useGameContext();
    // Initialize selection with the IDs of players who are on court.
    const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(
        gameState.players.filter(player => player.onCourt).map(player => player.id)
    );

    useEffect(() => {
        // Update the selection whenever the gameState changes.
        setSelectedPlayerIds(gameState.players.filter(player => player.onCourt).map(player => player.id));
    }, [gameState.players]);

    const togglePlayerSelection = (playerId: string) => {
        if (selectedPlayerIds.includes(playerId)) {
            setSelectedPlayerIds(selectedPlayerIds.filter(id => id !== playerId));
        } else {
            setSelectedPlayerIds([...selectedPlayerIds, playerId]);
        }
    };

    const handleSave = () => {
        setPlayersOnCourt(selectedPlayerIds);
        closeModal();
    };

    // Sort players so that those "In" come first.
    const sortedPlayers = [...gameState.players].sort((a, b) => {
        const aSelected = selectedPlayerIds.includes(a.id);
        const bSelected = selectedPlayerIds.includes(b.id);
        if (aSelected === bSelected) return 0;
        return aSelected ? -1 : 1;
    });

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-center">Select Players On Court</h2>
                </div>

                {/* Scrollable Player List */}
                <div className="overflow-y-auto flex-1 p-4">
                    <div className="space-y-2">
                        {sortedPlayers.map(player => (
                            <div key={player.id} className="flex items-center justify-between p-2 border rounded">
                                <span className="text-sm font-medium">
                                    {player.name} ({player.jerseyNumber})
                                </span>
                                <button
                                    onClick={() => togglePlayerSelection(player.id)}
                                    className={`px-3 py-1 rounded transition ${selectedPlayerIds.includes(player.id)
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-300 text-black'
                                        }`}
                                >
                                    {selectedPlayerIds.includes(player.id) ? 'In' : 'Out'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sticky Footer with Buttons */}
                <div className="sticky bottom-0 bg-white p-4 border-t">
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={closeModal}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerSelectionModal;