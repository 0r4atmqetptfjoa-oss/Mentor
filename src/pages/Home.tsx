import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../ui/button';
import StreakBar from '../components/StreakBar';
import RankBadge from '../components/RankBadge';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="p-4 flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <StreakBar />
          <RankBadge rank="🏅" />
        </div>
        <Link to="/quiz" className="block">
          <Button className="w-full">Start Quiz</Button>
        </Link>
        <Link to="/review" className="block">
          <Button variant="secondary" className="w-full">Review</Button>
        </Link>
        <Link to="/review-greseli" className="block">
          <Button variant="secondary" className="w-full">Greșeli</Button>
        </Link>
        <Link to="/misiuni" className="block">
          <Button variant="secondary" className="w-full">Misiuni</Button>
        </Link>
      </main>
    </div>
  );
}

