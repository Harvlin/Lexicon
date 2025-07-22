import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Target, 
  Play, 
  Star, 
  TrendingUp, 
  Calendar,
  User,
  Settings,
  Award,
  Zap
} from "lucide-react";

export default function Dashboard() {
  const [currentStreak, setCurrentStreak] = useState(12);
  const [completedLessons, setCompletedLessons] = useState(47);
  const [skillsProgress, setSkillsProgress] = useState(73);

  const recentActivity = [
    { id: 1, type: "lesson", title: "React Hooks Fundamentals", completed: true, time: "2 hours ago" },
    { id: 2, type: "quiz", title: "JavaScript ES6 Quiz", score: 85, time: "1 day ago" },
    { id: 3, type: "lesson", title: "CSS Grid Layout", completed: true, time: "2 days ago" },
    { id: 4, type: "achievement", title: "First Week Streak", time: "3 days ago" }
  ];

  const currentLearningPath = [
    { id: 1, title: "React Fundamentals", progress: 85, lessons: 12, completed: 10 },
    { id: 2, title: "Advanced JavaScript", progress: 60, lessons: 15, completed: 9 },
    { id: 3, title: "Node.js Basics", progress: 30, lessons: 10, completed: 3 }
  ];

  const upcomingLessons = [
    { id: 1, title: "React State Management", duration: "8 min", difficulty: "Intermediate" },
    { id: 2, title: "API Integration", duration: "12 min", difficulty: "Advanced" },
    { id: 3, title: "Testing Fundamentals", duration: "6 min", difficulty: "Beginner" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, John!</h1>
          <p className="text-muted-foreground mt-2">Continue your learning journey</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedLessons}</p>
                  <p className="text-sm text-muted-foreground">Lessons Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{currentStreak}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-success/20 rounded-lg">
                  <Trophy className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{skillsProgress}%</p>
                  <p className="text-sm text-muted-foreground">Skills Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-warning/20 rounded-lg">
                  <Zap className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-sm text-muted-foreground">XP Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>Continue Learning</span>
                </CardTitle>
                <CardDescription>
                  Pick up where you left off
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentLearningPath.map((path) => (
                    <div key={path.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{path.title}</h3>
                        <Badge variant="outline">{path.completed}/{path.lessons} lessons</Badge>
                      </div>
                      <Progress value={path.progress} className="mb-2" />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{path.progress}% complete</span>
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/course/${path.id}`}>Continue</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Tabs */}
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                          <div className="p-2 bg-muted rounded-lg">
                            {activity.type === "lesson" && <BookOpen className="h-4 w-4" />}
                            {activity.type === "quiz" && <Target className="h-4 w-4" />}
                            {activity.type === "achievement" && <Award className="h-4 w-4" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">{activity.time}</p>
                          </div>
                          {activity.score && (
                            <Badge variant="secondary">{activity.score}%</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upcoming" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Lessons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingLessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{lesson.title}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{lesson.duration}</span>
                              <Badge variant="outline" className="text-xs">
                                {lesson.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <Button size="sm" asChild>
                            <Link to={`/lesson/${lesson.id}`}>Start</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg text-center">
                        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Trophy className="h-6 w-6 text-accent" />
                        </div>
                        <h3 className="font-semibold">First Week</h3>
                        <p className="text-sm text-muted-foreground">Complete 7 days in a row</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Star className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold">Quick Learner</h3>
                        <p className="text-sm text-muted-foreground">Complete 50 lessons</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Learning Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Daily Goal</span>
                      <span className="text-sm text-muted-foreground">2/3 lessons</span>
                    </div>
                    <Progress value={67} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Weekly Goal</span>
                      <span className="text-sm text-muted-foreground">12/15 lessons</span>
                    </div>
                    <Progress value={80} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/library">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Library
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Study Reminder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Study Reminder</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Don't break your streak! You've been learning for {currentStreak} days straight.
                </p>
                <Button className="w-full" size="sm">
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}