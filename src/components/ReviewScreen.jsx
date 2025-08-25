import { useState, useEffect } from 'react';
import { getAIExplanation } from '../services/gemini.js';
import HomeButton from './HomeButton.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

function ReviewScreen({ incorrectAnswers, goBack }) {
  const [reviewQuestions, setReviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    // Amestecăm întrebările de revizuit pentru a nu fi mereu în aceeași ordine
    setReviewQuestions([...incorrectAnswers].sort(() => 0.5 - Math.random()));
  }, [incorrectAnswers]);

  if (reviewQuestions.length === 0) {
    return (
      <div className="app-container">
        <HomeButton goHome={goBack} />
        <div className="quiz-card">
          <h2 className="final-score">Fără greșeli!</h2>
          <p className="score-details">Nu ai întrebări de revizuit. Felicitări!</p>
          <button className="start-button" onClick={goBack}>Înapoi</button>
        </div>
      </div>
    );
  }
  
  const currentReviewItem = reviewQuestions[currentQuestionIndex];
  // Asigură-te că `currentQuestion` este obiectul întrebării, nu întregul obiect de răspuns
  const currentQuestion = currentReviewItem.question;


  const handleAnswerClick = async (selectedVariant) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedAnswer(selectedVariant);

    const isCorrect = selectedVariant === currentQuestion.raspunsCorect;
    if(isCorrect) {
        toast.success("Corect de data asta!");
    } else {
        toast.error("Încă greșit. Mai studiază explicația.");
    }
    
    // Verificăm dacă întrebarea este din legislație pentru a cere explicație AI
    if (currentQuestion.categorie.includes("Legea") || currentQuestion.categorie.includes("Regulament") || currentQuestion.categorie.includes("Norme") || currentQuestion.categorie.includes("Constituția") || currentQuestion.categorie.includes("HG")) {
        setIsLoadingAI(true);
        const explanation = await getAIExplanation(currentQuestion, selectedVariant);
        setAiExplanation(explanation);
        setIsLoadingAI(false);
    }
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < reviewQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setAiExplanation('');
    } else {
        toast.success("Ai terminat de revizuit toate greșelile!");
        goBack();
    }
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
        <HomeButton goHome={goBack} />
        <AnimatePresence mode="wait">
            <motion.div
                key={currentQuestionIndex}
                className="quiz-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
            >
                <div className="quiz-info">
                    <button onClick={goBack} className="back-to-menu-link">← Înapoi</button>
                    <span>Revizuire {currentQuestionIndex + 1} / {reviewQuestions.length}</span>
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

export default ReviewScreen;