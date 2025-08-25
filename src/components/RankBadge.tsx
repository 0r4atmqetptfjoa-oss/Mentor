import { motion } from 'framer-motion';

export default function RankBadge({ rank }: { rank: string }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white"
    >
      {rank}
    </motion.div>
  );
}
