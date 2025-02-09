// src/components/PlayerCard.tsx
import React from 'react';
import { Player, useGameContext } from '../context/GameContext';

interface PlayerCardProps {
    player: Player;
    onSubOut: (playerId: string) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onSubOut }) => {
    const { updatePlayerStat } = useGameContext();

    // Local state for popover visibility for scoring buttons
    const [showOnePtPopover, setShowOnePtPopover] = React.useState(false);
    const [showTwoPtPopover, setShowTwoPtPopover] = React.useState(false);
    const [showThreePtPopover, setShowThreePtPopover] = React.useState(false);

    const togglePopover = (group: '1Pt' | '2Pts' | '3Pts') => {
        if (group === '1Pt') {
            setShowOnePtPopover(!showOnePtPopover);
            setShowTwoPtPopover(false);
            setShowThreePtPopover(false);
        } else if (group === '2Pts') {
            setShowTwoPtPopover(!showTwoPtPopover);
            setShowOnePtPopover(false);
            setShowThreePtPopover(false);
        } else if (group === '3Pts') {
            setShowThreePtPopover(!showThreePtPopover);
            setShowOnePtPopover(false);
            setShowTwoPtPopover(false);
        }
    };

    const totalPoints =
        player.stats.freeThrowMade +
        player.stats.twoPtMade * 2 +
        player.stats.threePtMade * 3;

    return (
        <div className="border rounded p-4 shadow-sm relative">
            <h2 className="text-center text-xl font-bold mb-4">{player.name}</h2>

            <div className="flex flex-wrap gap-2 justify-center">
                {/* 1Pt Button with popover for Free Throws */}
                <div className="relative">
                    <button
                        onClick={() => togglePopover('1Pt')}
                        className="bg-blue-500 text-white px-3 py-2 rounded"
                    >
                        1Pt
                    </button>
                    {showOnePtPopover && (
                        <div className="absolute z-10 bg-white border rounded shadow p-2 mt-1">
                            <button
                                onClick={() => {
                                    updatePlayerStat(player.id, 'freeThrowMade');
                                    updatePlayerStat(player.id, 'freeThrowAttempt');
                                    setShowOnePtPopover(false);
                                }}
                                className="block text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 w-full text-left"
                            >
                                FT Made
                            </button>
                            <button
                                onClick={() => {
                                    updatePlayerStat(player.id, 'freeThrowAttempt');
                                    setShowOnePtPopover(false);
                                }}
                                className="block text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 w-full text-left"
                            >
                                FT Missed
                            </button>
                        </div>
                    )}
                </div>

                {/* 2Pts Button with popover for 2-point shots */}
                <div className="relative">
                    <button
                        onClick={() => togglePopover('2Pts')}
                        className="bg-blue-500 text-white px-3 py-2 rounded"
                    >
                        2Pts
                    </button>
                    {showTwoPtPopover && (
                        <div className="absolute z-10 bg-white border rounded shadow p-2 mt-1">
                            <button
                                onClick={() => {
                                    updatePlayerStat(player.id, 'twoPtMade');
                                    updatePlayerStat(player.id, 'twoPtAttempt');
                                    setShowTwoPtPopover(false);
                                }}
                                className="block text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 w-full text-left"
                            >
                                2PT Made
                            </button>
                            <button
                                onClick={() => {
                                    updatePlayerStat(player.id, 'twoPtAttempt');
                                    setShowTwoPtPopover(false);
                                }}
                                className="block text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 w-full text-left"
                            >
                                2PT Missed
                            </button>
                        </div>
                    )}
                </div>

                {/* 3Pts Button with popover for 3-point shots */}
                <div className="relative">
                    <button
                        onClick={() => togglePopover('3Pts')}
                        className="bg-blue-500 text-white px-3 py-2 rounded"
                    >
                        3Pts
                    </button>
                    {showThreePtPopover && (
                        <div className="absolute z-10 bg-white border rounded shadow p-2 mt-1">
                            <button
                                onClick={() => {
                                    updatePlayerStat(player.id, 'threePtMade');
                                    updatePlayerStat(player.id, 'threePtAttempt');
                                    setShowThreePtPopover(false);
                                }}
                                className="block text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 w-full text-left"
                            >
                                3PT Made
                            </button>
                            <button
                                onClick={() => {
                                    updatePlayerStat(player.id, 'threePtAttempt');
                                    setShowThreePtPopover(false);
                                }}
                                className="block text-sm text-gray-700 hover:bg-gray-200 px-2 py-1 w-full text-left"
                            >
                                3PT Missed
                            </button>
                        </div>
                    )}
                </div>

                {/* Direct buttons for Assists, Rebounds, and Steals */}
                <button
                    onClick={() => updatePlayerStat(player.id, 'assists')}
                    className="bg-green-500 text-white px-3 py-2 rounded"
                >
                    Asst
                </button>
                <button
                    onClick={() => updatePlayerStat(player.id, 'rebounds')}
                    className="bg-green-500 text-white px-3 py-2 rounded"
                >
                    Reb
                </button>
                <button
                    onClick={() => updatePlayerStat(player.id, 'steals')}
                    className="bg-green-500 text-white px-3 py-2 rounded"
                >
                    Stl
                </button>
            </div>

            {/* Stats summary and bottom row with total points and Sub Out button */}
            <div className="mt-4 border-t pt-2 text-xs text-gray-600">
                <div className="grid grid-cols-2 gap-2">
                    <div>FT Made: {player.stats.freeThrowMade}</div>
                    <div>FT Missed: {player.stats.freeThrowAttempt}</div>
                    <div>2PT Made: {player.stats.twoPtMade}</div>
                    <div>2PT Missed: {player.stats.twoPtAttempt}</div>
                    <div>3PT Made: {player.stats.threePtMade}</div>
                    <div>3PT Missed: {player.stats.threePtAttempt}</div>
                    <div>Reb: {player.stats.rebounds}</div>
                    <div>Stl: {player.stats.steals}</div>
                    <div>Asst: {player.stats.assists}</div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <div className="font-semibold text-sm text-gray-700">Total Points: {totalPoints}</div>
                    <button
                        onClick={() => onSubOut(player.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
                    >
                        Sub Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlayerCard;
