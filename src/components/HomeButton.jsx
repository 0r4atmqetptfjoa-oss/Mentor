import { FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';

function HomeButton({ goHome }) {
  return (
    <motion.button 
      onClick={goHome} 
      className="home-button"
      title="Mergi la Meniul Principal"
      initial={{ scale: 0, y: -100 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <FaHome />
    </motion.button>
  );
}

export default HomeButton;