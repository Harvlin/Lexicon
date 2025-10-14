import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  MessageSquare,
  CreditCard,
  HelpCircle,
  CheckCircle2,
  Clock,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChatBot } from "@/components/lesson/ChatBot";
import { Flashcards } from "@/components/lesson/Flashcards";
import { Quiz } from "@/components/lesson/Quiz";
import { mockLessons } from "@/lib/mockData";
import { endpoints } from "@/lib/api";
import type { LessonDTO } from "@/lib/types";
import { toast } from "sonner";

export default function Lesson() {
  const { id } = useParams();
  const [lesson, setLesson] = useState<LessonDTO | null>(null);
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    if (!id) return;
    endpoints.lessons
      .get(id)
      .then(setLesson)
      .catch(() => setLesson(mockLessons.find((l) => l.id === id) || null));
  }, [id]);

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-heading font-bold mb-2">Lesson not found</h2>
        <Link to="/library">
          <Button>Back to Library</Button>
        </Link>
      </div>
    );
  }

  const handleCompleteLesson = () => {
    if (!lesson) return;
    const prev = lesson;
    setLesson({ ...lesson, progress: 100, completedAt: new Date().toISOString() });
    endpoints.lessons
      .complete(lesson.id)
      .then(() => {
        toast.success("Lesson completed! 🎉", { description: "Progress updated." });
      })
      .catch(() => {
        setLesson(prev);
        toast.error("Failed to mark as complete");
      });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-4">
        <Link to="/library">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge>{lesson.category}</Badge>
              <Badge variant="outline">{lesson.difficulty}</Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {lesson.duration}m
              </Badge>
            </div>
            <h1 className="text-4xl font-heading font-bold mb-3">
              {lesson.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {lesson.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {lesson.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {lesson.progress < 100 && (
            <Card className="md:w-64">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-bold text-primary">{lesson.progress}%</span>
                </div>
                <Progress value={lesson.progress} className="h-2" />
                <Button
                  className="w-full bg-accent hover:bg-accent-hover"
                  onClick={handleCompleteLesson}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Complete
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="content" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Lesson</span>
          </TabsTrigger>
          <TabsTrigger value="ai-chat" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">AI Chat</span>
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Flashcards</span>
          </TabsTrigger>
          <TabsTrigger value="quiz" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Quiz</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          {lesson.type === "video" && lesson.videoUrl && (
            <Card>
              <CardContent className="p-0">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={lesson.videoUrl}
                    className="absolute top-0 left-0 w-full h-full rounded-t-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={lesson.title}
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardContent className="p-8 prose prose-slate max-w-none">
              <h2 className="font-heading">Introduction</h2>
              <p>
                Welcome to this comprehensive lesson on {lesson.title}. In this lesson,
                you'll gain a deep understanding of the key concepts and practical
                applications.
              </p>

              <h3 className="font-heading">Learning Objectives</h3>
              <ul>
                <li>Understand the fundamental concepts and terminology</li>
                <li>Learn practical applications and real-world examples</li>
                <li>Develop hands-on skills through interactive exercises</li>
                <li>Apply knowledge to solve common challenges</li>
              </ul>

              <h3 className="font-heading">Key Concepts</h3>
              <p>
                This section introduces the core ideas and principles. Machine learning,
                for instance, represents a paradigm shift in how we approach problem-solving
                with computers. Instead of explicitly programming every rule, we teach
                systems to learn patterns from data.
              </p>

              <div className="bg-primary/5 border-l-4 border-primary p-4 my-6">
                <p className="font-semibold text-primary mb-2">💡 Pro Tip</p>
                <p className="text-sm m-0">
                  Use the AI Chat tab to ask questions about any concept you find
                  challenging. The AI assistant is here to help clarify and provide
                  additional examples!
                </p>
              </div>

              <h3 className="font-heading">Practical Application</h3>
              <p>
                Let's explore how these concepts apply in real-world scenarios. Understanding
                the theory is important, but seeing how it works in practice solidifies
                your knowledge and helps you retain information better.
              </p>

              <h3 className="font-heading">Common Pitfalls</h3>
              <ul>
                <li>Rushing through concepts without practicing</li>
                <li>Not asking questions when confused</li>
                <li>Skipping the interactive exercises and quizzes</li>
              </ul>

              <div className="flex gap-4 mt-8 not-prose">
                <Button
                  onClick={() => setActiveTab("flashcards")}
                  variant="outline"
                >
                  Review with Flashcards
                </Button>
                <Button
                  onClick={() => setActiveTab("quiz")}
                  className="bg-accent hover:bg-accent-hover"
                >
                  Take the Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-chat">
          <ChatBot />
        </TabsContent>

        <TabsContent value="flashcards">
          <Card>
            <CardContent className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-heading font-bold mb-2">Flashcards</h2>
                <p className="text-muted-foreground">
                  Review key concepts with interactive flashcards. Click to flip!
                </p>
              </div>
              <Flashcards />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz">
          <Card>
            <CardContent className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-heading font-bold mb-2">Knowledge Check</h2>
                <p className="text-muted-foreground">
                  Test your understanding with this quiz. Choose the best answer for each question.
                </p>
              </div>
              <Quiz />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
