import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  Maximize, 
  BookOpen, 
  Brain, 
  HelpCircle, 
  MessageCircle,
  Sparkles,
  CheckCircle,
  Clock,
  User,
  Star,
  Send,
  RotateCcw,
  Lightbulb,
  FileText,
  Video,
  Code
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function LessonViewer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [chatMessage, setChatMessage] = useState("");
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);

  // Mock lesson data - replace with actual API call
  const lesson = {
    id: parseInt(id || "1"),
    title: "React Hooks Fundamentals",
    description: "Master the core hooks in React including useState, useEffect, and custom hooks",
    type: "video",
    duration: "14 min",
    difficulty: "Beginner",
    category: "Frontend",
    instructor: "Sarah Chen",
    rating: 4.8,
    students: 1234,
    content: `
      <h2>Introduction to React Hooks</h2>
      <p>React Hooks were introduced in React 16.8 as a way to use state and other React features in functional components...</p>
      <h3>useState Hook</h3>
      <p>The useState hook allows you to add state to functional components...</p>
      <pre><code>const [count, setCount] = useState(0);</code></pre>
    `,
    videoUrl: "/api/placeholder/video", // Mock video URL
    lessonType: "video" as const
  };

  // Mock AI-generated content
  const summary = {
    keyPoints: [
      "React Hooks enable state management in functional components",
      "useState is used for managing component state",
      "useEffect handles side effects and lifecycle events",
      "Custom hooks allow for reusable stateful logic",
      "Hooks must be called at the top level of components"
    ],
    overview: "This lesson covers the fundamental React Hooks including useState and useEffect, showing how they revolutionize functional component development by enabling state management and side effect handling."
  };

  const quiz = {
    questions: [
      {
        id: 1,
        question: "Which hook is used to manage state in functional components?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correct: "useState",
        explanation: "useState is the primary hook for managing state in functional components."
      },
      {
        id: 2,
        question: "When should you call React Hooks?",
        options: ["Inside loops", "In nested functions", "At the top level", "In event handlers"],
        correct: "At the top level",
        explanation: "Hooks must be called at the top level of React functions to ensure consistent behavior."
      },
      {
        id: 3,
        question: "What does useEffect do?",
        options: ["Manages state", "Handles side effects", "Creates context", "Optimizes performance"],
        correct: "Handles side effects",
        explanation: "useEffect is used to perform side effects like data fetching, subscriptions, and DOM manipulation."
      }
    ]
  };

  const flashcards = [
    {
      id: 1,
      front: "What is useState?",
      back: "A React Hook that lets you add state to functional components. It returns an array with the current state value and a function to update it.",
      example: "const [count, setCount] = useState(0);"
    },
    {
      id: 2,
      front: "What is useEffect?",
      back: "A React Hook that lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined.",
      example: "useEffect(() => { document.title = count; }, [count]);"
    },
    {
      id: 3,
      front: "Rules of Hooks",
      back: "1. Only call Hooks at the top level\n2. Only call Hooks from React functions\n3. Don't call Hooks inside loops, conditions, or nested functions",
      example: "// ✅ Good\nconst [name, setName] = useState('');\n\n// ❌ Bad\nif (condition) {\n  const [name, setName] = useState('');\n}"
    }
  ];

  const handleQuizSubmit = () => {
    const correct = quiz.questions.filter((q, index) => 
      selectedAnswers[index] === q.correct
    ).length;
    
    toast({
      title: "Quiz Complete!",
      description: `You scored ${correct}/${quiz.questions.length} correct answers.`,
    });
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    // TODO: Send to AI service
    toast({
      title: "AI Assistant",
      description: "Feature coming soon! AI will help answer your questions about the lesson.",
    });
    setChatMessage("");
  };

  const markComplete = () => {
    toast({
      title: "Lesson Completed!",
      description: "Great job! Your progress has been saved.",
    });
    navigate('/dashboard');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'text': return FileText;
      case 'lab': return Code;
      default: return BookOpen;
    }
  };

  const TypeIcon = getTypeIcon(lesson.type);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/library')}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Library
              </Button>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-lg bg-lesson-${lesson.lessonType}/10 flex items-center justify-center`}>
                  <TypeIcon className={`h-4 w-4 text-lesson-${lesson.lessonType}`} />
                </div>
                <div>
                  <h1 className="font-semibold">{lesson.title}</h1>
                  <p className="text-sm text-muted-foreground">by {lesson.instructor}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{lesson.duration}</span>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                {lesson.difficulty}
              </Badge>
              <Button variant="success" onClick={markComplete}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player / Content Area */}
            <Card className="lesson-card">
              <CardContent className="p-0">
                {lesson.type === "video" ? (
                  <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
                    <div className={`absolute inset-0 bg-lesson-${lesson.lessonType}/20 flex items-center justify-center`}>
                      <Video className={`h-16 w-16 text-lesson-${lesson.lessonType}`} />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between bg-black/50 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="text-white hover:bg-white/20"
                          >
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                          </Button>
                          <span className="text-white text-sm">2:45 / 14:23</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                            <Maximize className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Progress value={19} className="mt-2" />
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Study Tools */}
            <Card className="lesson-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  AI Study Tools
                </CardTitle>
                <CardDescription>
                  AI-powered tools to enhance your learning experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="summary" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="summary" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Summary
                    </TabsTrigger>
                    <TabsTrigger value="quiz" className="flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Quiz
                    </TabsTrigger>
                    <TabsTrigger value="flashcards" className="flex items-center">
                      <Brain className="h-4 w-4 mr-2" />
                      Flashcards
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Q&A
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="space-y-4">
                    <div className="ai-tool-panel">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2 text-primary" />
                        Key Takeaways
                      </h3>
                      <ul className="space-y-2">
                        {summary.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-success mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm">{point}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                        <p className="text-sm">{summary.overview}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="quiz" className="space-y-4">
                    <div className="ai-tool-panel">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">
                          Question {currentQuestionIndex + 1} of {quiz.questions.length}
                        </h3>
                        <Progress value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} className="w-24" />
                      </div>
                      
                      {quiz.questions[currentQuestionIndex] && (
                        <div className="space-y-4">
                          <p className="font-medium">{quiz.questions[currentQuestionIndex].question}</p>
                          <div className="space-y-2">
                            {quiz.questions[currentQuestionIndex].options.map((option, index) => (
                              <label key={index} className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                                <input
                                  type="radio"
                                  name={`question-${currentQuestionIndex}`}
                                  value={option}
                                  checked={selectedAnswers[currentQuestionIndex] === option}
                                  onChange={(e) => setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: e.target.value }))}
                                  className="text-primary"
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                          
                          <div className="flex justify-between">
                            <Button
                              variant="outline"
                              disabled={currentQuestionIndex === 0}
                              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                            >
                              Previous
                            </Button>
                            {currentQuestionIndex === quiz.questions.length - 1 ? (
                              <Button variant="learning" onClick={handleQuizSubmit}>
                                Submit Quiz
                              </Button>
                            ) : (
                              <Button
                                variant="learning"
                                disabled={!selectedAnswers[currentQuestionIndex]}
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                              >
                                Next
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="flashcards" className="space-y-4">
                    <div className="ai-tool-panel">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">
                          Card {currentFlashcardIndex + 1} of {flashcards.length}
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowFlashcardAnswer(false);
                            setCurrentFlashcardIndex(0);
                          }}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>

                      <div className="min-h-[300px] bg-gradient-primary rounded-lg p-6 text-primary-foreground flex flex-col justify-center items-center text-center">
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold">
                            {showFlashcardAnswer ? "Answer" : "Question"}
                          </h4>
                          <p className="text-lg">
                            {showFlashcardAnswer 
                              ? flashcards[currentFlashcardIndex].back 
                              : flashcards[currentFlashcardIndex].front
                            }
                          </p>
                          {showFlashcardAnswer && flashcards[currentFlashcardIndex].example && (
                            <div className="mt-4 p-3 bg-black/20 rounded-lg font-mono text-sm">
                              <pre>{flashcards[currentFlashcardIndex].example}</pre>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between mt-4">
                        <Button
                          variant="outline"
                          disabled={currentFlashcardIndex === 0}
                          onClick={() => {
                            setCurrentFlashcardIndex(prev => prev - 1);
                            setShowFlashcardAnswer(false);
                          }}
                        >
                          Previous Card
                        </Button>
                        
                        <Button
                          variant="learning"
                          onClick={() => setShowFlashcardAnswer(!showFlashcardAnswer)}
                        >
                          {showFlashcardAnswer ? "Show Question" : "Show Answer"}
                        </Button>

                        <Button
                          variant="outline"
                          disabled={currentFlashcardIndex === flashcards.length - 1}
                          onClick={() => {
                            setCurrentFlashcardIndex(prev => prev + 1);
                            setShowFlashcardAnswer(false);
                          }}
                        >
                          Next Card
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="chat" className="space-y-4">
                    <div className="ai-tool-panel">
                      <div className="space-y-4">
                        <div className="h-64 border border-border rounded-lg p-4 bg-muted/20 flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>Ask questions about this lesson</p>
                            <p className="text-sm">AI-powered Q&A coming soon!</p>
                          </div>
                        </div>
                        <form onSubmit={handleChatSubmit} className="flex space-x-2">
                          <Input
                            placeholder="Ask a question about React Hooks..."
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            className="flex-1"
                          />
                          <Button type="submit" variant="ai">
                            <Send className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lesson Info */}
            <Card className="lesson-card">
              <CardHeader>
                <CardTitle>Lesson Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{lesson.instructor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{lesson.rating} ({lesson.students} students)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{lesson.duration}</span>
                </div>
                <div>
                  <Badge variant="secondary">{lesson.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{lesson.description}</p>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card className="lesson-card">
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Lesson Progress</span>
                    <span>19%</span>
                  </div>
                  <Progress value={19} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Video watched</span>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Summary reviewed</span>
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Quiz completed</span>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Flashcards reviewed</span>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Lessons */}
            <Card className="lesson-card">
              <CardHeader>
                <CardTitle>Related Lessons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "Advanced React Patterns", duration: "16 min", type: "video" },
                  { title: "React Context API", duration: "12 min", type: "text" },
                  { title: "Custom Hooks Lab", duration: "20 min", type: "lab" }
                ].map((related, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{related.title}</p>
                      <p className="text-xs text-muted-foreground">{related.duration}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}