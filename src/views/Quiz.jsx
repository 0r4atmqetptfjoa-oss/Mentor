import { useEffect, useMemo, useState } from 'react'
import { db } from '../lib/db'
import { motion } from 'framer-motion'
import { success, errorBuzz, tap } from '../lib/haptics'

function pickRandom(arr, n) {
  const a = [...arr]
  const out = []
  while (a.length && out.length < n) {
    out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0])
  }
  return out
}

export default function Quiz() {
  const [items, setItems] = useState([])
  const [i, setI] = useState(0)
  const [answer, setAnswer] = useState(null)
  const [filter, setFilter] = useState('toate')

  useEffect(() => {
    ;(async () => {
      const qs = filter === 'toate'
        ? await db.questions.toArray()
        : await db.questions.where('categorie').equals(filter).toArray()
      setItems(pickRandom(qs, 25))
      setI(0)
      setAnswer(null)
    })()
  }, [filter])

  const q = items[i]
  const categories = useMemo(() => ['toate', ...new Set(items.map(x => x.categorie))], [items])

  const onPick = async (opt) => {
    tap()
    setAnswer(opt)
    const correct = opt === q?.raspunsCorect
    try { await db.progress.add({ qid: q.id, correct, ts: Date.now() }) } catch {}
    if (correct) success(); else errorBuzz()
    setTimeout(() => {
      setI(v => Math.min(v + 1, items.length - 1))
      setAnswer(null)
    }, 350)
  }

  if (!q) return <div className="text-white/70">Selectează o categorie sau așteaptă încărcarea…</div>

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(c => (
          <button key={c}
            onClick={() => setFilter(c)}
            className={'px-3 py-2 rounded-full text-sm ' + (filter === c ? 'bg-white/20' : 'bg-white/10')}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="card space-y-3">
        <div className="text-xs text-white/60">Întrebarea {i + 1} / {items.length}</div>
        <div className="text-lg leading-snug">{q.intrebare}</div>

        <div className="grid gap-2">
          {q.variante.map(opt => {
            const state =
              answer == null ? '' :
              opt === q.raspunsCorect ? 'ring-2 ring-emerald-400 bg-emerald-400/10' :
              opt === answer ? 'ring-2 ring-rose-400 bg-rose-400/10' : 'opacity-70'
            return (
              <motion.button key={opt} whileTap={{ scale: 0.98 }}
                onClick={() => onPick(opt)}
                className={'text-left p-3 rounded-xl border border-white/10 ' + state}
                disabled={answer != null}
              >
                {opt}
              </motion.button>
            )
          })}
        </div>

        <div className="text-xs text-white/50">
          {q.categorie} — <a className="underline" href={q.sursa} target="_blank" rel="noreferrer">sursă</a>
        </div>
      </div>
    </div>
  )
}
