// src/db.ts
import Dexie from 'dexie';

export interface Participant {
    id?: number; // Auto-incremented primary key
    name: string;
    contactNumber: string;
    age: number;
    gender: string;
    event: string;
    donationAmount: number,
    registrationDate: Date;
}

class FunRunDatabase extends Dexie {
    participants: Dexie.Table<Participant, number>;

    constructor() {
        super('FunRunDatabase');
        this.version(1).stores({
            participants: '++id, name, contactNumber, age, gender, event, donationAmount, registrationDate',
        });
        this.participants = this.table('participants');
    }
}

export const db = new FunRunDatabase();