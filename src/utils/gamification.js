const ranks = [
  { name: 'Soldat', minPoints: 0, emoji: '👤' },
  { name: 'Caporal', minPoints: 25, emoji: '🎖️' },
  { name: 'Sergent', minPoints: 60, emoji: '🏅' },
  { name: 'Plutonier', minPoints: 100, emoji: '🔶' },
  { name: 'Maior', minPoints: 150, emoji: '⭐' },
  { name: 'Colonel', minPoints: 200, emoji: '🌟' },
  { name: 'General', minPoints: 220, emoji: '🏆' }
];

export const calculateUserProgress = () => {
  const progressData = JSON.parse(localStorage.getItem('questionProgress')) || [];
  const totalScore = progressData.filter(q => q.strength > 1).length;

  let currentRank = ranks[0];
  let nextRank = null;

  for (let i = ranks.length - 1; i >= 0; i--) {
    if (totalScore >= ranks[i].minPoints) {
      currentRank = ranks[i];
      if (i < ranks.length - 1) {
        nextRank = ranks[i + 1];
      }
      break;
    }
  }

  const pointsForNextRank = nextRank ? nextRank.minPoints - totalScore : 0;
  const rankProgressPercentage = nextRank ? (totalScore - currentRank.minPoints) / (nextRank.minPoints - currentRank.minPoints) * 100 : 100;


  return {
    totalScore,
    rank: currentRank,
    nextRank,
    pointsForNextRank,
    rankProgressPercentage
  };
};

export const getDailyChallenge = () => {
    const today = new Date().toDateString();
    const challenges = [
        { id: 1, text: "Răspunde corect la 10 întrebări în Modul de Învățare." },
        { id: 2, text: "Finalizează un test de Engleză." },
        { id: 3, text: "Înregistrează un antrenament în Jurnalul Fizic." }
    ];
    
    const dayIndex = new Date().getDate() % challenges.length;
    const challenge = challenges[dayIndex];
    const completed = localStorage.getItem('dailyChallengeDate') === today;
    return { ...challenge, completed };
}