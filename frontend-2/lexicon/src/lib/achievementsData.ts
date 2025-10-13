export interface Achievement {
  id: string;
  icon: string;
  name: string;
  description: string;
  category: "Beginner" | "Intermediate" | "Advanced" | "Expert" | "Special";
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  requirements: {
    description: string;
    current: number;
    target: number;
  }[];
  progress: number;
  earnedAt?: string;
  rewards: {
    points: number;
    title?: string;
  };
}

export const achievementsData: Achievement[] = [
  // Earned achievements
  {
    id: "first-steps",
    icon: "🎯",
    name: "First Steps",
    description: "Complete your first lesson",
    category: "Beginner",
    rarity: "Common",
    requirements: [
      { description: "Complete a lesson", current: 1, target: 1 },
    ],
    progress: 100,
    earnedAt: "2025-01-15",
    rewards: { points: 50 },
  },
  {
    id: "dedicated-learner",
    icon: "📚",
    name: "Dedicated Learner",
    description: "Complete 10 lessons",
    category: "Beginner",
    rarity: "Common",
    requirements: [
      { description: "Complete lessons", current: 12, target: 10 },
    ],
    progress: 100,
    earnedAt: "2025-01-20",
    rewards: { points: 100 },
  },
  {
    id: "week-warrior",
    icon: "🔥",
    name: "Week Warrior",
    description: "Maintain a 7-day learning streak",
    category: "Intermediate",
    rarity: "Rare",
    requirements: [
      { description: "Consecutive days of learning", current: 14, target: 7 },
    ],
    progress: 100,
    earnedAt: "2025-01-22",
    rewards: { points: 250, title: "Consistent Learner" },
  },
  {
    id: "knowledge-seeker",
    icon: "🧠",
    name: "Knowledge Seeker",
    description: "Complete lessons in 3 different categories",
    category: "Intermediate",
    rarity: "Rare",
    requirements: [
      { description: "Categories explored", current: 3, target: 3 },
    ],
    progress: 100,
    earnedAt: "2025-01-18",
    rewards: { points: 200 },
  },
  {
    id: "quiz-master",
    icon: "✅",
    name: "Quiz Master",
    description: "Score 100% on 3 quizzes",
    category: "Intermediate",
    rarity: "Rare",
    requirements: [
      { description: "Perfect quiz scores", current: 3, target: 3 },
    ],
    progress: 100,
    earnedAt: "2025-01-25",
    rewards: { points: 300 },
  },

  // In-progress achievements
  {
    id: "perfect-score",
    icon: "💯",
    name: "Perfect Score",
    description: "Get 100% on 5 quizzes in a row",
    category: "Advanced",
    rarity: "Epic",
    requirements: [
      { description: "Consecutive perfect quizzes", current: 3, target: 5 },
      { description: "Minimum quiz length", current: 3, target: 3 },
    ],
    progress: 60,
    rewards: { points: 500, title: "Quiz Champion" },
  },
  {
    id: "speed-learner",
    icon: "⚡",
    name: "Speed Learner",
    description: "Complete 10 lessons in one day",
    category: "Advanced",
    rarity: "Epic",
    requirements: [
      { description: "Lessons completed today", current: 2, target: 10 },
      { description: "Average completion time", current: 85, target: 70 },
    ],
    progress: 20,
    rewards: { points: 400, title: "Fast Learner" },
  },
  {
    id: "master-level",
    icon: "🌟",
    name: "Master",
    description: "Reach Level 20",
    category: "Advanced",
    rarity: "Epic",
    requirements: [
      { description: "Current level", current: 8, target: 20 },
      { description: "Total XP earned", current: 4500, target: 15000 },
    ],
    progress: 40,
    rewards: { points: 1000, title: "Master Learner" },
  },

  // Locked achievements
  {
    id: "century-club",
    icon: "💯",
    name: "Century Club",
    description: "Complete 100 lessons",
    category: "Expert",
    rarity: "Legendary",
    requirements: [
      { description: "Complete lessons", current: 12, target: 100 },
      { description: "Average quiz score", current: 78, target: 80 },
    ],
    progress: 12,
    rewards: { points: 2000, title: "Centurion" },
  },
  {
    id: "polyglot",
    icon: "🌍",
    name: "Polyglot",
    description: "Complete courses in 5 different languages",
    category: "Expert",
    rarity: "Legendary",
    requirements: [
      { description: "Languages learned", current: 1, target: 5 },
      { description: "Courses per language", current: 1, target: 2 },
    ],
    progress: 10,
    rewards: { points: 1500, title: "World Learner" },
  },
  {
    id: "unstoppable",
    icon: "🏆",
    name: "Unstoppable",
    description: "Maintain a 30-day streak",
    category: "Expert",
    rarity: "Legendary",
    requirements: [
      { description: "Current streak", current: 14, target: 30 },
      { description: "Minimum daily time (mins)", current: 45, target: 30 },
    ],
    progress: 47,
    rewards: { points: 1000, title: "Unstoppable Force" },
  },
  {
    id: "ai-master",
    icon: "🤖",
    name: "AI Master",
    description: "Use AI chatbot to ask 100 questions",
    category: "Special",
    rarity: "Rare",
    requirements: [
      { description: "Questions asked", current: 34, target: 100 },
      { description: "Helpful responses received", current: 30, target: 80 },
    ],
    progress: 34,
    rewards: { points: 300, title: "AI Enthusiast" },
  },
  {
    id: "flashcard-pro",
    icon: "🎴",
    name: "Flashcard Pro",
    description: "Review 500 flashcards",
    category: "Intermediate",
    rarity: "Rare",
    requirements: [
      { description: "Flashcards reviewed", current: 189, target: 500 },
      { description: "Correct recall rate (%)", current: 72, target: 75 },
    ],
    progress: 38,
    rewards: { points: 250 },
  },
  {
    id: "early-bird",
    icon: "🌅",
    name: "Early Bird",
    description: "Complete lessons before 8 AM for 7 days",
    category: "Special",
    rarity: "Epic",
    requirements: [
      { description: "Early morning sessions", current: 2, target: 7 },
    ],
    progress: 29,
    rewards: { points: 400, title: "Morning Person" },
  },
  {
    id: "night-owl",
    icon: "🦉",
    name: "Night Owl",
    description: "Complete lessons after 10 PM for 7 days",
    category: "Special",
    rarity: "Epic",
    requirements: [
      { description: "Late night sessions", current: 4, target: 7 },
    ],
    progress: 57,
    rewards: { points: 400, title: "Night Learner" },
  },
  {
    id: "social-butterfly",
    icon: "🦋",
    name: "Social Butterfly",
    description: "Share 10 achievements on social media",
    category: "Special",
    rarity: "Common",
    requirements: [
      { description: "Achievements shared", current: 0, target: 10 },
    ],
    progress: 0,
    rewards: { points: 150 },
  },
];

export const achievementCategories = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
  "Special",
] as const;

export const achievementRarities = {
  Common: { color: "text-muted-foreground", bg: "bg-muted/50", border: "border-muted" },
  Rare: { color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/30" },
  Epic: { color: "text-accent", bg: "bg-accent/10", border: "border-accent/30" },
  // Ensure high contrast on gradient background
  Legendary: { color: "text-primary-foreground", bg: "bg-gradient-primary", border: "border-primary/50" },
};
