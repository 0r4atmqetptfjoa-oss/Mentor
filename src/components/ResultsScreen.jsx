import { motion } from 'framer-motion';
import HomeButton from './HomeButton';

function ResultsScreen({ score, totalQuestions, userAnswers, goHome, onReview }) {
    const incorrectAnswers = userAnswers.filter(a => !a.isCorrect);

    return (
        <motion.div 
            className="app-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <HomeButton goHome={goHome} />
            <div className="quiz-card results-card">
                <h2 className="final-score">Rezultate Examen</h2>
                <p className="score-details">
                    Scor final: <strong>{score}</strong> din <strong>{totalQuestions}</strong> răspunsuri corecte.
                </p>
                <p className="score-details">
                    Procentaj: <strong>{((score / totalQuestions) * 100).toFixed(2)}%</strong>
                </p>
                <div className='menu-buttons'>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="start-button" onClick={goHome}>Înapoi la Meniu</motion.button>
                    {incorrectAnswers.length > 0 && (
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="start-button secondary" onClick={() => onReview(incorrectAnswers)}>Revizuiește Greșelile</motion.button>
                    )}
                </div>

                {incorrectAnswers.length > 0 && (
                    <div className="incorrect-answers-list">
                        <h3>Întrebări la care ai greșit:</h3>
                        {incorrectAnswers.map((answer, index) => (
                            <motion.div 
                                key={index} 
                                className="incorrect-answer-item"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <p className="incorrect-q"><strong>Î:</strong> {answer.question.intrebare}</p>
                                <p className="your-a"><strong>Răspunsul tău:</strong> {answer.selected}</p>
                                <p className="correct-a"><strong>Răspunsul corect:</strong> {answer.correct}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default ResultsScreen;