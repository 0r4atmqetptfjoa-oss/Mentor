import { useState, useEffect } from 'react';
import { getAISummary } from '../services/gemini.js';
import HomeButton from './HomeButton.jsx';
import { motion } from 'framer-motion';
import allQuestionsOriginal from '../data/baza_de_date_completa.json'; // Placeholder for text extraction

function SummaryScreen({ goHome }) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateSummary = async () => {
      const savedSummary = sessionStorage.getItem('aiSummary');
      if (savedSummary) {
          setSummary(savedSummary);
          setIsLoading(false);
          return;
      }
      // Simulăm extragerea unui text relevant din baza de date
      const textForSummary = allQuestionsOriginal.slice(0, 50).map(q => q.intrebare + " " + q.raspunsCorect).join('\n');
      const generatedSummary = await getAISummary(textForSummary);
      setSummary(generatedSummary);
      sessionStorage.setItem('aiSummary', generatedSummary);
      setIsLoading(false);
    };
    generateSummary();
  }, []);

  return (
    <div className="app-container">
      <HomeButton goHome={goHome} />
      <motion.div 
        className="quiz-card summary-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="summary-header">
          <h2>Rezumat Materie (Generat de AI)</h2>
        </div>
        <div className="summary-content">
          {isLoading ? (
            <div className="loading-container">
                <div className="typing-indicator"><span></span><span></span><span></span></div>
                <p>Se generează rezumatul... Acest proces poate dura 10-20 de secunde.</p>
            </div>
          ) : (
            <p>{summary}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default SummaryScreen;