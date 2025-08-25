import { db } from './db';

export async function setKV(key: string, value: unknown) {
  await db.kv.put({ key, value });
}

export async function getKV<T = unknown>(key: string, fallback: T | null = null): Promise<T | null> {
  const res = await db.kv.get(key);
  return (res as any)?.value ?? fallback;
}
