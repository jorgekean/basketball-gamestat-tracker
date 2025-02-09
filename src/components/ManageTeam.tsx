// src/components/ManageTeam.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaArrowLeft, FaCloudUploadAlt, FaCloudDownloadAlt } from 'react-icons/fa';

interface TeamPlayer {
    id: string;
    name: string;
    jerseyNumber: string;
    position: string;
}

interface Team {
    teamName: string;
    players: TeamPlayer[];
}

const ManageTeam: React.FC = () => {
    const { teamName } = useParams<{ teamName: string }>();
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);
    const [playerName, setPlayerName] = useState('');
    const [jerseyNumber, setJerseyNumber] = useState('');
    const [position, setPosition] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!teamName) return;
        const fetchTeam = async () => {
            try {
                const teamDoc = await getDoc(doc(db, 'teams', encodeURIComponent(teamName)));
                if (teamDoc.exists()) {
                    setTeam(teamDoc.data() as Team);
                } else {
                    alert('Team not found');
                }
            } catch (error) {
                console.error('Error fetching team:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, [teamName]);

    const addPlayer = async () => {
        if (!playerName.trim() || !jerseyNumber.trim() || !position.trim()) {
            alert('Please fill all fields for the player.');
            return;
        }
        if (!team) return;
        const newPlayer: TeamPlayer = {
            id: Date.now().toString(),
            name: playerName.trim(),
            jerseyNumber: jerseyNumber.trim(),
            position: position.trim(),
        };
        const updatedPlayers = [...team.players, newPlayer];
        const updatedTeam = { ...team, players: updatedPlayers };
        try {
            await setDoc(doc(db, 'teams', encodeURIComponent(teamName!)), updatedTeam);
            setTeam(updatedTeam);
            setPlayerName('');
            setJerseyNumber('');
            setPosition('');
        } catch (error) {
            console.error('Error updating team:', error);
            alert('Error updating team');
        }
    };

    const removePlayer = async (playerId: string) => {
        if (!team) return;
        const updatedPlayers = team.players.filter(p => p.id !== playerId);
        const updatedTeam = { ...team, players: updatedPlayers };
        try {
            await setDoc(doc(db, 'teams', encodeURIComponent(teamName!)), updatedTeam);
            setTeam(updatedTeam);
        } catch (error) {
            console.error('Error removing player:', error);
            alert('Error removing player');
        }
    };

    // Manual sync functions for team management
    const syncTeamToFirestore = async () => {
        if (!team) return;
        try {
            await setDoc(doc(db, 'teams', encodeURIComponent(teamName!)), team);
            alert("Team synced to Firestore successfully!");
        } catch (error) {
            console.error("Error syncing team to Firestore:", error);
            alert("Error syncing team to Firestore");
        }
    };

    const syncTeamFromFirestore = async () => {
        try {
            const teamDoc = await getDoc(doc(db, 'teams', encodeURIComponent(teamName!)));
            if (teamDoc.exists()) {
                const teamData = teamDoc.data() as Team;
                setTeam(teamData);
                alert("Team synced from Firestore successfully!");
            } else {
                alert("Team not found in Firestore");
            }
        } catch (error) {
            console.error("Error syncing team from Firestore:", error);
            alert("Error syncing team from Firestore");
        }
    };

    if (loading) {
        return (
            <div className="p-4 text-center">
                <h1 className="text-2xl font-bold">Loading team...</h1>
            </div>
        );
    }

    if (!team) {
        return <div className="p-4 text-center">Team not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header with Back and Sync Buttons */}
            <div className="mb-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800">
                    <FaArrowLeft className="mr-2" /> Back
                </button>
                <div className="flex space-x-2">
                    <button
                        onClick={syncTeamToFirestore}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded transition"
                        title="Sync Team to Firestore"
                    >
                        <FaCloudUploadAlt className="w-4 h-4" />
                    </button>
                    <button
                        onClick={syncTeamFromFirestore}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition"
                        title="Sync Team from Firestore"
                    >
                        <FaCloudDownloadAlt className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <h1 className="text-3xl font-bold text-center mb-6">Manage Team: {team.teamName}</h1>
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Players</h2>
                {team.players.length === 0 ? (
                    <p>No players added yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {team.players.map(player => (
                            <li key={player.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
                                <div>
                                    <p className="font-semibold">{player.name}</p>
                                    <p className="text-sm">Jersey: {player.jerseyNumber} | Position: {player.position}</p>
                                </div>
                                <button
                                    onClick={() => removePlayer(player.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="border p-4 rounded bg-white shadow">
                <h2 className="text-xl font-bold mb-4">Add New Player</h2>
                <div className="grid grid-cols-1 gap-4">
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
                    <button
                        onClick={addPlayer}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Add Player
                    </button>
                </div>
            </div>
            <div className="mt-6 text-center">
                <Link to="/teams" className="text-blue-600 hover:text-blue-800 underline">
                    Back to Team Manager
                </Link>
            </div>
        </div>
    );
};

export default ManageTeam;
