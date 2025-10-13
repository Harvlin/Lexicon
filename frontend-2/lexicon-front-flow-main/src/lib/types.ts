// Shared app types derived from existing mocks
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface BadgeDTO {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string; // ISO
}

export interface UserDTO {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate?: string; // ISO
}

export interface UserProgressSummaryDTO {
  lessonsCompleted: number;
  totalLessons: number;
  streakDays: number;
  totalPoints: number;
  level: number;
  badges: BadgeDTO[];
}

export interface LessonDTO {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  duration: number; // minutes
  progress: number; // 0-100
  thumbnail: string;
  type: 'video' | 'reading' | 'interactive' | 'quiz';
  tags: string[];
  isFavorite?: boolean;
  completedAt?: string; // ISO
  videoUrl?: string;
}

export interface ApiList<T> {
  items: T[];
  total: number;
}
