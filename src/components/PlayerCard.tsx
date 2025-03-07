// src/components/PlayerCard.tsx
import React from 'react';
import { Player, useGameContext } from '../context/GameContext';

interface PlayerCardProps {
    player: Player;
    onSubOut: (playerId: string) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onSubOut }) => {
    const { updatePlayerStat } = useGameContext();

    const totalPoints =
        player.stats.freeThrowMade +
        player.stats.twoPtMade * 2 +
        player.stats.threePtMade * 3;

    return (
        <div className="border rounded p-3 shadow-sm flex flex-col space-y-2">
            <h2 className="text-center text-lg font-bold">{player.name}</h2>

            {/* Row 1: Points Actions */}
            <div className="flex justify-around gap-2">
                {/* Free Throw Group */}
                <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold mb-1">Free Throw</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => {
                                updatePlayerStat(player.id, 'freeThrowMade');
                                updatePlayerStat(player.id, 'freeThrowAttempt');
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-md transition-all duration-200 ease-in-out transform active:scale-95"
                        >
                            Made
                        </button>
                        <button
                            onClick={() => updatePlayerStat(player.id, 'freeThrowAttempt')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-md transition-all duration-200 ease-in-out transform active:scale-95"
                        >
                            Missed
                        </button>
                    </div>
                </div>

                {/* 2-Point Group */}
                <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold mb-1">2-Point</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => {
                                updatePlayerStat(player.id, 'twoPtMade');
                                updatePlayerStat(player.id, 'twoPtAttempt');
                            }}
                            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-md transition-all duration-200 ease-in-out transform active:scale-95"
                        >
                            Made
                        </button>
                        <button
                            onClick={() => updatePlayerStat(player.id, 'twoPtAttempt')}
                            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-md transition-all duration-200 ease-in-out transform active:scale-95"
                        >
                            Missed
                        </button>
                    </div>
                </div>

                {/* 3-Point Group */}
                <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold mb-1">3-Point</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => {
                                updatePlayerStat(player.id, 'threePtMade');
                                updatePlayerStat(player.id, 'threePtAttempt');
                            }}
                            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-md transition-all duration-200 ease-in-out transform active:scale-95"
                        >
                            Made
                        </button>
                        <button
                            onClick={() => updatePlayerStat(player.id, 'threePtAttempt')}
                            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-md transition-all duration-200 ease-in-out transform active:scale-95"
                        >
                            Missed
                        </button>
                    </div>
                </div>
            </div>

            {/* Row 2: Other Actions */}
            <div className="flex justify-around gap-2">
                {/* Assist */}
                <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold mb-1">Assist</span>
                    <button
                        onClick={() => updatePlayerStat(player.id, 'assists')}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-md transition-all duration-200 ease-in-out transform active:scale-95"
                    >
                        +
                    </button>
                </div>
                {/* Rebound */}
                <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold mb-1">Rebound</span>
                    <button
                        onClick={() => updatePlayerStat(player.id, 'rebounds')}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-md transition-all duration-200 ease-in-out transform active:scale-95"
                    >
                        +
                    </button>
                </div>
                {/* Steal */}
                <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold mb-1">Steal</span>
                    <button
                        onClick={() => updatePlayerStat(player.id, 'steals')}
                        className="bg-sky-500 hover:bg-sky-600 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-md transition-all duration-200 ease-in-out transform active:scale-95"
                    >
                        +
                    </button>
                </div>
                {/* Block */}
                <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold mb-1">Block</span>
                    <button
                        onClick={() => updatePlayerStat(player.id, 'blocks')}
                        className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-md transition-all duration-200 ease-in-out transform active:scale-95"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Row 3: Summary Stats and Sub Out */}
            <div className="flex items-center justify-between text-sm border-t pt-2">
                <div>
                    <div>Total: {totalPoints}</div>
                    <div className="grid grid-cols-2 gap-1 text-xs sm:text-sm">
                        <div>FT: {player.stats.freeThrowMade}/{player.stats.freeThrowAttempt}</div>
                        <div>2PT: {player.stats.twoPtMade}/{player.stats.twoPtAttempt}</div>
                        <div>3PT: {player.stats.threePtMade}/{player.stats.threePtAttempt}</div>
                        <div>
                            A: {player.stats.assists} R: {player.stats.rebounds} S: {player.stats.steals} B: {player.stats.blocks}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => onSubOut(player.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-md transition-all duration-200 ease-in-out transform active:scale-95"
                >
                    Sub Out
                </button>
            </div>
        </div>
    );
};

export default PlayerCard;