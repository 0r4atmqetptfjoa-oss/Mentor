import { db } from './db';

export async function exportAll() {
  const payload = {
    ver: 2,
    exportedAt: new Date().toISOString(),
    progress: await db.progress.toArray(),
    mistakes: await db.mistakes.toArray(),
    kv: await db.kv.toArray(),
    badges: await db.badges.toArray()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mentor-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function importAll(file: File) {
  const text = await file.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    alert('Fișier invalid');
    return;
  }
  if (data?.ver !== 2) {
    if (!confirm('Versiune necunoscută. Încearcă oricum?')) return;
  }
  await db.transaction('rw', db.progress, db.mistakes, db.kv, db.badges, async () => {
    await db.progress.clear();
    await db.mistakes.clear();
    await db.kv.clear();
    await db.badges.clear();
    if (Array.isArray(data.progress)) await db.progress.bulkPut(data.progress);
    if (Array.isArray(data.mistakes)) await db.mistakes.bulkPut(data.mistakes);
    if (Array.isArray(data.kv)) await Promise.all(data.kv.map((x: any) => db.kv.put(x)));
    if (Array.isArray(data.badges)) await db.badges.bulkPut(data.badges);
  });
  alert('Import reușit. Recomandăm un refresh.');
}
