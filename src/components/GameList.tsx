// src/components/GameList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import NewGameModal from './NewGameModal';

interface GameItem {
    id: string;
}

const GameList: React.FC = () => {
    const [games, setGames] = useState<GameItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showNewGameModal, setShowNewGameModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'games'));
                const gameItems: GameItem[] = [];
                querySnapshot.forEach((doc) => {
                    gameItems.push({ id: doc.id });
                });
                setGames(gameItems);
            } catch (error) {
                console.error('Error fetching games:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    if (loading) {
        return (
            <div className="p-4 text-center">
                <h1 className="text-2xl font-bold">Loading games...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Select a Game</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {games.map((game) => (
                    <div
                        key={game.id}
                        onClick={() => navigate(`/game/${encodeURIComponent(game.id)}`)}
                        className="cursor-pointer p-4 bg-white rounded shadow hover:bg-gray-100 transition"
                    >
                        <p className="text-lg font-semibold">Game: {game.id}</p>
                    </div>
                ))}
            </div>
            <div className="mt-6 text-center space-y-4 space-x-4">
                <button
                    onClick={() => setShowNewGameModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow transition"
                >
                    Create New Game
                </button>
                <Link
                    to="/teams"
                    className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg shadow transition"
                >
                    Manage Teams
                </Link>
            </div>
            {showNewGameModal && (
                <NewGameModal closeModal={() => setShowNewGameModal(false)} />
            )}
        </div>
    );
};

export default GameList;
