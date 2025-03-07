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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportPage: React.FC = () => {
    const { gameState, loading } = useGameContext();

    if (loading) {
        return (
            <div className="p-6 text-center">
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

    // Mapping for granular stats (made/attempt)
    const granularStats = {
        'FT%': `${teamStats.freeThrowMade}/${teamStats.freeThrowAttempt}`,
        '2PT%': `${teamStats.twoPtMade}/${teamStats.twoPtAttempt}`,
        '3PT%': `${teamStats.threePtMade}/${teamStats.threePtAttempt}`,
        'Overall FG%': `${teamStats.twoPtMade + teamStats.threePtMade}/${teamStats.twoPtAttempt + teamStats.threePtAttempt
            }`,
    };

    // Data for the horizontal bar chart.
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
                borderRadius: 8,
                borderSkipped: false,
            },
        ],
    };

    // Bar chart options with custom tooltip to show granular stats.
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
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const statLabel = context.label;
                        const percentage = context.parsed.x;
                        const madeAttempt = granularStats[statLabel] || '';
                        return `${statLabel}: ${percentage}% (${madeAttempt})`;
                    },
                },
            },
        },
    };

    // Helper functions for individual player reports.
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

    // Compute total points from shots only.
    const computeTotalPoints = (stats: typeof teamStats) => {
        return stats.freeThrowMade + (stats.twoPtMade * 2) + (stats.threePtMade * 3);
    };

    // total SP
    // Compute total points from shots only.
    const computeTotalSP = (stats: typeof teamStats) => {
        return (stats.assists * 2) + (stats.blocks * 2) + (stats.steals * 2) + stats.freeThrowMade + (stats.twoPtMade * 2) + (stats.threePtMade * 3);
    };


    // Sort players by total points (from shots) in descending order.
    const sortedPlayers = [...gameState.players].sort(
        (a, b) => computeTotalSP(b.stats) - computeTotalSP(a.stats)
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            <h1 className="text-3xl font-bold text-center mb-8">
                Game Report: {gameState.gameName}
            </h1>

            {/* Team Shooting Performance Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <div className="mb-4 text-center">
                    <p className="text-gray-700">
                        FT: {teamStats.freeThrowMade}/{teamStats.freeThrowAttempt} (
                        {teamFTPercentage.toFixed(1)}%)
                    </p>
                    <p className="text-gray-700">
                        2PT: {teamStats.twoPtMade}/{teamStats.twoPtAttempt} (
                        {team2PTPercentage.toFixed(1)}%)
                    </p>
                    <p className="text-gray-700">
                        3PT: {teamStats.threePtMade}/{teamStats.threePtAttempt} (
                        {team3PTPercentage.toFixed(1)}%)
                    </p>
                    <p className="text-gray-700">
                        Overall FG: {teamStats.twoPtMade + teamStats.threePtMade}/
                        {teamStats.twoPtAttempt + teamStats.threePtAttempt} (
                        {teamOverallFGPercentage.toFixed(1)}%)
                    </p>
                </div>
                <div className="w-full h-80">
                    <Bar data={barData} options={barOptions as any} />
                </div>
            </div>

            {/* Individual Player Reports Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    Individual Player Reports (Sorted by Total Points)
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Jersey</th>
                                <th className="py-3 px-4">FT</th>
                                <th className="py-3 px-4">2PT</th>
                                <th className="py-3 px-4">3PT</th>
                                <th className="py-3 px-4">Overall FG</th>
                                <th className="py-3 px-4">Total Points</th>
                                <th className="py-3 px-4">Rebounds</th>
                                <th className="py-3 px-4">Steals</th>
                                <th className="py-3 px-4">Assists</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPlayers.map((player) => {
                                const { ft, twoPt, threePt, overall } = computePercentages(player.stats);
                                const totalPoints = computeTotalPoints(player.stats);
                                const overallMade = player.stats.twoPtMade + player.stats.threePtMade;
                                const overallAttempt = player.stats.twoPtAttempt + player.stats.threePtAttempt;
                                return (
                                    <tr key={player.id} className="border-b hover:bg-gray-100">
                                        <td className="py-2 px-4">{player.name}</td>
                                        <td className="py-2 px-4">{player.jerseyNumber}</td>
                                        <td className="py-2 px-4">
                                            {ft.toFixed(1)}%
                                            <div className="text-xs text-gray-500">
                                                ({player.stats.freeThrowMade}/{player.stats.freeThrowAttempt})
                                            </div>
                                        </td>
                                        <td className="py-2 px-4">
                                            {twoPt.toFixed(1)}%
                                            <div className="text-xs text-gray-500">
                                                ({player.stats.twoPtMade}/{player.stats.twoPtAttempt})
                                            </div>
                                        </td>
                                        <td className="py-2 px-4">
                                            {threePt.toFixed(1)}%
                                            <div className="text-xs text-gray-500">
                                                ({player.stats.threePtMade}/{player.stats.threePtAttempt})
                                            </div>
                                        </td>
                                        <td className="py-2 px-4">
                                            {overall.toFixed(1)}%
                                            <div className="text-xs text-gray-500">
                                                ({overallMade}/{overallAttempt})
                                            </div>
                                        </td>
                                        <td className="py-2 px-4">{totalPoints}</td>
                                        <td className="py-2 px-4">{player.stats.rebounds}</td>
                                        <td className="py-2 px-4">{player.stats.steals}</td>
                                        <td className="py-2 px-4">{player.stats.assists}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Back to Home Button */}
            <div className="text-center mt-8">
                <Link
                    to="/"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow transition"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ReportPage;
