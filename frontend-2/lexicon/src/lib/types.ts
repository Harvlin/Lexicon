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

export interface QuizQuestionDTO {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface FlashcardDTO {
  id: string;
  front: string;
  back: string;
}

export interface QuizAnswerDTO {
  questionId: string;
  selectedOption: number;
}

export interface QuizSubmissionResultDTO {
  total: number;
  correct: number;
  score: number; // 0-100
  passed?: boolean;
  pointsAwarded?: number;
}

// Onboarding & Schedule
export interface OnboardingDTO {
  goals: string[];
  skills: string[];
  dailyHours: number;
  preferredTime?: string; // legacy display
  schedulePreset: string; // "Morning" | "Afternoon" | "Evening" | "Late Night" | "Custom"
  daysOfWeek: string[];   // when Custom
  specificTime?: string;  // HH:mm when Custom
  reminderEnabled?: boolean;
  completedAt?: string;   // ISO
}

export interface ScheduleSessionDTO {
  id: string;
  lessonId: string;
  date: string;            // yyyy-mm-dd
  plannedMinutes: number;
  actualMinutes?: number;
  status: 'planned' | 'in-progress' | 'done' | 'skipped';
  createdAt: string;
  updatedAt: string;
  focusTag?: string;
}

export interface ScheduleWeekDTO {
  weekId: string;
  sessions: ScheduleSessionDTO[];
  source?: 'api' | 'onboarding' | 'mock';
}

// AI Chat
export interface ChatRequestDTO {
  prompt: string;
  lessonId?: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

export interface ChatMessageDTO {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO
}

// User preferences / settings
export interface NotificationPrefsDTO {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
}

// Auth
export interface AuthResponseDTO {
  token: string;           // JWT access token
  tokenType?: string;      // e.g., "Bearer"
  user?: UserDTO;          // optional current user payload
  // Backend may return a flattened view as well
  name?: string;
  email?: string;
  role?: string;
  goals?: string;          // comma-separated backend format
}

export interface MessageResponseDTO {
  message: string;
}

// Study Materials (Videos)
export interface StudyVideoDTO {
  id: number;
  videoId: string;
  title: string;
  channelTitle: string;
  videoUrl: string;
  topic: string;
  createdAt: string;
  hasQuestions: boolean;
  hasFlashcards: boolean;
  hasSummary: boolean;
}

export interface StudyVideosResponseDTO {
  status: string;
  count: number;
  videos: StudyVideoDTO[];
}

export interface StudyVideoQuestionDTO {
  id: number;
  questionNumber: number;
  question: string;
  answer: string;
}

export interface StudyFlashcardDTO {
  id: number;
  cardNumber: number;
  front: string;
  back: string;
}

export interface StudyVideoDetailDTO extends StudyVideoDTO {
  summary?: {
    content: string;
    length: number;
  };
  questions?: StudyVideoQuestionDTO[];
  flashcards?: StudyFlashcardDTO[];
}

export interface StudyVideoDetailResponseDTO {
  status: string;
  video: StudyVideoDetailDTO;
}

// Process endpoint results
export interface ProcessMaterialVideoDTO {
  videoNumber: number;
  title: string;
  channel: string;
  url: string;
  videoId: string;
  transcript?: {
    fullLength: number;
    preview: string;
  };
  summary?: {
    content: string;
    length?: number;
  };
  studyMaterials?: unknown; // structure is dynamic (quiz + flashcards combined); can narrow later
  status: string; // success | failed
  processingTimeMs: number;
  error?: string;
}

export interface ProcessResponseDTO {
  status: string; // success | error
  userPreference: string;
  generatedTopic?: string;
  videos?: ProcessMaterialVideoDTO[];
  learningPlan?: string;
  savedToDatabase?: boolean;
  savedVideoIds?: number[];
  savedCount?: number;
  saveError?: string;
  saveReason?: string;
  processing?: {
    totalTimeMs: number;
    totalTimeFormatted: string;
    step1_topicMs?: number;
    step2_searchMs?: number;
    step3_processMs?: number;
    step4_planMs?: number;
  };
  videoStats?: {
    target: number;
    successful: number;
    candidatesFound: number;
  };
  error?: string; // when status === error
  suggestion?: string; // when status === error
}

