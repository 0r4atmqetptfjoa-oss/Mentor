import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// ... restul importurilor tale (FaSun, etc.)
// ... importul funcțiilor de gamification

// Presupunând că ai importat tot ce trebuie...
function HomeScreen({ toggleTheme, currentTheme }) {
  const navigate = useNavigate();
  // ... logica pentru progress și challenge rămâne la fel

  return (
    // ... structura ta de HomeScreen, dar cu butoanele modificate:
    <div className="menu-buttons">
      <motion.button className="start-button secondary" onClick={() => navigate('/invatare')}>📚 Mod Învățare</motion.button>
      <motion.button className="start-button primary" onClick={() => navigate('/examen/legi')}>🚀 Examen Legislație</motion.button>
      <motion.button className="start-button english" onClick={() => navigate('/examen/engleza')}>🇬🇧 Examen Engleză</motion.button>
      <motion.button className="start-button physical" onClick={() => navigate('/fizic')}>💪 Prep. Fizică</motion.button>
      <motion.button className="start-button psych" onClick={() => navigate('/psihologic')}>🧠 Prep. Psihologică</motion.button>
      <motion.button className="start-button stats" onClick={() => navigate('/statistici')}>📊 Statistici</motion.button>
      <motion.button className="start-button tertiary" onClick={() => navigate('/mentor')}>🎓 Mentor AI</motion.button>
      <motion.button className="start-button summary" onClick={() => navigate('/rezumat')}>📖 Rezumat AI</motion.button>
    </div>
    // ... restul codului
  );
}

export default HomeScreen;