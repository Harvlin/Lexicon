// Mock API utilities for development before backend is ready

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  goals: string[];
  avatar?: string;
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'lab';
  duration: number; // in minutes
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  author: string;
  rating: number;
  students: number;
  thumbnail?: string;
  content_url?: string;
  featured: boolean;
  trending: boolean;
  topics: string[];
  created_at: string;
}

export interface Quiz {
  id: string;
  lesson_id: string;
  questions: QuizQuestion[];
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

export interface Flashcard {
  id: string;
  lesson_id: string;
  term: string;
  definition: string;
  example?: string;
}

export interface Progress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completed_at?: string;
  quiz_score?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: Record<string, any>;
}

export interface UserBadge {
  user_id: string;
  badge_id: string;
  awarded_at: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'student',
    goals: ['React', 'TypeScript', 'Full-stack Development'],
    createdAt: '2024-01-01'
  }
];

const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'React Hooks Fundamentals',
    description: 'Master the core hooks in React including useState, useEffect, and custom hooks',
    type: 'video',
    duration: 14,
    category: 'Frontend',
    level: 'beginner',
    author: 'Sarah Chen',
    rating: 4.8,
    students: 1234,
    featured: true,
    trending: true,
    topics: ['React', 'Hooks', 'JavaScript'],
    created_at: '2024-01-15'
  },
  {
    id: '2',
    title: 'Python Data Structures Deep Dive',
    description: 'Comprehensive guide to Python lists, dictionaries, sets, and tuples in practice',
    type: 'article',
    duration: 10,
    category: 'Backend',
    level: 'intermediate',
    author: 'Mike Rodriguez',
    rating: 4.7,
    students: 987,
    featured: false,
    trending: true,
    topics: ['Python', 'Data Structures', 'Algorithms'],
    created_at: '2024-01-10'
  },
  {
    id: '3',
    title: 'Docker Container Lab',
    description: 'Hands-on practice with Docker containers, images, and orchestration',
    type: 'lab',
    duration: 20,
    category: 'DevOps',
    level: 'advanced',
    author: 'Alex Thompson',
    rating: 4.9,
    students: 756,
    featured: true,
    trending: false,
    topics: ['Docker', 'Containers', 'DevOps'],
    created_at: '2024-01-12'
  },
  {
    id: '4',
    title: 'UI/UX Design Principles',
    description: 'Learn the fundamental principles of user interface and experience design',
    type: 'video',
    duration: 16,
    category: 'Design',
    level: 'beginner',
    author: 'Emma Davis',
    rating: 4.6,
    students: 1456,
    featured: false,
    trending: true,
    topics: ['UI', 'UX', 'Design'],
    created_at: '2024-01-08'
  },
  {
    id: '5',
    title: 'Advanced React Patterns',
    description: 'Deep dive into advanced React patterns and performance optimization',
    type: 'article',
    duration: 12,
    category: 'Frontend',
    level: 'advanced',
    author: 'Sarah Chen',
    rating: 4.8,
    students: 654,
    featured: true,
    trending: false,
    topics: ['React', 'Performance', 'Patterns'],
    created_at: '2024-01-05'
  },
  {
    id: '6',
    title: 'Node.js API Development',
    description: 'Build scalable REST APIs with Node.js and Express framework',
    type: 'video',
    duration: 18,
    category: 'Backend',
    level: 'intermediate',
    author: 'Mike Rodriguez',
    rating: 4.7,
    students: 892,
    featured: false,
    trending: true,
    topics: ['Node.js', 'API', 'Express'],
    created_at: '2024-01-03'
  }
];

// Mock API functions
export class MockAPI {
  // Auth endpoints
  static async register(data: { name: string; email: string; password: string; role: string; goals: string[] }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: data.role as any,
      goals: data.goals,
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    return { user: newUser, token: 'mock-jwt-token' };
  }

  static async login(data: { email: string; password: string }) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(u => u.email === data.email);
    if (!user) {
      throw new Error('User not found');
    }
    
