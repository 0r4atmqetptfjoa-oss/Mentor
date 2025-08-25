import React, { useState, useEffect } from 'react';
import HomeButton from './HomeButton';
import { motion } from 'framer-motion';
import testData from '../data/psychological_tests.json';
import toast from 'react-hot-toast';

function PsychScreen({ goHome }) {
    const [questions, setQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(null);
    const [selected, setSelected] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const loadNewQuestion = () => {
        const shuffled = [...testData.sequences].sort(() => 0.5 - Math.random());
        setCurrentQ(shuffled[0]);
        setSelected(null);
        setIsAnswered(false);
    };

    useEffect(() => {
        loadNewQuestion();
    }, []);

    const handleAnswer = (option) => {
        if (isAnswered) return;
        setSelected(option);
        setIsAnswered(true);
        if (option === currentQ.answer) {
            toast.success("Corect!");
        } else {
            toast.error("Greșit!");
        }
    };
    
    const getButtonClass = (option) => {
        if (!isAnswered) return 'answer-button';
        if (option === currentQ.answer) return 'answer-button correct';
        if (option === selected) return 'answer-button incorrect';
        return 'answer-button';
    };

    return (
        <div className="app-container">
            <HomeButton goHome={goHome} />
            <motion.div 
                className="quiz-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2>Modul Antrenament Psihologic</h2>
                <div className="physical-section">
                    <h3>Teste de Logică - Șiruri Numerice</h3>
                    {currentQ && (
                        <motion.div 
                            key={currentQ.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <p className="sequence-text">{currentQ.sequence}</p>
                            <div className="answers-container">
                                {currentQ.options.map(opt => (
                                    <button 
                                        key={opt} 
                                        onClick={() => handleAnswer(opt)}
                                        className={getButtonClass(opt)}
                                        disabled={isAnswered}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                    {isAnswered && <button className="start-button" style={{marginTop: '1rem'}} onClick={loadNewQuestion}>Următorul Test</button>}
                </div>
            </motion.div>
        </div>
    );
}

export default PsychScreen;