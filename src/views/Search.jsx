import { useEffect, useState } from 'react'
import { db } from '../lib/db'

export default function Search() {
  const [q, setQ] = useState('')
  const [res, setRes] = useState([])

  useEffect(() => {
    if (!q) { setRes([]); return }
    const run = async () => {
      const all = await db.questions.toArray()
      const needle = q.toLowerCase()
      setRes(all.filter(item =>
        item.intrebare.toLowerCase().includes(needle) ||
        item.categorie.toLowerCase().includes(needle) ||
        item.variante.some(v => v.toLowerCase().includes(needle))
      ).slice(0, 50))
    }
    run()
  }, [q])

  return (
    <div className="space-y-3">
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Caută întrebare sau cuvânt cheie…"
        className="w-full p-3 rounded-xl bg-white/10 outline-none"
      />
      <div className="grid gap-2">
        {res.map(r => (
          <div key={r.id} className="card">
            <div className="text-sm text-white/60">{r.categorie}</div>
            <div className="mt-1">{r.intrebare}</div>
          </div>
        ))}
        {!res.length && <div className="text-white/60">Tastează pentru a căuta…</div>}
      </div>
    </div>
  )
}
