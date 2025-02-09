// src/db.ts
import { openDB } from 'idb';

const DB_NAME = 'game-stats-db';
const STORE_NAME = 'game-stats';

export async function getDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        }
    });
}

export async function getLocalGameStats(gameId: string) {
    const db = await getDB();
    return db.get(STORE_NAME, `gameStats-${gameId}`);
}

export async function setLocalGameStats(gameId: string, gameStats: any) {
    const db = await getDB();
    return db.put(STORE_NAME, gameStats, `gameStats-${gameId}`);
}
