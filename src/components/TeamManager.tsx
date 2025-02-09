// src/components/TeamManager.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import NewTeamModal from './NewTeamModal';

interface Team {
    teamName: string;
    players: {
        id: string;
        name: string;
        jerseyNumber: string;
        position: string;
    }[];
}

const TeamManager: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showNewTeamModal, setShowNewTeamModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'teams'));
                const teamList: Team[] = [];
                querySnapshot.forEach((doc) => {
                    teamList.push(doc.data() as Team);
                });
                setTeams(teamList);
            } catch (error) {
                console.error('Error fetching teams:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    if (loading) {
        return (
            <div className="p-4 text-center">
                <h1 className="text-2xl font-bold">Loading teams...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Team Manager</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teams.map((team) => (
                    <div
                        key={team.teamName}
                        className="p-4 bg-white rounded shadow hover:bg-gray-100 transition cursor-pointer"
                        onClick={() => navigate(`/teams/${encodeURIComponent(team.teamName)}`)}
                    >
                        <h2 className="text-xl font-bold">{team.teamName}</h2>
                        <p className="text-sm">Players: {team.players.length}</p>
                    </div>
                ))}
            </div>
            <div className="mt-6 text-center">
                <button
                    onClick={() => setShowNewTeamModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow transition"
                >
                    Create New Team
                </button>
            </div>
            {showNewTeamModal && <NewTeamModal closeModal={() => setShowNewTeamModal(false)} />}
            <div className="mt-6 text-center">
                <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
                    Back to Game List
                </Link>
            </div>
        </div>
    );
};

export default TeamManager;
