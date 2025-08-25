import { db } from '../lib/db'

export default function Settings() {
  const exportData = async () => {
    const [q, s, p] = await Promise.all([
      db.questions.toArray(), db.summaries.toArray(), db.progress.toArray()
    ])
    const blob = new Blob([JSON.stringify({ q, s, p }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mentor-backup-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = async (file) => {
    const text = await file.text()
    const { q = [], s = [], p = [] } = JSON.parse(text)
    await db.transaction('rw', db.questions, db.summaries, db.progress, async () => {
      await db.questions.clear(); await db.summaries.clear(); await db.progress.clear()
      await db.questions.bulkPut(q); await db.summaries.bulkPut(s); await db.progress.bulkPut(p)
    })
    localStorage.removeItem('dbHash') // forțează reingest la următorul refresh
    alert('Import reușit.')
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-2">
        <div className="font-semibold">Date</div>
        <div className="flex gap-2">
          <button className="btn-primary" onClick={exportData}>Export backup</button>
          <label className="btn bg-white/10 cursor-pointer">
            Import
            <input type="file" accept="application/json" className="hidden" onChange={e => importData(e.target.files[0])}/>
          </label>
        </div>
        <div className="text-white/60 text-sm">
          La următorul refresh vom re‑ingesta JSON‑urile din <code>/data</code> dacă s‑au schimbat.
        </div>
      </div>

      <div className="card">
        <div className="font-semibold mb-1">Despre</div>
        <div className="text-white/60 text-sm">Aplicație personală Mentor, PWA, offline.</div>
      </div>
    </div>
  )
}
