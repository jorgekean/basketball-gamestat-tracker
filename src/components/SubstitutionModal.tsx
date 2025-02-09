// src/components/SubstitutionModal.tsx
import React, { useState, useEffect } from 'react';
import { useGameContext, Player } from '../context/GameContext';
import { FaTimes } from 'react-icons/fa';

interface SubstitutionModalProps {
    closeModal: () => void;
    defaultSubOutId?: string;
}

const SubstitutionModal: React.FC<SubstitutionModalProps> = ({ closeModal, defaultSubOutId }) => {
    const { gameState, substitutePlayer } = useGameContext();
    const [selectedOutId, setSelectedOutId] = useState<string>(defaultSubOutId || '');
    const [selectedInId, setSelectedInId] = useState<string>('');

    // If defaultSubOutId changes, update state accordingly.
    useEffect(() => {
        setSelectedOutId(defaultSubOutId || '');
    }, [defaultSubOutId]);

    const onCourtPlayers = gameState.players.filter(p => p.onCourt);
    const benchPlayers = gameState.players.filter(p => !p.onCourt);

    const handleSubstitute = () => {
        if (selectedOutId && selectedInId) {
            substitutePlayer(selectedOutId, selectedInId);
            closeModal();
        } else {
            alert('Please select both a player to sub out and a player to sub in.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg w-11/12 md:w-1/2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-center">Substitute Player</h2>
                    <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
                        <FaTimes size={24} />
                    </button>
                </div>
                <div className="mb-4">
                    <h3 className="font-semibold">Player to Sub Out:</h3>
                    <select
                        value={selectedOutId}
                        onChange={(e) => setSelectedOutId(e.target.value)}
                        className="w-full border rounded p-2"
                    >
                        <option value="">--Select Player--</option>
                        {onCourtPlayers.map((player: Player) => (
                            <option key={player.id} value={player.id}>
                                {player.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <h3 className="font-semibold">Player to Sub In:</h3>
                    <select
                        value={selectedInId}
                        onChange={(e) => setSelectedInId(e.target.value)}
                        className="w-full border rounded p-2"
                    >
                        <option value="">--Select Player--</option>
                        {benchPlayers.map((player: Player) => (
                            <option key={player.id} value={player.id}>
                                {player.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={closeModal}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubstitute}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        Substitute
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubstitutionModal;
