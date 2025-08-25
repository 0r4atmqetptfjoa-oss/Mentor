import { useEffect, useState } from 'react';
import { db } from '../lib/db';
import Header from '../components/Header';
import Card from '../ui/card';

export default function ReviewMistakes() {
  const [qs, setQs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const ms = await db.mistakes.orderBy('ts').reverse().toArray();
      const qids = Array.from(new Set(ms.map((m) => m.qid))).slice(0, 50);
      const qs = await db.questions.where('id').anyOf(qids).toArray();
      setQs(qs);
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="p-4 flex-1 space-y-4">
        <h2 className="text-xl font-bold">Repetă greșelile ({qs.length})</h2>
        {qs.map((q) => (
          <Card key={q.id}>
            <p className="font-medium">{q.question}</p>
          </Card>
        ))}
      </main>
    </div>
  );
}