    return { user, token: 'mock-jwt-token' };
  }

  static async getCurrentUser() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers[0]; // Return first user as current user
  }

  // Lessons endpoints
  static async getLessons(filters?: { category?: string; level?: string; type?: string }) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let filteredLessons = [...mockLessons];
    
    if (filters?.category && filters.category !== 'All') {
      filteredLessons = filteredLessons.filter(lesson => 
        lesson.category.toLowerCase() === filters.category?.toLowerCase()
      );
    }
    
    if (filters?.level) {
      filteredLessons = filteredLessons.filter(lesson => lesson.level === filters.level);
    }
    
    if (filters?.type) {
      filteredLessons = filteredLessons.filter(lesson => lesson.type === filters.type);
    }
    
    return filteredLessons;
  }

  static async getLessonById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const lesson = mockLessons.find(l => l.id === id);
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    
    return lesson;
  }

  // AI Study endpoints
  static async summarizeLesson(lessonId: string) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      summary: `This lesson covers the key concepts of the topic with practical examples. 
      You'll learn about the fundamental principles, best practices, and common pitfalls to avoid. 
      The content is designed to be digestible and actionable for immediate application.`,
      keyPoints: [
        'Understanding core concepts and terminology',
        'Practical implementation strategies',
        'Common mistakes and how to avoid them',
        'Best practices for real-world application'
      ]
    };
  }

  static async generateQuiz(lessonId: string) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      id: Date.now().toString(),
      lesson_id: lessonId,
      questions: [
        {
          id: '1',
          question: 'What is the primary benefit of this concept?',
          options: [
            'Improved performance',
            'Better code organization', 
            'Enhanced user experience',
            'All of the above'
          ],
          correct_answer: 3,
          explanation: 'This concept provides multiple benefits including improved performance, better code organization, and enhanced user experience.'
        },
        {
          id: '2',
          question: 'When should you use this approach?',
          options: [
            'Always',
            'Never',
            'When specific conditions are met',
            'Only in production'
          ],
          correct_answer: 2,
          explanation: 'This approach should be used when specific conditions are met, such as when you need to optimize for particular use cases.'
        }
      ],
      created_at: new Date().toISOString()
    };
  }

  static async generateFlashcards(lessonId: string) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return [
      {
        id: '1',
        lesson_id: lessonId,
        term: 'Key Concept',
        definition: 'A fundamental principle that forms the foundation of understanding',
        example: 'Used in scenarios where you need to apply basic principles'
      },
      {
        id: '2',
        lesson_id: lessonId,
        term: 'Best Practice',
        definition: 'A method or technique that has been proven to be effective',
        example: 'Following established patterns that lead to successful outcomes'
      },
      {
        id: '3',
        lesson_id: lessonId,
        term: 'Common Pitfall',
        definition: 'A frequent mistake that beginners often make',
        example: 'Avoiding shortcuts that might seem appealing but cause problems later'
      }
    ];
  }

  static async askQuestion(lessonId: string, question: string) {
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    return {
      answer: `Based on the lesson content, ${question.toLowerCase().replace('?', '')} is typically handled by following the established patterns and best practices outlined in the material. The key is to understand the underlying principles and apply them systematically.`,
      sources: [
        'Lesson section 2.1: Core Concepts',
        'Lesson section 3.2: Implementation Details'
      ],
      confidence: 0.85
    };
  }

  // Progress endpoints
  static async recordProgress(lessonId: string, status: Progress['status']) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      message: `Progress recorded: ${status}`
    };
  }

  static async getProgressStats(userId: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      lessons_completed: 47,
      current_streak: 12,
      total_time_spent: 1240, // minutes
      badges_earned: 8,
      quiz_average: 87.5,
      this_week_progress: 6
    };
  }

  // Recommendations
  static async getRecommendations(userId: string) {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return mockLessons.slice(0, 3); // Return first 3 lessons as recommendations
  }
}

// Helper function to simulate network errors occasionally
export const withRandomError = async <T>(fn: () => Promise<T>, errorRate = 0.1): Promise<T> => {
  if (Math.random() < errorRate) {
    throw new Error('Network error - please try again');
  }
  return fn();
};