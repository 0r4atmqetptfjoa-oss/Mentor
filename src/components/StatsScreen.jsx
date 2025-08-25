import React from 'react';
import allQuestionsOriginal from '../data/baza_de_date_completa.json';
import HomeButton from './HomeButton';
import { motion } from 'framer-motion';
import useLocalStorage from '../hooks/useLocalStorage';

function StatsScreen({ goHome, onReview }) {
    const [questionProgress, setQuestionProgress] = useLocalStorage('questionProgress', []);
    
    const handleResetAll = () => {
        if(confirm('Ești sigur că vrei să resetezi tot progresul la legislație? Acțiunea este ireversibilă.')) {
            setQuestionProgress([]);
            window.location.reload();
        }
    };

    const handleResetCategory = (categoryToReset) => {
        if(confirm(`Ești sigur că vrei să resetezi progresul pentru categoria "${categoryToReset}"?`)) {
            const updatedData = questionProgress.map(q => {
                if (q.categorie === categoryToReset) {
                    return { ...q, strength: 1, lastReviewed: null };
                }
                return q;
            });
            setQuestionProgress(updatedData);
        }
    };

    const startPersonalizedReview = () => {
        const weakQuestions = questionProgress
            .filter(q => q.lastReviewed && q.strength < 3)
            .sort((a,b) => a.strength - b.strength)
            .slice(0, 10);
        
        if(weakQuestions.length === 0) {
            alert("Felicitări! Nu ai puncte slabe de revizuit momentan.");
            return;
        }
        
        onReview(weakQuestions.map(q => ({ question: q, correct: q.raspunsCorect })));
    };
    
    if (questionProgress.length === 0) {
        return (
            <div className="app-container">
                <HomeButton goHome={goHome} />
                <div className="menu-card">
                    <h2>Statistici de Progres</h2>
                    <p>Nu există încă date. Completează o sesiune în Modul de Învățare pentru a vedea progresul.</p>
                </div>
            </div>
        );
    }

    const categories = [...new Set(allQuestionsOriginal.map(q => q.categorie))];
    const stats = categories.map(category => {
        const categoryQuestions = questionProgress.filter(q => q.categorie === category);
        const answeredCorrectly = categoryQuestions.filter(q => q.strength > 1).length;
        const totalInCategory = allQuestionsOriginal.filter(q => q.categorie === category).length;
        const percentage = totalInCategory > 0 ? ((answeredCorrectly / totalInCategory) * 100).toFixed(0) : 0;
        return { category, percentage, answeredCorrectly, totalInCategory };
    }).sort((a, b) => b.percentage - a.percentage);

    const totalCorrect = questionProgress.filter(q => q.strength > 1).length;
    const totalQuestions = allQuestionsOriginal.length;
    const overallPercentage = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(0) : 0;

    return (
        <div className="app-container">
            <HomeButton goHome={goHome} />
            <motion.div 
                className="quiz-card stats-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="summary-header">
                    <h2>Statistici de Progres</h2>
                </div>
                <div className="overall-stats">
                    <h3>Progres General: {overallPercentage}%</h3>
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${overallPercentage}%` }}></div>
                    </div>
                     <button onClick={startPersonalizedReview} className="start-button secondary" style={{marginTop: '1rem'}}>🎯 Începe Revizuire Personalizată (10 Întrebări)</button>
                     <button onClick={handleResetAll} className="reset-button">🗑️ Resetează Tot Progresul</button>
                </div>
                <div className="category-stats">
                    <h3>Progres pe Categorii:</h3>
                    {stats.map(stat => (
                        <motion.div 
                            key={stat.category} 
                            className="stat-item"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className='stat-item-header'>
                                <span className="stat-category-name">{stat.category} ({stat.answeredCorrectly}/{stat.totalInCategory})</span>
                                <button onClick={() => handleResetCategory(stat.category)} className="reset-category-button">Reset</button>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar" style={{ width: `${stat.percentage}%`, backgroundColor: stat.percentage > 80 ? '#38A169' : '#dd6b20' }}>
                                    {stat.percentage > 10 ? `${stat.percentage}%` : ''}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

export default StatsScreen;