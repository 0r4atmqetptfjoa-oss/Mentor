import { useState, useEffect } from 'react';
import allQuestionsLegi from '../data/baza_de_date_completa.json';
import allQuestionsEngleza from '../data/engleza.json';
import { getAIExplanation } from '../services/gemini.js';
import ResultsScreen from './ResultsScreen';
import HomeButton from './HomeButton';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

function ExamScreen({ goHome, quizType, onReview }) {
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  
  const examDuration = quizType === 'legi' ? 180 * 60 : 60 * 60; // 180 min pt legi, 60 min pt engleza
  const [timeLeft, setTimeLeft] = useState(examDuration);

  // Load or start a new exam
  useEffect(() => {
    const savedExamState = JSON.parse(localStorage.getItem('examState'));
    if (savedExamState && savedExamState.quizType === quizType) {
        if (confirm('A fost găsit un examen neterminat. Vrei să continui?')) {
            setExamQuestions(savedExamState.questions);
            setCurrentQuestionIndex(savedExamState.index);
            setScore(savedExamState.score);
            setUserAnswers(savedExamState.answers);
            setTimeLeft(savedExamState.time);
            return;
        }
    }
    
    localStorage.removeItem('examState');
    const sourceQuestions = quizType === 'legi' ? allQuestionsLegi : allQuestionsEngleza;
    const questionCount = quizType === 'legi' ? 60 : 60; // 60 și pentru engleză
    const shuffled = [...sourceQuestions].sort(() => 0.5 - Math.random());
    setExamQuestions(shuffled.slice(0, questionCount));
  }, [quizType]);

  // Save progress
   useEffect(() => {
    if (examQuestions.length > 0 && currentQuestionIndex < examQuestions.length) {
        const examState = {
            questions: examQuestions,
            index: currentQuestionIndex,
            score: score,
            answers: userAnswers,
            time: timeLeft,
            quizType: quizType
        };
        localStorage.setItem('examState', JSON.stringify(examState));
    }
  }, [currentQuestionIndex, score, userAnswers, timeLeft, examQuestions, quizType]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      endExam();
    }
    const timerId = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);
  
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (examQuestions.length === 0) {
    return <div className="app-container"><p>Se încarcă examenul...</p></div>;
  }

  const currentQuestion = examQuestions[currentQuestionIndex];

  const handleAnswerClick = (selectedVariant) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedAnswer(selectedVariant);

    const isCorrect = selectedVariant === currentQuestion.raspunsCorect;
    if (isCorrect) {
      setScore(score + 1);
      toast.success('Corect!');
    } else {
      toast.error('Greșit!');
      if (quizType === 'legi') {
        setIsLoadingAI(true);
        getAIExplanation(currentQuestion, selectedVariant).then(explanation => {
          setAiExplanation(explanation);
          setIsLoadingAI(false);
        });
      }
    }
    setUserAnswers([...userAnswers, { question: currentQuestion, selected: selectedVariant, correct: currentQuestion.raspunsCorect, isCorrect }]);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setAiExplanation('');
    } else {
      endExam();
    }
  };

  const endExam = () => {
      localStorage.removeItem('examState');
      setCurrentQuestionIndex(examQuestions.length);
  }

  if (currentQuestionIndex >= examQuestions.length) {
    return <ResultsScreen score={score} totalQuestions={examQuestions.length} userAnswers={userAnswers} goHome={goHome} onReview={onReview}/>;
  }

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
                key={currentQuestionIndex}
                className="quiz-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
            >
                <div className="quiz-info">
                <span>Scor: {score}</span>
                <span className="timer">Timp Rămas: {formatTime(timeLeft)}</span>
                <span>Întrebarea {currentQuestionIndex + 1} / {examQuestions.length}</span>
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
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
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

export default ExamScreen;