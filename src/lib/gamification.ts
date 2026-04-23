// Scoring & Gamification Engine for SkillDrop

export const LEVELS = [
  { level: 1, name: 'ROOKIE', minXP: 0, maxXP: 500, color: '#888' },
  { level: 2, name: 'HUSTLER', minXP: 500, maxXP: 1500, color: '#4ade80' },
  { level: 3, name: 'BUILDER', minXP: 1500, maxXP: 3500, color: '#00e5ff' },
  { level: 4, name: 'EXPERT', minXP: 3500, maxXP: 7000, color: '#f0c040' },
  { level: 5, name: 'LEGEND', minXP: 7000, maxXP: 99999, color: '#ff4d6d' },
]

export const BADGES = [
  { type: 'FIRST_DROP', name: 'First Drop', icon: '🔥', desc: 'Complete your first task', condition: (stats: UserStats) => stats.tasksCompleted >= 1 },
  { type: 'STREAK_7', name: '7-Day Streak', icon: '⚡', desc: '7 consecutive active days', condition: (stats: UserStats) => stats.streak >= 7 },
  { type: 'PERFECT_SCORE', name: 'Perfect Score', icon: '🎯', desc: '5.0 rating 3 times', condition: (stats: UserStats) => stats.perfectRatings >= 3 },
  { type: 'TEAM_PLAYER', name: 'Team Player', icon: '🤝', desc: 'Complete 3 team tasks', condition: (stats: UserStats) => stats.teamTasks >= 3 },
  { type: 'ORIGINAL', name: 'Originality Champion', icon: '🛡️', desc: '100% original 5 times', condition: (stats: UserStats) => stats.originalSubmissions >= 5 },
  { type: 'ARENA_TOP', name: 'Top of Arena', icon: '🏆', desc: 'Rank #1 in Skill Battle', condition: (stats: UserStats) => stats.arenaWins >= 1 },
]

export interface UserStats {
  tasksCompleted: number
  streak: number
  perfectRatings: number
  teamTasks: number
  originalSubmissions: number
  arenaWins: number
  avgRating: number
  totalTasks: number
}

export function calculateLevel(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i]
  }
  return LEVELS[0]
}

export function calculateSkillScore(stats: {
  avgRating: number       // 0-5
  feedbackCount: number   // total reviews
  streak: number          // current streak days
  avgDifficulty: number   // 1-4 (EASY=1, EXPERT=4)
  tasksCompleted: number
}): number {
  const qualityScore = (stats.avgRating / 5) * 350       // 35% weight, max 350
  const feedbackScore = Math.min(stats.feedbackCount / 20, 1) * 250  // 25%, max 250
  const consistencyScore = Math.min(stats.streak / 30, 1) * 200     // 20%, max 200
  const difficultyScore = (stats.avgDifficulty / 4) * 150           // 15%, max 150
  const originalityScore = Math.min(stats.tasksCompleted / 10, 1) * 50 // 5%, max 50

  return Math.round(qualityScore + feedbackScore + consistencyScore + difficultyScore + originalityScore)
}

export function getXPForTask(difficulty: string): number {
  switch (difficulty) {
    case 'EASY': return 50
    case 'MEDIUM': return 100
    case 'HARD': return 200
    case 'EXPERT': return 400
    default: return 50
  }
}

export function getLevelProgress(xp: number) {
  const level = calculateLevel(xp)
  const progress = ((xp - level.minXP) / (level.maxXP - level.minXP)) * 100
  return Math.min(Math.round(progress), 100)
}
