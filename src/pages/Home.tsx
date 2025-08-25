import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="p-4 flex-1 flex flex-col gap-4">
        <Link to="/quiz" className="block">
          <Button className="w-full">Start Quiz</Button>
        </Link>
        <Link to="/review" className="block">
          <Button variant="secondary" className="w-full">Review</Button>
        </Link>
      </main>
    </div>
  );
}

