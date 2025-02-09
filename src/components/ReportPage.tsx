// src/components/ReportPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the necessary components for Bar charts.
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportPage: React.FC = () => {
    const { gameState, loading } = useGameContext();

    if (loading) {
        return (
            <div className="p-4 text-center">
                <h1 className="text-2xl font-bold">Loading report...</h1>
            </div>
        );
    }

    // Extract team stats from gameState.
    const teamStats = gameState.teamStats;

    // Compute team shooting percentages.
    const teamFTPercentage =
        teamStats.freeThrowAttempt > 0
            ? (teamStats.freeThrowMade / teamStats.freeThrowAttempt) * 100
            : 0;
    const team2PTPercentage =
        teamStats.twoPtAttempt > 0
            ? (teamStats.twoPtMade / teamStats.twoPtAttempt) * 100
            : 0;
    const team3PTPercentage =
        teamStats.threePtAttempt > 0
            ? (teamStats.threePtMade / teamStats.threePtAttempt) * 100
            : 0;
    const teamOverallFGPercentage =
        teamStats.twoPtAttempt + teamStats.threePtAttempt > 0
            ? ((teamStats.twoPtMade + teamStats.threePtMade) /
                (teamStats.twoPtAttempt + teamStats.threePtAttempt)) *
            100
            : 0;

    // Prepare data for a horizontal bar chart.
    const barData = {
        labels: ['FT%', '2PT%', '3PT%', 'Overall FG%'],
        datasets: [
            {
                label: 'Team Shooting Percentage',
                data: [
                    Number(teamFTPercentage.toFixed(1)),
                    Number(team2PTPercentage.toFixed(1)),
                    Number(team3PTPercentage.toFixed(1)),
                    Number(teamOverallFGPercentage.toFixed(1)),
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                ],
            },
        ],
    };

    const barOptions = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { beginAtZero: true, max: 100 },
        },
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Team Shooting Performance' },
        },
    };

    // Helper function to compute individual shooting percentages.
    const computePercentages = (stats: typeof teamStats) => {
        const ft =
            stats.freeThrowAttempt > 0
                ? (stats.freeThrowMade / stats.freeThrowAttempt) * 100
                : 0;
        const twoPt =
            stats.twoPtAttempt > 0 ? (stats.twoPtMade / stats.twoPtAttempt) * 100 : 0;
        const threePt =
            stats.threePtAttempt > 0 ? (stats.threePtMade / stats.threePtAttempt) * 100 : 0;
        const overall =
            stats.twoPtAttempt + stats.threePtAttempt > 0
                ? ((stats.twoPtMade + stats.threePtMade) /
                    (stats.twoPtAttempt + stats.threePtAttempt)) *
                100
                : 0;
        return { ft, twoPt, threePt, overall };
    };

    // Helper to compute individual total points.
    const computeTotalPoints = (stats: typeof teamStats) => {
        return stats.freeThrowMade + stats.twoPtMade * 2 + stats.threePtMade * 3;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6">
                Game Report: {gameState.gameName}
            </h1>

            {/* Team Shooting Report (Horizontal Bar Chart) */}
            <div className="mb-8">
                <div className="mb-4 text-center">
                    <p>Overall FG% (2PT+3PT): {teamOverallFGPercentage.toFixed(1)}%</p>
                    <p>FT%: {teamFTPercentage.toFixed(1)}%</p>
                    <p>2PT%: {team2PTPercentage.toFixed(1)}%</p>
                    <p>3PT%: {team3PTPercentage.toFixed(1)}%</p>
                </div>
                <div className="w-full h-64">
                    <Bar data={barData} options={barOptions as any} />
                </div>
            </div>

            {/* Individual Player Reports */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Individual Player Reports
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">Name</th>
                                <th className="py-2 px-4 border">Jersey</th>
                                <th className="py-2 px-4 border">FT</th>
                                <th className="py-2 px-4 border">2PT</th>
                                <th className="py-2 px-4 border">3PT</th>
                                <th className="py-2 px-4 border">Overall FG</th>
                                <th className="py-2 px-4 border">Total Points</th>
                                <th className="py-2 px-4 border">Rebounds</th>
                                <th className="py-2 px-4 border">Steals</th>
                                <th className="py-2 px-4 border">Assists</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gameState.players.map((player) => {
                                const { ft, twoPt, threePt, overall } = computePercentages(player.stats);
                                const totalPoints = computeTotalPoints(player.stats);
                                const overallMade = player.stats.twoPtMade + player.stats.threePtMade;
                                const overallAttempt = player.stats.twoPtAttempt + player.stats.threePtAttempt;
                                return (
                                    <tr key={player.id}>
                                        <td className="py-2 px-4 border">{player.name}</td>
                                        <td className="py-2 px-4 border">{player.jerseyNumber}</td>
                                        <td className="py-2 px-4 border">
                                            {ft.toFixed(1)}%{' '}
                                            <span className="text-xs text-gray-600">
                                                ({player.stats.freeThrowMade}/{player.stats.freeThrowAttempt})
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border">
                                            {twoPt.toFixed(1)}%{' '}
                                            <span className="text-xs text-gray-600">
                                                ({player.stats.twoPtMade}/{player.stats.twoPtAttempt})
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border">
                                            {threePt.toFixed(1)}%{' '}
                                            <span className="text-xs text-gray-600">
                                                ({player.stats.threePtMade}/{player.stats.threePtAttempt})
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border">
                                            {overall.toFixed(1)}%{' '}
                                            <span className="text-xs text-gray-600">
                                                ({overallMade}/{overallAttempt})
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border">{totalPoints}</td>
                                        <td className="py-2 px-4 border">{player.stats.rebounds}</td>
                                        <td className="py-2 px-4 border">{player.stats.steals}</td>
                                        <td className="py-2 px-4 border">{player.stats.assists}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Link to go back to the Home page */}
            <div className="text-center mt-6">
                <Link
                    to="/"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow transition"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ReportPage;
