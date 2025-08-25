import { useState, useEffect } from 'react';
import allQuestionsOriginal from '../data/baza_de_date_completa.json';
import { getAIExplanation } from '../services/gemini.js';
import HomeButton from './HomeButton.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Funcție pentru a gestiona progresul (Spaced Repetition)
const useQuestionProgress = () => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const progress = JSON.parse(localStorage.getItem('questionProgress'));
        // Verificăm dacă progresul salvat corespunde cu baza de date actuală
        if (progress && progress.length === allQuestionsOriginal.length) {
            setQuestions(progress);
        } else {
            // Inițializăm progresul dacă nu există sau este invalid
            const initialQuestions = allQuestionsOriginal.map(q => ({ ...q, id: q.id, strength: 1, lastReviewed: null }));
            localStorage.setItem('questionProgress', JSON.stringify(initialQuestions));
            setQuestions(initialQuestions);
        }
    }, []);

    const updateQuestionStrength = (questionId, isCorrect) => {
        const updatedQuestions = questions.map(q => {
            if (q.id === questionId) {
                const newStrength = isCorrect ? q.strength + 1 : 1; // Crește dacă e corect, resetează la 1 dacă e greșit
                return { ...q, strength: newStrength, lastReviewed: new Date().toISOString() };
            }
            return q;
        });
        setQuestions(updatedQuestions);
        localStorage.setItem('questionProgress', JSON.stringify(updatedQuestions));
    };

    return { questions, updateQuestionStrength };
};

function LearningScreen({ selectedCategory, onCategorySelect, goHome }) {
  const { questions: allProgressQuestions, updateQuestionStrength } = useQuestionProgress();
  
  const [learningQuestions, setLearningQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const categories = [...new Set(allQuestionsOriginal.map(q => q.categorie))];

  useEffect(() => {
    if (selectedCategory && allProgressQuestions.length > 0) {
      const filtered = allProgressQuestions.filter(q => q.categorie === selectedCategory);
      // Sortează întrebările: cele mai puțin știute (strength mic) apar primele
      const sorted = [...filtered].sort((a, b) => a.strength - b.strength);
      setLearningQuestions(sorted);
      setCurrentQuestionIndex(0);
    }
  }, [selectedCategory, allProgressQuestions]);

  if (!selectedCategory) {
    return (
        <div className="app-container">
            <HomeButton goHome={goHome} />
            <motion.div 
                className="menu-card category-selection-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <h2>Alege Categoria de Studiu</h2>
                <div className="category-buttons">
                    {categories.map((cat, index) => (
                        <motion.button 
                            key={cat} 
                            onClick={() => onCategorySelect(cat)} 
                            className="category-button"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >{cat}</motion.button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
  }
  
  if (learningQuestions.length === 0 || currentQuestionIndex >= learningQuestions.length) {
    return (
        <div className="app-container">
            <HomeButton goHome={goHome} />
            <div className="quiz-card">
                <h2 className="final-score">Felicitări!</h2>
                <p className="score-details">Ai terminat toate întrebările din categoria "{selectedCategory}".</p>
                <button className="start-button" onClick={goHome}>Înapoi la Meniu</button>
            </div>
        </div>
    );
  }

  const currentQuestion = learningQuestions[currentQuestionIndex];

  const handleAnswerClick = async (selectedVariant) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedAnswer(selectedVariant);

    const isCorrect = selectedVariant === currentQuestion.raspunsCorect;
    updateQuestionStrength(currentQuestion.id, isCorrect);
    
    if (isCorrect) {
        toast.success('Corect!');
    } else {
        toast.error('Greșit!');
    }

    setIsLoadingAI(true);
    const explanation = await getAIExplanation(currentQuestion, selectedVariant);
    setAiExplanation(explanation);
    setIsLoadingAI(false);
  };
  
  const goToNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setAiExplanation('');
  };

  const getButtonClass = (variant) => {
    if (!isAnswered) return 'answer-button';
    const isCorrect = variant === currentQuestion.raspunsCorect;
    if (isCorrect) return 'answer-button correct';
    if (variant === selectedAnswer) return 'answer-button incorrect';
    return 'answer-button';
  };
  
  return (
    <div className="app-container">
      <HomeButton goHome={goHome} />
       <AnimatePresence mode="wait">
            <motion.div
                key={currentQuestion.id}
                className="quiz-card"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
            >
                <div className="quiz-info">
                    <button onClick={() => onCategorySelect(null)} className="back-to-menu-link">← Înapoi la Categorii</button>
                    <span>Întrebarea {currentQuestionIndex + 1} / {learningQuestions.length}</span>
                </div>
                <div className="question-header">
                <p className="question-category">{currentQuestion.categorie}</p>
                <h2 className="question-text">{currentQuestion.intrebare}</h2>
                </div>
                <div className="answers-container">
                {currentQuestion.variante.map((varianta, index) => (
                    <motion.button
                    key={index}
                    className={getButtonClass(varianta)}
                    onClick={() => handleAnswerClick(varianta)}
                    disabled={isAnswered}
                    whileHover={{ scale: isAnswered ? 1 : 1.03 }}
                    whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                    >
                    {varianta}
                    </motion.button>
                ))}
                </div>
                {isAnswered && (
                    <motion.div 
                        className="learning-footer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {isLoadingAI && <div className="ai-explanation"><p>AI-ul gândește...</p></div>}
                        {!isLoadingAI && aiExplanation && (
                            <div className="ai-explanation">
                                <h3>Explicație AI:</h3>
                                <p>{aiExplanation}</p>
                            </div>
                        )}
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="start-button" onClick={goToNextQuestion}>Următoarea Întrebare →</motion.button>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    </div>
  );
}

export default LearningScreen;