import { useEffect, useState } from 'react';
import { getStreak } from '../modules/streak/streak';

export default function StreakBar() {
  const [s, setS] = useState({ current: 0, longest: 0, lastDone: null as string | null });
  useEffect(() => {
    getStreak().then(setS);
  }, []);
  return (
    <div className="flex items-center gap-2" aria-label="streak">
      <span role="img" aria-label="fire">🔥</span>
      <span className="font-bold">{s.current}</span>
      <span className="text-sm text-slate-500">Max {s.longest}</span>
    </div>
  );
}
