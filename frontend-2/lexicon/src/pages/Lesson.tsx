import { useEffect, useState, useMemo } from "react";
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
import type { LessonDTO, StudyVideoDetailResponseDTO } from "@/lib/types";
import { toast } from "sonner";

export default function Lesson() {
  const { id } = useParams();
  const [lesson, setLesson] = useState<LessonDTO | null>(null);
  const [videoDetail, setVideoDetail] = useState<StudyVideoDetailResponseDTO | null>(null);
  const isStudyVideo = useMemo(() => !!id && id.startsWith('api-video-'), [id]);
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    if (!id) return;
    // Branch: mapped study-material video vs regular lesson
    if (isStudyVideo) {
      const numericId = Number(id.replace('api-video-', ''));
      if (Number.isNaN(numericId)) return;
      endpoints.studyMaterials.video(numericId)
        .then(detail => {
          setVideoDetail(detail);
          // Map StudyVideoDetailDTO → LessonDTO for UI reuse
          const v = detail.video;
          const toEmbedUrl = (videoId?: string, url?: string): string => {
            if (videoId && videoId.trim()) return `https://www.youtube.com/embed/${videoId.trim()}?rel=0`;
            if (!url) return '';
            try {
              const u = new URL(url);
              if (u.hostname.includes('youtube.com')) {
                if (u.pathname.startsWith('/watch')) {
                  const idQ = u.searchParams.get('v');
                  if (idQ) return `https://www.youtube.com/embed/${idQ}?rel=0`;
                }
                if (u.pathname.startsWith('/shorts/')) {
                  const idS = u.pathname.split('/')[2];
                  if (idS) return `https://www.youtube.com/embed/${idS}?rel=0`;
                }
                if (u.pathname.startsWith('/embed/')) return url;
              }
              if (u.hostname === 'youtu.be') {
                const idB = u.pathname.replace('/', '');
                if (idB) return `https://www.youtube.com/embed/${idB}?rel=0`;
              }
            } catch {}
            return url;
          };
          const mapped: LessonDTO = {
            id: id,
            title: v.title,
            description: v.summary?.content || v.topic || v.channelTitle || 'Video lesson',
            category: v.topic || 'Video',
            difficulty: 'beginner', // Heuristic; could refine later
            duration: 60,
            progress: 0,
            thumbnail: '',
            type: 'video',
            tags: [v.channelTitle, v.topic].filter(Boolean) as string[],
            isFavorite: false,
            videoUrl: toEmbedUrl(v.videoId, v.videoUrl),
          };
          setLesson(mapped);
        })
        .catch(() => {
          // Fallback to mock if something fails
          setLesson(mockLessons.find((l) => l.id === id) || null);
        });
    } else {
      endpoints.lessons
        .get(id)
        .then(setLesson)
        .catch(() => setLesson(mockLessons.find((l) => l.id === id) || null));
    }
  }, [id, isStudyVideo]);

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
    // Only attempt completion API for regular lessons (not mapped study-material videos)
    if (isStudyVideo) {
      // Optimistic local completion only
      setLesson({ ...lesson, progress: 100, completedAt: new Date().toISOString() });
      toast.success("Marked video as completed locally.");
      return;
    }
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
              {isStudyVideo && videoDetail?.video.summary?.content ? (
                <>
                  <h2 className="font-heading">AI-Generated Summary</h2>
                  <p className="whitespace-pre-line">
                    {videoDetail.video.summary.content}
                  </p>
                  <div className="bg-primary/5 border-l-4 border-primary p-4 my-6">
                    <p className="font-semibold text-primary mb-2">🔍 Context</p>
                    <p className="text-sm m-0">
                      This summary was generated from the processed transcript of the selected video.
                      Use Flashcards & Quiz tabs to reinforce retention.
                    </p>
                  </div>
                </>
              ) : (
                <>
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
                  <h3 className="font-heading">Common Pitfalls</h3>
                  <ul>
                    <li>Rushing through concepts without practicing</li>
                    <li>Not asking questions when confused</li>
                    <li>Skipping the interactive exercises and quizzes</li>
                  </ul>
                </>
              )}
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
                  {isStudyVideo ? 'These flashcards are generated from the processed video.' : 'Review key concepts with interactive flashcards. Click to flip!'}
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
                  {isStudyVideo ? 'Questions derived from AI processing of the video transcript.' : 'Test your understanding with this quiz. Choose the best answer for each question.'}
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
