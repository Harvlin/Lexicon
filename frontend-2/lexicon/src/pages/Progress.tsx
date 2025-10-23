import { Award, TrendingUp, Clock, BookOpen, CheckCircle2, Target, Calendar, Lock, Sparkles, Trophy, Flame } from "lucide-react";
import { AchievementIconId, BadgeIconByName, LessonTypeIcon } from "@/lib/iconMaps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { mockUser, mockProgress, mockLessons } from "@/lib/mockData";
import { achievementsData, achievementCategories, achievementRarities } from "@/lib/achievementsData";
import { useEffect, useMemo, useState } from "react";
import { endpoints } from "@/lib/api";
import type { UserProgressSummaryDTO, LessonDTO } from "@/lib/types";

export default function ProgressPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [progress, setProgress] = useState<UserProgressSummaryDTO | null>(null);
  const [completed, setCompleted] = useState<LessonDTO[]>([]);
  const [inProgress, setInProgress] = useState<LessonDTO[]>([]);

  useEffect(() => {
    endpoints.progress
      .summary()
      .then(setProgress)
      .catch(() => setProgress(mockProgress));
    // Optional: fetch completed/in-progress lessons; fallback to mock
    endpoints.lessons
      .list({ completed: true, limit: 50 })
      .then((res) => setCompleted(res.items))
      .catch(() => setCompleted(mockLessons.filter((l) => l.progress === 100)));
    endpoints.lessons
      .list({ inProgress: true, limit: 50 })
      .then((res) => setInProgress(res.items))
      .catch(() => setInProgress(mockLessons.filter((l) => l.progress > 0 && l.progress < 100)));
  }, []);
  
  const completedLessons = completed.length ? completed : mockLessons.filter((l) => l.progress === 100);
  const inProgressLessons = inProgress.length ? inProgress : mockLessons.filter((l) => l.progress > 0 && l.progress < 100);
  const summary = progress || mockProgress;
  const completionRate = useMemo(() => (summary.totalLessons ? (summary.lessonsCompleted / summary.totalLessons) * 100 : 0), [summary]);

  const earnedAchievements = achievementsData.filter((a) => a.progress === 100);
  const inProgressAchievements = achievementsData.filter((a) => a.progress > 0 && a.progress < 100);
  const lockedAchievements = achievementsData.filter((a) => a.progress === 0);
  
  const filteredAchievements = selectedCategory === "All"
    ? achievementsData
    : achievementsData.filter((a) => a.category === selectedCategory);

  // Mock activity data for the last 7 days
  const activityData = [
    { day: "Mon", lessons: 3, points: 150 },
    { day: "Tue", lessons: 2, points: 100 },
    { day: "Wed", lessons: 4, points: 200 },
    { day: "Thu", lessons: 1, points: 50 },
    { day: "Fri", lessons: 3, points: 150 },
    { day: "Sat", lessons: 5, points: 250 },
    { day: "Sun", lessons: 2, points: 100 },
  ];

  const maxLessons = Math.max(...activityData.map((d) => d.lessons));

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading font-bold text-accent mb-2">
            My Progress & Achievements
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your learning journey and celebrate your milestones
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-muted/50 border">
          <ProgressRing
            progress={completionRate}
            size={120}
            strokeWidth={10}
          />
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Overall Progress
            </p>
            <p className="text-2xl font-heading font-bold text-primary">
              {Math.round(completionRate)}%
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group hover:shadow-card transition-all hover:-translate-y-1 border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lessons Completed
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-heading text-primary mb-2">
              {summary.lessonsCompleted}
            </div>
            <div className="flex items-center gap-2">
              <Progress value={(summary.totalLessons ? (summary.lessonsCompleted / summary.totalLessons) * 100 : 0)} className="h-1.5" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {inProgressLessons.length} in progress
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-card transition-all hover:-translate-y-1 border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Points
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-heading text-secondary mb-2">
              {summary.totalPoints.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                Top 15%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              of all learners
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-card transition-all hover:-translate-y-1 border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Achievements
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-heading text-accent mb-2">
              {summary.badges.length}
            </div>
            <div className="flex items-center gap-2 mb-2">
              {summary.badges.slice(0, 3).map((badge) => (
                <div key={badge.id} className="h-7 w-7 rounded-md border bg-muted grid place-items-center" title={badge.name}>
                  <BadgeIconByName name={badge.name} />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              badges earned
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-card transition-all hover:-translate-y-1 border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Streak
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-heading mb-2">{summary.streakDays}</div>
            <div className="h-2 rounded-full bg-muted overflow-hidden mb-2">
              <div className="h-full w-3/4 bg-accent rounded-full animate-pulse-soft"></div>
            </div>
            <p className="text-sm text-muted-foreground">
              days in a row
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Weekly Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-48">
            {activityData.map((day) => (
              <div
                key={day.day}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div className="relative w-full group">
                  <div
                    className="w-full bg-accent/80 rounded-t-lg transition-all hover:opacity-90 cursor-pointer"
                    style={{
                      height: `${(day.lessons / maxLessons) * 160}px`,
                      minHeight: "20px",
                    }}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-card border rounded-lg px-2 py-1 text-xs whitespace-nowrap shadow-medium">
                    {day.lessons} lessons • {day.points}pts
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Learning Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Time</p>
              <p className="text-3xl font-bold font-heading">87h</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-3xl font-bold font-heading text-secondary">12h</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Avg per Day</p>
              <p className="text-3xl font-bold font-heading text-accent">1.7h</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <div className="space-y-6">
        {/* Achievement Stats Header */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-primary/10 border-primary/20 border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Earned</p>
                  <p className="text-4xl font-heading font-bold text-primary">{earnedAchievements.length}</p>
                </div>
                <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-card">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-warm/10 border-accent/20 border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">In Progress</p>
                  <p className="text-4xl font-heading font-bold text-accent">{inProgressAchievements.length}</p>
                </div>
                <div className="h-16 w-16 rounded-2xl bg-gradient-warm flex items-center justify-center shadow-card">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Locked</p>
                  <p className="text-4xl font-heading font-bold">{lockedAchievements.length}</p>
                </div>
                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                  <Lock className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-muted/50 p-2">
            {achievementCategories.map((category) => (
              <TabsTrigger
                key={category}
                value={category.toLowerCase()}
                onClick={() => setSelectedCategory(category)}
                className="px-4"
              >
                {category}
                <Badge variant="secondary" className="ml-2">
                  {category === "All" 
                    ? achievementsData.length 
                    : achievementsData.filter((a) => a.category === category).length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory.toLowerCase()} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {filteredAchievements.map((achievement) => {
                const isEarned = achievement.progress === 100;
                const isLocked = achievement.progress === 0;
                const rarityStyle = achievementRarities[achievement.rarity];

                return (
                  <Card
                    key={achievement.id}
                    className={`group hover:shadow-card transition-all hover:-translate-y-1 cursor-pointer border-2 relative overflow-hidden ${
                      isEarned 
                        ? "border-success/30 bg-success/5" 
                        : isLocked 
                        ? "border-dashed opacity-75" 
                        : "border-accent/30 bg-accent/5"
                    }`}
                  >
                    {/* Rarity indicator */}
                    <div className={`absolute top-0 right-0 w-24 h-24 ${rarityStyle.bg} rounded-bl-full opacity-20`}></div>
                    
                    <CardContent className="p-6 relative">
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 border bg-muted shadow-sm transition-transform group-hover:scale-105 ${isLocked ? "opacity-60" : ""}`}>
                          <AchievementIconId id={achievement.id} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className={`font-heading font-bold text-lg mb-1 ${
                                isEarned ? "text-primary" : ""
                              }`}>
                                {achievement.name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <Badge className={`${rarityStyle.bg} ${rarityStyle.color} ${rarityStyle.border} border`}>
                                  {achievement.rarity}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {achievement.category}
                                </Badge>
                              </div>
                            </div>
                            {isLocked && <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
                          </div>

                          <p className="text-sm text-muted-foreground mb-4">
                            {achievement.description}
                          </p>

                          {/* Requirements */}
                          {!isEarned && (
                            <div className="space-y-3 mb-4">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Requirements
                              </p>
                              {achievement.requirements.map((req, idx) => (
                                <div key={idx} className="space-y-1">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{req.description}</span>
                                    <span className="font-semibold">
                                      {req.current}/{req.target}
                                    </span>
                                  </div>
                                  <Progress 
                                    value={(req.current / req.target) * 100} 
                                    className="h-2"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Progress or Earned Status */}
                          <div className="flex items-center justify-between pt-3 border-t">
                            {isEarned ? (
                              <Badge className="bg-success/20 text-success border-success/30">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Earned {new Date(achievement.earnedAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </Badge>
                            ) : (
                              <>
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Progress: </span>
                                  <span className="font-bold text-accent">{achievement.progress}%</span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Reward: </span>
                                  <span className="font-bold text-secondary">+{achievement.rewards.points} pts</span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Title reward badge */}
                          {achievement.rewards.title && (
                            <Badge variant="secondary" className="mt-2">
                              <Award className="h-3 w-3 mr-1" />
                              Title: {achievement.rewards.title}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Completed Lessons */}
      <div className="space-y-4">
        <h2 className="text-2xl font-heading font-bold">Completed Lessons</h2>
        {completedLessons.map((lesson) => (
          <Card key={lesson.id} className="group hover:shadow-card transition-all hover:-translate-y-1">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-md border bg-muted grid place-items-center">
                  <LessonTypeIcon type={lesson.type} />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold mb-1 group-hover:text-primary transition-colors">
                    {lesson.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{lesson.category}</span>
                    <span>•</span>
                    <span>{lesson.duration}m</span>
                    {lesson.completedAt && (
                      <>
                        <span>•</span>
                        <span>
                          Completed {new Date(lesson.completedAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <Badge className="bg-success/20 text-success border-success/30">
                  <Award className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
