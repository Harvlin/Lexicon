import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Trophy,
  Flame,
  Target,
  Clock,
  TrendingUp,
  Star,
  Play,
  Brain,
  Zap,
  Calendar,
  MessageCircle,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/providers/AuthProvider';
import { mockLessons, getRandomLessons, getUserProgress, mockBadges } from '@/lib/mock-data';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const dashboardRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Animate stats cards
    tl.fromTo(
      statsRef.current?.children,
      { opacity: 0, y: 30, scale: 0.9 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }
    );

    // Animate content cards
    tl.fromTo(
      cardsRef.current?.children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: "power2.out"
      },
      "-=0.3"
    );

    return () => {
      tl.kill();
    };
  }, []);

  const recommendedLessons = getRandomLessons(3);
  const progress = getUserProgress();
  const earnedBadges = mockBadges.filter(badge => badge.earnedAt);
  const nextBadge = mockBadges.find(badge => !badge.earnedAt);

  const stats = [
    {
      title: "Lessons Completed",
      value: user?.stats.lessonsCompleted || 0,
      icon: BookOpen,
      color: "text-neural-blue",
      bgColor: "bg-neural-blue/10"
    },
    {
      title: "Current Streak",
      value: `${user?.stats.streakDays || 0} days`,
      icon: Flame,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "Total Points",
      value: user?.stats.totalPoints || 0,
      icon: Trophy,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Level",
      value: user?.stats.level || 1,
      icon: Star,
      color: "text-primary",
      bgColor: "bg-primary/10"
    }
  ];

  const quickActions = [
    {
      title: "Continue Learning",
      description: "Resume where you left off",
      icon: Play,
      href: "/library",
      gradient: "bg-gradient-neural"
    },
    {
      title: "AI Study Assistant",
      description: "Get personalized help",
      icon: Brain,
      href: "/chat",
      gradient: "bg-gradient-ai"
    },
    {
      title: "Study Plan",
      description: "View your schedule",
      icon: Calendar,
      href: "/study-plan",
      gradient: "bg-gradient-code"
    }
  ];

  return (
    <div ref={dashboardRef} className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gradient-ai mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Level {user?.stats.level}
            </Badge>
            <Avatar>
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="card-gradient hover-lift transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div ref={cardsRef} className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link key={action.title} to={action.href}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`${action.gradient} p-4 rounded-xl text-white hover-lift cursor-pointer group`}
                        >
                          <Icon className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform" />
                          <h3 className="font-semibold mb-1">{action.title}</h3>
                          <p className="text-sm opacity-90">{action.description}</p>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Lessons */}
            <Card className="card-gradient">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>Recommended for You</span>
                  </CardTitle>
                  <Link to="/library">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedLessons.map((lesson) => (
                    <Link key={lesson.id} to={`/lesson/${lesson.id}`}>
                      <motion.div
                        whileHover={{ x: 8 }}
                        className="flex items-center space-x-4 p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-secondary/30 transition-all cursor-pointer"
                      >
                        <img
                          src={lesson.thumbnail}
                          alt={lesson.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{lesson.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {lesson.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {lesson.difficulty}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {lesson.duration} min
                            </span>
                          </div>
                        </div>
                        <div className="text-2xl">
                          {lesson.type === 'video' && '🎥'}
                          {lesson.type === 'text' && '📝'}
                          {lesson.type === 'code-lab' && '💻'}
                          {lesson.type === 'interactive' && '🎮'}
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Learning Progress */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Learning Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Overall Progress</span>
                      <span className="text-sm font-semibold">{progress.percentage}%</span>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {progress.completed} of {progress.total} lessons completed
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <h4 className="font-semibold mb-3">Today's Goal</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">Complete React Hooks lesson</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 border-2 border-muted rounded-full" />
                        <span className="text-sm text-muted-foreground">
                          Practice TypeScript exercises
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 border-2 border-muted rounded-full" />
                        <span className="text-sm text-muted-foreground">
                          Review flashcards (5 min)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Recent Badges</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {earnedBadges.slice(0, 4).map((badge) => (
                        <motion.div
                          key={badge.id}
                          whileHover={{ scale: 1.05 }}
                          className="p-3 bg-secondary/30 rounded-lg text-center hover-lift"
                        >
                          <div className="text-2xl mb-1">{badge.icon}</div>
                          <p className="text-xs font-semibold">{badge.name}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {nextBadge && (
                    <div className="pt-4 border-t border-border/50">
                      <h4 className="font-semibold mb-2">Next Badge</h4>
                      <div className="flex items-center space-x-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="text-2xl opacity-50">{nextBadge.icon}</div>
                        <div>
                          <p className="font-medium text-sm">{nextBadge.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {nextBadge.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Chat */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <span>AI Assistant</span>
                </CardTitle>
                <CardDescription>
                  Get instant help with your learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/chat">
                  <Button className="w-full bg-gradient-ai hover:opacity-90 text-white">
                    <Brain className="mr-2 h-4 w-4" />
                    Start Conversation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;