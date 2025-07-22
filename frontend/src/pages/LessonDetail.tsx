import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  Maximize, 
  Clock, 
  Star, 
  User,
  CheckCircle,
  Circle,
  FileText,
  HelpCircle,
  MessageCircle,
  Brain,
  Zap,
  Send
} from "lucide-react";
import { MockAPI, type Lesson } from "@/utils/mockApi";

interface LessonProgress {
  videoWatched: boolean;
  summaryReviewed: boolean;
  quizCompleted: boolean;
  flashcardsReviewed: boolean;
}

const LessonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary");
  const [videoProgress, setVideoProgress] = useState(19);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("2:45");
  const [totalTime, setTotalTime] = useState("14:23");
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{id: string, type: 'user' | 'ai', content: string}>>([]);
  
  const [progress, setProgress] = useState<LessonProgress>({
    videoWatched: true,
    summaryReviewed: true,
    quizCompleted: true,
    flashcardsReviewed: true
  });

  const [aiContent, setAiContent] = useState({
    summary: null as any,
    quiz: null as any,
    flashcards: null as any,
    loading: false
  });

  useEffect(() => {
    loadLesson();
  }, [id]);

  const loadLesson = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await MockAPI.getLessonById(id);
      setLesson(data);
      
      // Load AI content
      loadAIContent();
    } catch (error) {
      console.error("Failed to load lesson:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAIContent = async () => {
    if (!id) return;
    
    try {
      setAiContent(prev => ({...prev, loading: true}));
      
      const [summary, quiz, flashcards] = await Promise.all([
        MockAPI.summarizeLesson(id),
        MockAPI.generateQuiz(id),
        MockAPI.generateFlashcards(id)
      ]);
      
      setAiContent({
        summary,
        quiz,
        flashcards,
        loading: false
      });
    } catch (error) {
      console.error("Failed to load AI content:", error);
      setAiContent(prev => ({...prev, loading: false}));
    }
  };

  const handleAskQuestion = async () => {
    if (!chatQuestion.trim() || !id) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: chatQuestion
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatQuestion("");
    
    try {
      const response = await MockAPI.askQuestion(id, chatQuestion);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: response.answer
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
    }
  };

  const markComplete = async () => {
    if (!id) return;
    
    try {
      await MockAPI.recordProgress(id, 'completed');
      navigate('/library');
    } catch (error) {
      console.error("Failed to mark complete:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Button onClick={() => navigate('/library')}>
            Back to Library
          </Button>
        </div>
      </div>
    );
  }

  const overallProgress = Object.values(progress).filter(Boolean).length / Object.values(progress).length * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/library')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Library
              </Button>
              <div className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span className="font-semibold">{lesson.title}</span>
                <span className="text-muted-foreground">by {lesson.author}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{lesson.duration} min</span>
              </div>
              <Badge variant="outline">{lesson.level}</Badge>
              <Button onClick={markComplete} className="bg-accent hover:bg-accent/90">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <Card>
                <CardContent className="p-0">
                  <div className="relative bg-black rounded-t-lg overflow-hidden">
                    <div className="aspect-video flex items-center justify-center">
                      <div className="text-6xl text-white/20">
                        <Play className="h-16 w-16" />
                      </div>
                    </div>
                    
                    {/* Video Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="space-y-2">
                        <Progress value={videoProgress} className="h-1" />
                        <div className="flex items-center justify-between text-white text-sm">
                          <div className="flex items-center space-x-4">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="text-white hover:bg-white/20"
                            >
                              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                            <span>{currentTime} / {totalTime}</span>
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
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Study Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-accent" />
                    AI Study Tools
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    AI-powered tools to enhance your learning experience
                  </p>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="summary">
                        <FileText className="h-4 w-4 mr-2" />
                        Summary
                      </TabsTrigger>
                      <TabsTrigger value="quiz">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Quiz
                      </TabsTrigger>
                      <TabsTrigger value="flashcards">
                        <Zap className="h-4 w-4 mr-2" />
                        Flashcards
                      </TabsTrigger>
                      <TabsTrigger value="qna">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Q&A
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="summary" className="space-y-4">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Key Takeaways</h3>
                        {aiContent.summary?.keyPoints?.map((point: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                            <span>{point}</span>
                          </div>
                        ))}
                        
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="text-sm leading-relaxed">
                            {aiContent.summary?.summary || "This lesson covers the fundamental React Hooks including useState and useEffect, showing how they revolutionize functional component development by enabling state management and side effect handling."}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="quiz" className="space-y-4">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Test Your Knowledge</h3>
                        {aiContent.quiz?.questions?.map((question: any, index: number) => (
                          <Card key={index} className="p-4">
                            <h4 className="font-medium mb-3">{question.question}</h4>
                            <div className="space-y-2">
                              {question.options.map((option: string, optIndex: number) => (
                                <label key={optIndex} className="flex items-center space-x-2 cursor-pointer">
                                  <input type="radio" name={`question-${index}`} className="text-primary" />
                                  <span className="text-sm">{option}</span>
                                </label>
                              ))}
                            </div>
                          </Card>
                        ))}
                        <Button className="w-full">Submit Quiz</Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="flashcards" className="space-y-4">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Flashcards</h3>
                        {aiContent.flashcards?.map((card: any, index: number) => (
                          <Card key={index} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                            <div className="space-y-2">
                              <h4 className="font-medium">{card.term}</h4>
                              <p className="text-sm text-muted-foreground">{card.definition}</p>
                              {card.example && (
                                <p className="text-sm text-accent">Example: {card.example}</p>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="qna" className="space-y-4">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Ask Questions</h3>
                        
                        <div className="bg-muted/50 rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
                          {chatMessages.length === 0 ? (
                            <p className="text-muted-foreground text-center">Ask me anything about this lesson!</p>
                          ) : (
                            <div className="space-y-3">
                              {chatMessages.map((message) => (
                                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[80%] p-3 rounded-lg ${
                                    message.type === 'user' 
                                      ? 'bg-primary text-primary-foreground' 
                                      : 'bg-background border'
                                  }`}>
                                    <p className="text-sm">{message.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Textarea
                            placeholder="Ask about this lesson..."
                            value={chatQuestion}
                            onChange={(e) => setChatQuestion(e.target.value)}
                            className="flex-1 min-h-[50px]"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAskQuestion();
                              }
                            }}
                          />
                          <Button onClick={handleAskQuestion} disabled={!chatQuestion.trim()}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Lesson Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lesson.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-warning fill-current" />
                    <span className="text-sm">{lesson.rating} ({lesson.students} students)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lesson.duration} min</span>
                  </div>
                  <Badge>{lesson.level}</Badge>
                  <p className="text-sm text-muted-foreground">{lesson.description}</p>
                </CardContent>
              </Card>

              {/* Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Lesson Progress</span>
                      <span>{Math.round(overallProgress)}%</span>
                    </div>
                    <Progress value={overallProgress} />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Video watched</span>
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Summary reviewed</span>
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Quiz completed</span>
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Flashcards reviewed</span>
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Lessons */}
              <Card>
                <CardHeader>
                  <CardTitle>Related Lessons</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: "Advanced React Patterns", duration: "18 min" },
                    { title: "React Context API", duration: "12 min" },
                    { title: "Custom Hooks Lab", duration: "20 min" }
                  ].map((relatedLesson, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div className="w-8 h-8 bg-accent/20 rounded flex items-center justify-center">
                        <Play className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{relatedLesson.title}</p>
                        <p className="text-xs text-muted-foreground">{relatedLesson.duration}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LessonDetail;