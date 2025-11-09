import { useEffect, useState } from "react";
import { TrendingUp, Clock, Target, Flame } from "lucide-react";
import { BadgeIconByName } from "@/lib/iconMaps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LessonCard } from "@/components/dashboard/LessonCard";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { mockLessons, mockProgress, mockUser } from "@/lib/mockData";
import { endpoints } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { LessonDTO, UserDTO, UserProgressSummaryDTO, StudyVideoDTO } from "@/lib/types";
import heroBanner from "@/assets/hero-banner.jpg";

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [lessons, setLessons] = useState<LessonDTO[]>([]);
  const [videos, setVideos] = useState<StudyVideoDTO[]>([]);
  const [user, setUser] = useState<UserDTO | null>(authUser);
  const [progress, setProgress] = useState<UserProgressSummaryDTO | null>(null);

  useEffect(() => {
    // Prefer auth context user for greeting; fallback to server/me then mock
    if (authUser) {
      setUser(authUser);
    } else {
      endpoints.me
        .get()
        .then(setUser)
        .catch(() => setUser({ name: mockUser.name, email: mockUser.email, avatar: mockUser.avatar }));
    }

    endpoints.progress
      .summary()
      .then(setProgress)
      .catch(() => setProgress(mockProgress));

    // Fetch study-material videos if user is authenticated
    if (authUser) {
      endpoints.studyMaterials.videos()
        .then((res) => setVideos(res.videos || []))
        .catch(() => setVideos([]));
    }

    // Fetch lessons (fallback to empty if endpoint not available)
    endpoints.lessons
      .list({ limit: 20, sort: "recent" })
      .then((res) => setLessons(res.items || []))
      .catch(() => setLessons([]));
  }, [authUser]);

  const handleToggleFavorite = (id: string) => {
    // Optimistic toggle
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === id ? { ...lesson, isFavorite: !lesson.isFavorite } : lesson
      )
    );
    if (!id.startsWith('api-video-')) {
      endpoints.lessons.toggleFavorite(id).catch(() => {
        // revert on error
        setLessons((prev) =>
          prev.map((lesson) =>
            lesson.id === id ? { ...lesson, isFavorite: !lesson.isFavorite } : lesson
          )
        );
      });
    }
  };

  // Map API videos to LessonDTO with embed URLs
  const toEmbedUrl = (videoId?: string, url?: string): string => {
    if (videoId && videoId.trim()) return `https://www.youtube.com/embed/${videoId.trim()}?rel=0`;
    if (!url) return '';
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtube.com')) {
        if (u.pathname.startsWith('/watch')) {
          const id = u.searchParams.get('v');
          if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
        }
        if (u.pathname.startsWith('/shorts/')) {
          const id = u.pathname.split('/')[2];
          if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
        }
        if (u.pathname.startsWith('/embed/')) return url;
      }
      if (u.hostname === 'youtu.be') {
        const id = u.pathname.replace('/', '');
        if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
      }
    } catch {}
    return url;
  };

  const videoLessons: LessonDTO[] = videos.map(v => ({
    id: `api-video-${v.id}`,
    title: v.title,
    description: v.channelTitle || v.topic || 'Video lesson',
    category: v.topic || 'Video',
    difficulty: 'beginner',
    duration: 60,
    progress: 0,
    thumbnail: '',
    type: 'video',
    tags: [v.channelTitle, v.topic].filter(Boolean) as string[],
    isFavorite: false,
    videoUrl: toEmbedUrl(v.videoId, v.videoUrl),
  }));

  // Combine API videos with regular lessons
  const allContent = [...videoLessons, ...lessons];

  const continueLearning = allContent
    .filter((l) => l.progress > 0 && l.progress < 100)
    .slice(0, 3);

  const recommended = allContent
    .filter((l) => l.progress === 0)
    .slice(0, 3);

  const completionRate = progress
    ? (progress.lessonsCompleted / progress.totalLessons) * 100
    : (mockProgress.lessonsCompleted / mockProgress.totalLessons) * 100;

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
  <section className="relative rounded-2xl overflow-hidden bg-gradient-warm text-accent-foreground shadow-medium">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative p-8 md:p-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3 animate-slide-up">
              Welcome back, {(user?.name || mockUser.name).split(" ")[0]}! 👋
            </h1>
            <p className="text-lg md:text-xl opacity-95 mb-6 animate-slide-up">
              Ready to continue your learning journey? You're making great progress!
            </p>
            <Button
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm animate-slide-up"
            >
              Continue Learning
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading text-primary">
              {Math.round(completionRate)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {progress?.lessonsCompleted ?? mockProgress.lessonsCompleted} of {progress?.totalLessons ?? mockProgress.totalLessons} lessons
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Streak
            </CardTitle>
            <Flame className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading text-accent">
              {progress?.streakDays ?? mockProgress.streakDays}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              days in a row 🔥
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Points
            </CardTitle>
            <Target className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading text-secondary">
              {(progress?.totalPoints ?? mockProgress.totalPoints).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Level {progress?.level ?? mockProgress.level}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Learning Time
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-heading">24.5h</div>
            <p className="text-xs text-muted-foreground mt-1">
              this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
              <span>Your Progress</span>
            <Badge variant="secondary" className="ml-2">
              Level {progress?.level ?? mockProgress.level}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ProgressRing
              progress={completionRate}
              size={140}
              strokeWidth={10}
              label="Complete"
            />
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-heading font-semibold mb-2">Recent Achievements</h3>
                <div className="flex flex-wrap gap-2">
                  {(progress?.badges ?? mockProgress.badges).map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20 animate-scale-in hover:scale-105 transition-transform cursor-pointer"
                      title={badge.description}
                    >
                      <span className="h-6 w-6 rounded-md border bg-muted grid place-items-center">
                        <BadgeIconByName name={badge.name} />
                      </span>
                      <span className="text-sm font-medium">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Keep up the great work! Complete 3 more lessons to unlock the "Dedicated Learner" badge.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Learning */}
      {continueLearning.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-heading font-bold">Continue Learning</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {continueLearning.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recommended for You */}
      {recommended.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-heading font-bold">Recommended for You</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommended.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
