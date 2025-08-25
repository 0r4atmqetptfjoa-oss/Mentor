import { useEffect, useState } from 'react';
import { z } from 'zod';
import Header from '../components/Header';
import Card from '../ui/card';
import { loadJson } from '../data/loaders';

const summarySchema = z.object({ title: z.string(), content: z.string() });

export default function Review() {
  const [summaries, setSummaries] = useState<z.infer<typeof summarySchema>[] | null>(null);

  useEffect(() => {
    loadJson('/data/rezumate_materie.json', z.array(summarySchema), []).then(setSummaries);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="p-4 flex-1 space-y-4">
        {!summaries && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-slate-200 animate-pulse rounded" />
            ))}
          </div>
        )}
        {summaries && summaries.slice(0, 5).map((s, i) => (
          <Card key={i}>
            <p className="font-medium">{s.title}</p>
          </Card>
        ))}
      </main>
    </div>
  );
}

