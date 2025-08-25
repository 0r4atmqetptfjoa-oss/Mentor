export type Streak = { current: number; longest: number; lastDone: string | null };
import { getKV, setKV } from '../../lib/kv';
import { db } from '../../lib/db';

const KEY = 'streak';

export function todayKey(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export async function getStreak(): Promise<Streak> {
  return await getKV(KEY, { current: 0, longest: 0, lastDone: null });
}

export async function setStreak(s: Streak) {
  await setKV(KEY, s);
}

export async function completeDailyMission({ correctCount, target = 10 }: { correctCount: number; target?: number }) {
  if (correctCount < target) return;
  const t = todayKey();
  const s = await getStreak();
  if (s.lastDone === t) return;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const yesterday = todayKey(y);
  const current = s.lastDone === yesterday ? s.current + 1 : 1;
  const longest = Math.max(s.longest, current);
  await setStreak({ current, longest, lastDone: t });
  await maybeAssignBadge({ current });
}

async function maybeAssignBadge({ current }: { current: number }) {
  const thresholds = [1, 3, 7, 14, 21, 30, 45, 60];
  const ids = ['soldat', 'fruntas', 'caporal', 'sergent', 'plutonier', 'slt', 'lt', 'cpt'];
  const idx = thresholds.findIndex((x, i) => current === x && ids[i]);
  if (idx >= 0) {
    const id = ids[idx];
    const exists = await db.badges.get(id);
    if (!exists) await db.badges.put({ id, earnedAt: Date.now() });
  }
}
