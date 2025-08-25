import { useEffect, useState } from 'react';

const STORAGE_KEY = 'install-dismissed-at';
const DAY = 86400000;

/**
 * Buton care afișează promptul de instalare PWA.
 * Se memorează refuzul pentru 24h pentru a evita spam-ul.
 */
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null as any);
  const [dismissedAt, setDismissedAt] = useState<number | null>(() => {
    const v = localStorage.getItem(STORAGE_KEY);
    return v ? Number(v) : null;
  });

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferred(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferred) return null;
  if (dismissedAt && Date.now() - dismissedAt < DAY) return null;

  const handleClick = async () => {
    deferred.prompt();
    const result = await deferred.userChoice;
    setDeferred(null);
    if (result.outcome === 'dismissed') {
      const t = Date.now();
      localStorage.setItem(STORAGE_KEY, String(t));
      setDismissedAt(t);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-green-600 text-white rounded"
    >
      Instalează aplicația
    </button>
  );
}
