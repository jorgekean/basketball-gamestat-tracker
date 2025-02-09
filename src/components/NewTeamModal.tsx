// src/components/NewTeamModal.tsx
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface NewTeamModalProps {
    closeModal: () => void;
}

interface TeamPlayer {
    id: string;
    name: string;
    jerseyNumber: string;
    position: string;
}

const NewTeamModal: React.FC<NewTeamModalProps> = ({ closeModal }) => {
    const [teamName, setTeamName] = useState('');
    const [players, setPlayers] = useState<TeamPlayer[]>([]);
    const [playerName, setPlayerName] = useState('');
    const [jerseyNumber, setJerseyNumber] = useState('');
    const [position, setPosition] = useState('');

    const addPlayer = () => {
        if (!playerName.trim() || !jerseyNumber.trim() || !position.trim()) {
            alert('Please fill all fields for the player.');
            return;
        }
        const newPlayer: TeamPlayer = {
            id: Date.now().toString(),
            name: playerName.trim(),
            jerseyNumber: jerseyNumber.trim(),
            position: position.trim(),
        };
        setPlayers(prev => [...prev, newPlayer]);
        setPlayerName('');
        setJerseyNumber('');
        setPosition('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamName.trim()) {
            alert('Please enter a team name.');
            return;
        }
        if (players.length === 0) {
            alert('Please add at least one player.');
            return;
        }
        try {
            await setDoc(doc(db, 'teams', encodeURIComponent(teamName.trim())), {
                teamName: teamName.trim(),
                players,
            });
            closeModal();
        } catch (error) {
            console.error('Error creating team:', error);
            alert('Error creating team');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Create New Team</h2>
                    <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
                        <FaTimes size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-semibold">Team Name</label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full border rounded p-2"
                            placeholder="Enter team name"
                        />
                    </div>
                    <div className="border p-4 rounded">
                        <h3 className="font-bold mb-2">Add Players</h3>
                        <div className="grid grid-cols-1 gap-2">
                            <input
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                className="border rounded p-2"
                                placeholder="Player Name"
                            />
                            <input
                                type="text"
                                value={jerseyNumber}
                                onChange={(e) => setJerseyNumber(e.target.value)}
                                className="border rounded p-2"
                                placeholder="Jersey Number"
                            />
                            <input
                                type="text"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                className="border rounded p-2"
                                placeholder="Position"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={addPlayer}
                            className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                            Add Player
                        </button>
                        {players.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-semibold">Players Added:</h4>
                                <ul className="list-disc ml-5">
                                    {players.map((p) => (
                                        <li key={p.id}>
                                            {p.name} (#{p.jerseyNumber}) - {p.position}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                            Create Team
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewTeamModal;
