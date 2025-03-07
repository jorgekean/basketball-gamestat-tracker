// src/context/GameContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getLocalGameStats, setLocalGameStats } from '../db';
import { db, doc, setDoc, getDoc } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

export interface Stat {
    freeThrowAttempt: number;
    freeThrowMade: number;
    twoPtAttempt: number;
    twoPtMade: number;
    threePtAttempt: number;
    threePtMade: number;
    rebounds: number;
    steals: number;
    assists: number;
    blocks: number;
}

export interface Player {
    id: string;
    name: string;
    jerseyNumber: string;
    position: string;
    stats: Stat;
    onCourt: boolean;
}

export interface GameState {
    gameName: string;
    players: Player[];
    teamStats: Stat;
}

export interface Team {
    teamName: string;
    players: {
        id: string;
        name: string;
        jerseyNumber: string;
        position: string;
    }[];
}

interface GameContextProps {
    gameState: GameState;
    updatePlayerStat: (playerId: string, statKey: keyof Stat, delta?: number) => void;
    substitutePlayer: (outPlayerId: string, inPlayerId: string) => void;
    setPlayersOnCourt: (onCourtPlayerIds: string[]) => void;
    syncToFirestore: () => Promise<void>;
    syncFromFirestore: () => Promise<void>;
    loading: boolean;
    updatePlayers: (newPlayers: Player[]) => void; // NEW: bulk update function
}

const defaultStat: Stat = {
    freeThrowAttempt: 0,
    freeThrowMade: 0,
    twoPtAttempt: 0,
    twoPtMade: 0,
    threePtAttempt: 0,
    threePtMade: 0,
    rebounds: 0,
    steals: 0,
    assists: 0,
    blocks: 0,
};

const createDefaultPlayers = (): Player[] => [
    { id: uuidv4(), name: 'Player 1', jerseyNumber: '1', position: 'N/A', stats: { ...defaultStat }, onCourt: true },
    { id: uuidv4(), name: 'Player 2', jerseyNumber: '2', position: 'N/A', stats: { ...defaultStat }, onCourt: true },
    { id: uuidv4(), name: 'Player 3', jerseyNumber: '3', position: 'N/A', stats: { ...defaultStat }, onCourt: true },
    { id: uuidv4(), name: 'Player 4', jerseyNumber: '4', position: 'N/A', stats: { ...defaultStat }, onCourt: true },
    { id: uuidv4(), name: 'Player 5', jerseyNumber: '5', position: 'N/A', stats: { ...defaultStat }, onCourt: true },
    { id: uuidv4(), name: 'Player 6', jerseyNumber: '6', position: 'N/A', stats: { ...defaultStat }, onCourt: false },
    { id: uuidv4(), name: 'Player 7', jerseyNumber: '7', position: 'N/A', stats: { ...defaultStat }, onCourt: false },
    { id: uuidv4(), name: 'Player 8', jerseyNumber: '8', position: 'N/A', stats: { ...defaultStat }, onCourt: false },
];

const defaultGameState: GameState = {
    gameName: 'New Game',
    players: createDefaultPlayers(),
    teamStats: { ...defaultStat },
};

const GameContext = createContext<GameContextProps | undefined>(undefined);

interface GameProviderProps {
    children: React.ReactNode;
    gameName: string;
    team?: Team;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children, gameName, team }) => {
    const [gameState, setGameState] = useState<GameState>(defaultGameState);
    const [initialized, setInitialized] = useState(false);

    const initializePlayersFromTeam = (team: Team): Player[] => {
        return team.players.map((p, index) => ({
            id: p.id,
            name: p.name,
            jerseyNumber: p.jerseyNumber,
            position: p.position,
            stats: { ...defaultStat },
            onCourt: index < 5,
        }));
    };

    useEffect(() => {
        (async () => {
            const localData = await getLocalGameStats(gameName);
            if (localData) {
                setGameState(localData);
            } else {
                let newState: GameState;
                if (team) {
                    newState = { gameName, players: initializePlayersFromTeam(team), teamStats: { ...defaultStat } };
                } else {
                    newState = { ...defaultGameState, gameName };
                }
                await setLocalGameStats(gameName, newState);
                setGameState(newState);
            }
            setInitialized(true);
        })();
    }, [gameName, team]);

    useEffect(() => {
        if (!initialized) return;
        setLocalGameStats(gameName, gameState);
    }, [gameState, gameName, initialized]);

    const updatePlayerStat = (playerId: string, statKey: keyof Stat, delta: number = 1) => {
        setGameState(prevState => {
            const updatedPlayers = prevState.players.map(player =>
                player.id === playerId
                    ? { ...player, stats: { ...player.stats, [statKey]: player.stats[statKey] + delta } }
                    : player
            );
            const updatedTeamStats = { ...prevState.teamStats, [statKey]: prevState.teamStats[statKey] + delta };
            return { ...prevState, players: updatedPlayers, teamStats: updatedTeamStats };
        });
    };

    const substitutePlayer = (outPlayerId: string, inPlayerId: string) => {
        setGameState(prevState => {
            const updatedPlayers = prevState.players.map(player => {
                if (player.id === outPlayerId) return { ...player, onCourt: false };
                if (player.id === inPlayerId) return { ...player, onCourt: true };
                return player;
            });
            return { ...prevState, players: updatedPlayers };
        });
    };

    const setPlayersOnCourt = (onCourtPlayerIds: string[]) => {
        setGameState(prevState => {
            const updatedPlayers = prevState.players.map(player => ({
                ...player,
                onCourt: onCourtPlayerIds.includes(player.id),
            }));
            return { ...prevState, players: updatedPlayers };
        });
    };

    const updatePlayers = (newPlayers: Player[]) => {
        setGameState(prevState => ({ ...prevState, players: newPlayers }));
    };

    const syncToFirestore = async () => {
        try {
            await setDoc(doc(db, 'games', gameName), gameState);
            console.log('Game state synced to Firestore successfully!');
        } catch (error) {
            console.error('Error syncing to Firestore:', error);
        }
    };

    const syncFromFirestore = async () => {
        try {
            const docRef = doc(db, 'games', gameName);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const remoteData = docSnap.data() as GameState;
                setGameState(remoteData);
                await setLocalGameStats(gameName, remoteData);
                console.log('Game state synced from Firestore successfully!');
            } else {
                console.log('No game data found in Firestore for this game.');
            }
        } catch (error) {
            console.error('Error syncing from Firestore:', error);
        }
    };

    return (
        <GameContext.Provider
            value={{
                gameState,
                updatePlayerStat,
                substitutePlayer,
                setPlayersOnCourt,
                syncToFirestore,
                syncFromFirestore,
                loading: !initialized,
                updatePlayers, // NEW function exposed here
            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
};
