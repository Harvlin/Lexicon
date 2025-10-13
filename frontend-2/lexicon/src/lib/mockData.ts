// Mock data for preview purposes

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  progress: number; // 0-100
  thumbnail: string;
  type: 'video' | 'reading' | 'interactive' | 'quiz';
  tags: string[];
  isFavorite?: boolean;
  completedAt?: string;
  videoUrl?: string; // For video lessons
}

export interface UserProgress {
  lessonsCompleted: number;
  totalLessons: number;
  streakDays: number;
  totalPoints: number;
  level: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const mockUser = {
  name: "Sarah Johnson",
  email: "sarah.j@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  joinedDate: "2024-01-15",
};

export const mockProgress: UserProgress = {
  lessonsCompleted: 47,
  totalLessons: 120,
  streakDays: 12,
  totalPoints: 2450,
  level: 8,
  badges: [
    {
      id: "1",
      name: "Quick Learner",
      description: "Complete 10 lessons",
      icon: "⚡",
      earnedAt: "2024-08-15",
    },
    {
      id: "2",
      name: "Week Warrior",
      description: "7-day learning streak",
      icon: "🔥",
      earnedAt: "2024-09-01",
    },
    {
      id: "3",
      name: "Knowledge Seeker",
      description: "Explore 5 different categories",
      icon: "🎓",
      earnedAt: "2024-09-10",
    },
  ],
};

export const mockLessons: Lesson[] = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    description: "Learn the fundamentals of ML algorithms and their applications in real-world scenarios.",
    category: "Data Science",
    difficulty: "beginner",
    duration: 15,
    progress: 75,
    thumbnail: "🤖",
    type: "video",
    tags: ["AI", "Algorithms", "Python"],
    isFavorite: true,
    videoUrl: "https://www.youtube.com/embed/ukzFI9rgwfU",
  },
  {
    id: "2",
    title: "Advanced React Patterns",
    description: "Master compound components, render props, and custom hooks for scalable applications.",
    category: "Web Development",
    difficulty: "advanced",
    duration: 30,
    progress: 40,
    thumbnail: "⚛️",
    type: "interactive",
    tags: ["React", "JavaScript", "Frontend"],
  },
  {
    id: "3",
    title: "UX Design Principles",
    description: "Understanding user psychology and creating intuitive, accessible interfaces.",
    category: "Design",
    difficulty: "intermediate",
    duration: 20,
    progress: 100,
    thumbnail: "🎨",
    type: "reading",
    tags: ["UX", "UI", "Design Thinking"],
    completedAt: "2024-09-20",
  },
  {
    id: "4",
    title: "SQL Database Optimization",
    description: "Techniques for query optimization, indexing strategies, and performance tuning.",
    category: "Database",
    difficulty: "intermediate",
    duration: 25,
    progress: 0,
    thumbnail: "💾",
    type: "interactive",
    tags: ["SQL", "Performance", "Database"],
  },
  {
    id: "5",
    title: "Python for Data Analysis",
    description: "Work with pandas, numpy, and matplotlib to analyze and visualize data.",
    category: "Data Science",
    difficulty: "beginner",
    duration: 35,
    progress: 60,
    thumbnail: "🐍",
    type: "video",
    tags: ["Python", "Data", "Analytics"],
    isFavorite: true,
    videoUrl: "https://www.youtube.com/embed/GPVsHOlRBBI",
  },
  {
    id: "6",
    title: "Cloud Architecture Patterns",
    description: "Design scalable, resilient cloud infrastructure using AWS and microservices.",
    category: "Cloud Computing",
    difficulty: "advanced",
    duration: 45,
    progress: 20,
    thumbnail: "☁️",
    type: "reading",
    tags: ["AWS", "Architecture", "DevOps"],
  },
];

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is the primary purpose of supervised learning in machine learning?",
    options: [
      "To find patterns in unlabeled data",
      "To train models using labeled input-output pairs",
      "To optimize algorithms without any data",
      "To reduce computational complexity",
    ],
    correctAnswer: 1,
    explanation: "Supervised learning uses labeled data where each input has a corresponding output, allowing the model to learn the relationship between inputs and outputs.",
  },
  {
    id: "q2",
    question: "Which of the following is NOT a common activation function in neural networks?",
    options: ["ReLU", "Sigmoid", "Tanh", "Gradient"],
    correctAnswer: 3,
    explanation: "Gradient is not an activation function; it's used in the backpropagation algorithm. ReLU, Sigmoid, and Tanh are all common activation functions.",
  },
  {
    id: "q3",
    question: "What does overfitting mean in machine learning?",
    options: [
      "The model performs equally well on training and test data",
      "The model performs well on training data but poorly on new data",
      "The model fails to learn from the training data",
      "The model takes too long to train",
    ],
    correctAnswer: 1,
    explanation: "Overfitting occurs when a model learns the training data too well, including its noise and outliers, resulting in poor generalization to new data.",
  },
];

export const mockFlashcards = [
  {
    id: "f1",
    front: "What is Machine Learning?",
    back: "Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing algorithms that can access data and use it to learn for themselves.",
  },
  {
    id: "f2",
    front: "Define 'Training Data'",
    back: "Training data is the dataset used to train a machine learning model. It contains input features and their corresponding output labels, allowing the model to learn patterns and relationships.",
  },
  {
    id: "f3",
    front: "What is Cross-Validation?",
    back: "Cross-validation is a technique to assess how well a model generalizes to unseen data. It involves partitioning data into subsets, training on some subsets, and validating on others to evaluate performance.",
  },
  {
    id: "f4",
    front: "Explain 'Feature Engineering'",
    back: "Feature engineering is the process of selecting, modifying, or creating new features from raw data to improve model performance. It's crucial for building effective ML models.",
  },
];

export const categories = [
  "All",
  "Data Science",
  "Web Development",
  "Design",
  "Database",
  "Cloud Computing",
  "Mobile Development",
  "Cybersecurity",
];
