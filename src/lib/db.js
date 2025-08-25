import Dexie from 'dexie'

export const db = new Dexie('mentor')
db.version(1).stores({
  questions: 'id,categorie',   // id din JSON
  summaries: 'id,topic',        // id=slug topic
  progress: '++key,qid,correct' // istoric răspunsuri
})

// simplu hash pentru detectarea schimbărilor
function fastHash(str) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16)
}

async function fetchText(url) {
  const r = await fetch(url)
  if (!r.ok) throw new Error('Fetch failed: ' + url)
  return await r.text()
}

export async function ingestIfNeeded() {
  const files = [
    '/data/questions_engleza.json',
    '/data/questions_intendenta.json',
    '/data/questions_psihologic.json',
    '/data/rezumate_materie.json'
  ]

  const texts = await Promise.all(files.map(fetchText))
  const hash = fastHash(texts.join('::'))
  const prev = localStorage.getItem('dbHash')
  if (prev === hash) return

  // reset
  await db.transaction('rw', db.questions, db.summaries, db.progress, async () => {
    await db.questions.clear()
    await db.summaries.clear()
    // parse întrebări (primele 3 fișiere sunt arrays de obiecte)
    const qFiles = texts.slice(0, 3).map(t => JSON.parse(t))
    const allQ = qFiles.flat().map(q => ({
      id: q.id,
      categorie: q.categorie,
      intrebare: q.intrebare,
      variante: q.variante,
      raspunsCorect: q.raspunsCorect,
      sursa: q.sursa
    }))
    await db.questions.bulkPut(allQ)

    // rezumate: poate fi obiect cu multe chei -> normalizare
    const rezObj = JSON.parse(texts[3])
    const flat = []
    for (const [topic, entry] of Object.entries(rezObj)) {
      if (entry?.rezumat) {
        flat.push({
          id: topic.toLowerCase().replace(/\s+/g, '-'),
          topic,
          rezumat: entry.rezumat.trim()
        })
      }
    }
    await db.summaries.bulkPut(flat)
  })

  localStorage.setItem('dbHash', hash)
}
