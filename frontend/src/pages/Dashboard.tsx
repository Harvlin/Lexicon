import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  Target, 
  Trophy, 
  TrendingUp, 
  Zap,
  Play,
  ArrowRight,
  Calendar,
  Flame,
  Star,
  Code,
  Video,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  // Mock user data - replace with actual API calls
  const userData = {
    name: "Alex Johnson",
    streak: 7,
    totalLessons: 45,
    weeklyGoal: 5,
    completedThisWeek: 3,
    badges: 8,
    level: "Intermediate",
    xp: 2450
  };

  const recentActivity = [
    { id: 1, title: "React Hooks Deep Dive", type: "video", duration: "12 min", completed: true, lessonType: "video" },
    { id: 2, title: "Python Data Structures", type: "text", duration: "8 min", completed: true, lessonType: "text" },
    { id: 3, title: "API Design Best Practices", type: "lab", duration: "15 min", completed: false, lessonType: "lab" },
  ];

  const recommendedLessons = [
    { id: 1, title: "Advanced TypeScript Patterns", type: "video", duration: "14 min", difficulty: "Advanced", tags: ["TypeScript", "Programming"], lessonType: "video" },
    { id: 2, title: "UI/UX Design Principles", type: "text", duration: "10 min", difficulty: "Beginner", tags: ["Design", "UX"], lessonType: "text" },
    { id: 3, title: "Docker Container Optimization", type: "lab", duration: "18 min", difficulty: "Intermediate", tags: ["Docker", "DevOps"], lessonType: "lab" },
    { id: 4, title: "Machine Learning Basics", type: "video", duration: "16 min", difficulty: "Beginner", tags: ["ML", "Python"], lessonType: "video" },
  ];

  const todaysPlan = [
    { id: 1, title: "Complete React Native lesson", time: "9:00 AM", completed: true },
    { id: 2, title: "Review flashcards: JavaScript", time: "2:00 PM", completed: false },
    { id: 3, title: "Take quiz: Database Design", time: "6:00 PM", completed: false },
  ];

  const achievements = [
    { id: 1, title: "Week Warrior", description: "7-day learning streak", icon: Flame, earned: true },
    { id: 2, title: "Code Master", description: "Completed 10 coding labs", icon: Code, earned: true },
    { id: 3, title: "Knowledge Seeker", description: "Read 25 text lessons", icon: BookOpen, earned: false },
    { id: 4, title: "Video Learner", description: "Watched 20 video lessons", icon: Video, earned: true },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'text': return FileText;
      case 'lab': return Code;
      default: return BookOpen;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/10 text-green-500';
      case 'Intermediate': return 'bg-yellow-500/10 text-yellow-500';
      case 'Advanced': return 'bg-red-500/10 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {userData.name}! 👋</h1>
            <p className="text-muted-foreground mt-1">Ready to continue your learning journey?</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/study-plan')}>
              <Calendar className="h-4 w-4 mr-2" />
              Study Plan
            </Button>
            <Button variant="learning" onClick={() => navigate('/library')}>
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Library
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="lesson-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Learning Streak</p>
                  <p className="text-2xl font-bold flex items-center">
                    {userData.streak}
                    <Flame className="h-5 w-5 text-orange-500 ml-1" />
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lesson-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Lessons</p>
                  <p className="text-2xl font-bold">{userData.totalLessons}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lesson-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">{userData.completedThisWeek}/{userData.weeklyGoal}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lesson-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Badges Earned</p>
                  <p className="text-2xl font-bold">{userData.badges}</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weekly Progress */}
            <Card className="lesson-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Weekly Progress
                </CardTitle>
                <CardDescription>
                  {userData.completedThisWeek} of {userData.weeklyGoal} lessons completed this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={(userData.completedThisWeek / userData.weeklyGoal) * 100} className="mb-4" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{userData.completedThisWeek} completed</span>
                  <span>{userData.weeklyGoal - userData.completedThisWeek} remaining</span>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Lessons */}
            <Card className="lesson-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-accent" />
                    Recommended for You
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/library')}>
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedLessons.map((lesson) => {
                    const TypeIcon = getTypeIcon(lesson.type);
                    return (
                      <div key={lesson.id} className={`lesson-card lesson-${lesson.lessonType} group cursor-pointer`} onClick={() => navigate(`/lesson/${lesson.id}`)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg bg-lesson-${lesson.lessonType}/10 flex items-center justify-center`}>
                              <TypeIcon className={`h-5 w-5 text-lesson-${lesson.lessonType}`} />
                            </div>
                            <div>
                              <h4 className="font-medium group-hover:text-primary transition-colors">{lesson.title}</h4>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{lesson.duration}</span>
                                <span>•</span>
                                <Badge variant="secondary" className={getDifficultyColor(lesson.difficulty)}>
                                  {lesson.difficulty}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {lesson.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="lesson-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity) => {
                    const TypeIcon = getTypeIcon(activity.type);
                    return (
                      <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg bg-lesson-${activity.lessonType}/10 flex items-center justify-center`}>
                            <TypeIcon className={`h-4 w-4 text-lesson-${activity.lessonType}`} />
                          </div>
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">{activity.duration}</p>
                          </div>
                        </div>
                        {activity.completed ? (
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            Completed
                          </Badge>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => navigate(`/lesson/${activity.id}`)}>
                            Continue
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Plan */}
            <Card className="lesson-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Today's Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaysPlan.map((task) => (
                    <div key={task.id} className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${task.completed ? 'bg-success border-success' : 'border-muted-foreground'}`} />
                      <div className="flex-1">
                        <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{task.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/study-plan')}>
                  View Full Plan
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="lesson-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-warning" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className={`flex items-center space-x-3 p-2 rounded-lg ${achievement.earned ? 'bg-warning/10' : 'bg-muted/20'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-warning/20' : 'bg-muted/40'}`}>
                        <achievement.icon className={`h-4 w-4 ${achievement.earned ? 'text-warning' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {achievement.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                      {achievement.earned && <Star className="h-4 w-4 text-warning" />}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/profile')}>
                  View All Badges
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}