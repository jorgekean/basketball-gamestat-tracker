// src/components/NewGameModal.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface NewGameModalProps {
    closeModal: () => void;
}

interface TeamItem {
    teamName: string;
    players: {
        id: string;
        name: string;
        jerseyNumber: string;
        position: string;
    }[];
}

const NewGameModal: React.FC<NewGameModalProps> = ({ closeModal }) => {
    const [gameName, setGameName] = useState('');
    const [teams, setTeams] = useState<TeamItem[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();

    // Preselect team if provided in navigation state.
    const stateTeam = location.state?.team as TeamItem | undefined;
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'teams'));
                const teamItems: TeamItem[] = [];
                querySnapshot.forEach((doc) => {
                    teamItems.push(doc.data() as TeamItem);
                });
                setTeams(teamItems);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };
        fetchTeams();
    }, []);

    useEffect(() => {
        if (stateTeam) {
            setSelectedTeam(stateTeam.teamName);
        }
    }, [stateTeam]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (gameName.trim() === '') {
            alert('Please enter a Game Name.');
            return;
        }
        if (!selectedTeam) {
            alert('Please select a team.');
            return;
        }
        const team = teams.find(t => t.teamName === selectedTeam);
        closeModal();
        navigate(`/game/${encodeURIComponent(gameName.trim())}`, { state: { team } });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Create New Game</h2>
                    <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
                        <FaTimes size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-semibold">Game Name</label>
                        <input
                            type="text"
                            value={gameName}
                            onChange={(e) => setGameName(e.target.value)}
                            className="w-full border rounded p-2"
                            placeholder="Enter game name"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">Select Team</label>
                        <select
                            value={selectedTeam}
                            onChange={(e) => setSelectedTeam(e.target.value)}
                            className="w-full border rounded p-2"
                        >
                            <option value="">-- Select a Team --</option>
                            {teams.map((team) => (
                                <option key={team.teamName} value={team.teamName}>
                                    {team.teamName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                            Create Game
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewGameModal;
