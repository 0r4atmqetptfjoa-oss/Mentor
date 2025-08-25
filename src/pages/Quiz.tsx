import { useEffect, useState } from 'react';
import { z } from 'zod';
import Header from '../components/Header';
import Card from '../ui/card';
import { loadJson, questionSchema } from '../data/loaders';

const questionArray = z.array(questionSchema);

export default function Quiz() {
  const [questions, setQuestions] = useState<z.infer<typeof questionArray> | null>(null);

  useEffect(() => {
    loadJson('/db/questions_engleza.json', questionArray, []).then(setQuestions);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="p-4 flex-1 space-y-4">
        {!questions && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-slate-200 animate-pulse rounded" />
            ))}
          </div>
        )}
        {questions && questions.slice(0, 5).map((q, i) => (
          <Card key={i}>
            <p className="font-medium">{q.question}</p>
          </Card>
        ))}
      </main>
    </div>
  );
}

