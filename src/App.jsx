import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import ExamScreen from './components/ExamScreen';
import LearningScreen from './components/LearningScreen';
import SummaryScreen from './components/SummaryScreen';
import StatsScreen from './components/StatsScreen';
import ReviewScreen from './components/ReviewScreen';
import MentorScreen from './components/MentorScreen';
import PhysicalScreen from './components/PhysicalScreen';
import PsychScreen from './components/PsychScreen';
import './App.css';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(currentTheme => currentTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <div className="personal-signature">Te iubesc</div>
      <Routes>
        <Route path="/" element={<HomeScreen toggleTheme={toggleTheme} currentTheme={theme} />} />
        <Route path="/examen/:tip" element={<ExamScreen />} />
        <Route path="/invatare" element={<LearningScreen />} />
        <Route path="/invatare/:categorie" element={<LearningScreen />} />
        <Route path="/rezumat" element={<SummaryScreen />} />
        <Route path="/statistici" element={<StatsScreen />} />
        <Route path="/revizuire" element={<ReviewScreen />} />
        <Route path="/mentor" element={<MentorScreen />} />
        <Route path="/fizic" element={<PhysicalScreen />} />
        <Route path="/psihologic" element={<PsychScreen />} />
      </Routes>
    </>
  );
}

export default App;