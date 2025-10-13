import { Calendar, Target, Mail, MapPin, Edit, Settings as SettingsIcon, BookOpen, TrendingUp, Trophy, Bell, Monitor, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockUser, mockProgress } from "@/lib/mockData";
import { Link } from "react-router-dom";

export default function Profile() {

  return (
    <div className="space-y-8 pb-8 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-heading font-bold text-accent">
          My Profile
        </h1>
        <Link to="/settings">
          <Button variant="outline" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>

      {/* Profile Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/10"></div>
        <CardContent className="relative p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-primary/30 shadow-card">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback className="text-3xl">SJ</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 h-14 w-14 rounded-full bg-accent border-4 border-card flex items-center justify-center shadow-card">
                <div className="text-center">
                  <div className="text-sm font-bold text-white leading-none">
                    {mockProgress.level}
                  </div>
                  <div className="text-[10px] text-white/80 leading-none mt-0.5">
                    Level
                  </div>
                </div>
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-medium"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h2 className="text-3xl font-heading font-bold mb-2">
                  {mockUser.name}
                </h2>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{mockUser.email}</span>
                  </div>
                  <div className="hidden md:block">•</div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>San Francisco, CA</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-3 py-1.5">
                  <Target className="h-4 w-4" />
                  Level {mockProgress.level} Learner
                </Badge>
                <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(mockUser.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </Badge>
                <Badge className="bg-gradient-warm text-white gap-1.5 px-3 py-1.5 animate-pulse-soft shadow-card">
                  🔥 {mockProgress.streakDays} day streak
                </Badge>
              </div>

              <p className="text-muted-foreground mt-4">
                Passionate learner exploring the intersection of technology and education. 
                Always seeking new challenges and opportunities to grow.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Lessons</p>
                <p className="text-3xl font-bold font-heading text-primary">
                  {mockProgress.lessonsCompleted}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Points</p>
                <p className="text-3xl font-bold font-heading text-secondary">
                  {mockProgress.totalPoints.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Achievements</p>
                <p className="text-3xl font-bold font-heading text-accent">
                  {mockProgress.badges.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Preferences */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-heading font-bold mb-4">Learning Preferences</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold mb-1">Focus Areas</p>
                <p className="text-sm text-muted-foreground">Web Development, UI/UX Design</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="font-semibold mb-1">Daily Goal</p>
                <p className="text-sm text-muted-foreground">2 hours per day</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Monitor className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold mb-1">Preferred Device</p>
                <p className="text-sm text-muted-foreground">Desktop & Mobile</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold mb-1">Reminders</p>
                <p className="text-sm text-muted-foreground">Daily at 9:00 AM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA to Progress */}
      <Card className="bg-gradient-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-heading font-bold text-primary mb-2">
                Track Your Learning Journey
              </h3>
              <p className="text-muted-foreground">
                View detailed statistics, achievements, and your learning activity
              </p>
            </div>
            <Link to="/progress">
              <Button className="gap-2 shadow-card">
                View Progress & Achievements
                <BarChart3 className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
