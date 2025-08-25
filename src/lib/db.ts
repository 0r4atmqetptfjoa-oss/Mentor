import Dexie, { Table } from 'dexie';

export interface Question { id: number; categorie: string }
export interface Summary { id: number; topic: string }
export interface Progress { key?: number; qid: number; correct: boolean; ts: number }
export interface KV { key: string; value: unknown }
export interface Mistake { id?: number; qid: number; ts: number }
export interface Flashcard { id?: number; topic: string; front: string; back?: string; createdAt?: number }
export interface Badge { id: string; earnedAt: number }

class AppDB extends Dexie {
  questions!: Table<Question, number>
  summaries!: Table<Summary, number>
  progress!: Table<Progress, number>
  kv!: Table<KV, string>
  mistakes!: Table<Mistake, number>
  flashcards!: Table<Flashcard, number>
  badges!: Table<Badge, string>

  constructor() {
    super('mentor');
    this.version(2).stores({
      questions: 'id,categorie',
      summaries: 'id,topic',
      progress: '++key,qid,correct,ts',
      kv: 'key',
      mistakes: '++id,qid,ts',
      flashcards: '++id,topic,front',
      badges: 'id,earnedAt'
    }).upgrade(async () => {
      // non-destructive migration placeholder
    });
  }
}

export const db = new AppDB();
