// Mock data for the AI Learning Platform

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'developer' | 'designer';
  goals: string[];
  avatar?: string;
  joinedAt: string;
  stats: {
    lessonsCompleted: number;
    streakDays: number;
    totalPoints: number;
    level: number;
  };
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'code-lab' | 'interactive';
  duration: number; // in minutes
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
  contentUrl?: string;
  code?: string;
  language?: string;
  createdAt: string;
  views: number;
  rating: number;
  isCompleted?: boolean;
  progress?: number;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: Question[];
  timeLimit?: number;
  passingScore: number;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'code';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  lessonId: string;
  term: string;
  definition: string;
  example?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: string;
}

export interface StudyPlan {
  id: string;
  userId: string;
  goals: string[];
  dailyMinutes: number;
  schedule: StudySession[];
  createdAt: string;
}

export interface StudySession {
  id: string;
  lessonId: string;
  scheduledAt: string;
  completed: boolean;
  type: 'lesson' | 'review' | 'quiz' | 'practice';
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  lessonContext?: string;
}

// Mock Data
export const mockUser: User = {
  id: '1',
  name: 'Alex Rodriguez',
  email: 'alex@example.com',
  role: 'developer',
  goals: ['Master React', 'Learn AI/ML', 'Full-Stack Development'],
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  joinedAt: '2024-01-15',
  stats: {
    lessonsCompleted: 45,
    streakDays: 12,
    totalPoints: 2850,
    level: 8
  }
};

export const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to React Hooks',
    description: 'Learn the fundamentals of React Hooks and how they revolutionize state management in functional components.',
    type: 'video',
    duration: 15,
    topics: ['React', 'Hooks', 'State Management'],
    difficulty: 'beginner',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    contentUrl: 'https://example.com/video/react-hooks',
    createdAt: '2024-01-10',
    views: 1250,
    rating: 4.8,
    isCompleted: true,
    progress: 100
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    description: 'Deep dive into advanced TypeScript patterns including generics, conditional types, and utility types.',
    type: 'text',
    duration: 25,
    topics: ['TypeScript', 'Advanced Patterns', 'Generics'],
    difficulty: 'advanced',
    thumbnail: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=400&h=250&fit=crop',
    createdAt: '2024-01-08',
    views: 892,
    rating: 4.9,
    progress: 65
  },
  {
    id: '3',
    title: 'Building a REST API with Node.js',
    description: 'Create a robust REST API using Node.js, Express, and MongoDB with authentication and validation.',
    type: 'code-lab',
    duration: 45,
    topics: ['Node.js', 'Express', 'API Development', 'MongoDB'],
    difficulty: 'intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
    code: `const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/users', (req, res) => {
  // Get users logic
  res.json({ users: [] });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
    language: 'javascript',
    createdAt: '2024-01-05',
    views: 2105,
    rating: 4.7,
    progress: 30
  },
  {
    id: '4',
    title: 'Machine Learning Fundamentals',
    description: 'Understanding the core concepts of machine learning, including supervised and unsupervised learning.',
    type: 'interactive',
    duration: 35,
    topics: ['Machine Learning', 'AI', 'Data Science'],
    difficulty: 'intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop',
    createdAt: '2024-01-03',
    views: 1876,
    rating: 4.6
  },
  {
    id: '5',
    title: 'CSS Grid Layout Mastery',
    description: 'Master CSS Grid Layout with practical examples and real-world responsive design patterns.',
    type: 'video',
    duration: 20,
    topics: ['CSS', 'Grid Layout', 'Responsive Design'],
    difficulty: 'intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
    createdAt: '2024-01-01',
    views: 1432,
    rating: 4.5
  }
];

export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    lessonId: '1',
    title: 'React Hooks Quiz',
    timeLimit: 10,
    passingScore: 70,
    questions: [
      {
        id: '1',
        question: 'Which hook is used for managing state in functional components?',
        type: 'multiple-choice',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 1,
        explanation: 'useState is the primary hook for managing local state in functional components.'
      },
      {
        id: '2',
        question: 'useEffect runs after every render by default.',
        type: 'true-false',
        correctAnswer: 0,
        explanation: 'True. useEffect runs after every render unless you provide a dependency array.'
      }
    ]
  }
];

export const mockFlashcards: Flashcard[] = [
  {
    id: '1',
    lessonId: '1',
    term: 'useState',
    definition: 'A React hook that allows you to add state to functional components',
    example: 'const [count, setCount] = useState(0);',
    difficulty: 'easy',
    nextReview: '2024-01-20'
  },
  {
    id: '2',
    lessonId: '1',
    term: 'useEffect',
    definition: 'A React hook that lets you perform side effects in functional components',
    example: 'useEffect(() => { document.title = `Count: ${count}`; }, [count]);',
    difficulty: 'medium',
    nextReview: '2024-01-21'
  }
];

export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    rarity: 'common',
    earnedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Code Warrior',
    description: 'Complete 10 coding exercises',
    icon: '⚔️',
    rarity: 'rare',
    earnedAt: '2024-01-18'
  },
  {
    id: '3',
    name: 'Streak Master',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    rarity: 'epic',
    earnedAt: '2024-01-20'
  },
  {
    id: '4',
    name: 'AI Pioneer',
    description: 'Master advanced AI concepts',
    icon: '🤖',
    rarity: 'legendary'
  }
];

export const mockStudyPlan: StudyPlan = {
  id: '1',
  userId: '1',
  goals: ['Master React', 'Learn AI/ML'],
  dailyMinutes: 45,
  schedule: [
    {
      id: '1',
      lessonId: '2',
      scheduledAt: '2024-01-21T09:00:00Z',
      completed: false,
      type: 'lesson'
    },
    {
      id: '2',
      lessonId: '1',
      scheduledAt: '2024-01-21T14:00:00Z',
      completed: true,
      type: 'review'
    }
  ],
  createdAt: '2024-01-15'
};

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'user',
    content: 'Can you explain the difference between useState and useReducer?',
    timestamp: '2024-01-21T10:30:00Z',
    lessonContext: '1'
  },
  {
    id: '2',
    type: 'ai',
    content: 'Great question! Both useState and useReducer are React hooks for managing state, but they serve different purposes:\n\n**useState** is ideal for:\n- Simple state that doesn\'t involve complex logic\n- Independent state variables\n- Basic state updates\n\n**useReducer** is better for:\n- Complex state logic\n- Multiple sub-values in state\n- State that depends on previous state\n\nThink of useReducer as a more powerful version of useState when you need more control over state updates.',
    timestamp: '2024-01-21T10:31:00Z',
    lessonContext: '1'
  }
];

// Helper functions
export const getRandomLessons = (count: number = 3): Lesson[] => {
  return mockLessons.sort(() => 0.5 - Math.random()).slice(0, count);
};

export const getLessonById = (id: string): Lesson | undefined => {
  return mockLessons.find(lesson => lesson.id === id);
};

export const getQuizByLessonId = (lessonId: string): Quiz | undefined => {
  return mockQuizzes.find(quiz => quiz.lessonId === lessonId);
};

export const getFlashcardsByLessonId = (lessonId: string): Flashcard[] => {
  return mockFlashcards.filter(card => card.lessonId === lessonId);
};

export const getUserProgress = () => {
  const completed = mockLessons.filter(lesson => lesson.isCompleted).length;
  const total = mockLessons.length;
  return { completed, total, percentage: Math.round((completed / total) * 100) };
};