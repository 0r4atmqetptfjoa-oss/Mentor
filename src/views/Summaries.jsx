import { useEffect, useState } from 'react'
import { db } from '../lib/db'

export default function Summaries() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(null)

  useEffect(() => {
    db.summaries.orderBy('topic').toArray().then(setItems)
  }, [])

  return (
    <div className="space-y-2">
      {items.map(x => (
        <details key={x.id} open={open === x.id} onToggle={e => setOpen(e.currentTarget.open ? x.id : null)}
          className="card">
          <summary className="cursor-pointer text-lg">{x.topic}</summary>
          <div className="prose prose-invert mt-2">{x.rezumat}</div>
        </details>
      ))}
      {!items.length && <div className="skeleton h-24 w-full" />}
    </div>
  )
}
