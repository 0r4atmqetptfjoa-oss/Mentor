import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getStreak } from '../modules/streak/streak';

export default function Missions() {
  const [s, setS] = useState({ current: 0, longest: 0, lastDone: null as string | null });
  useEffect(() => {
    getStreak().then(setS);
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="p-4 flex-1 space-y-4">
        <h2 className="text-2xl font-bold">Misiunea zilei</h2>
        <p>Rezolvă 10 întrebări corect azi pentru a continua streak-ul.</p>
        <div className="mt-4">Streak curent: <b>{s.current}</b> — Maxim: <b>{s.longest}</b></div>
      </main>
    </div>
  );
}
