import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Trophy, 
  Calendar, 
  Clock, 
  Target, 
  Zap, 
  Brain, 
  Code, 
  Award,
  Star,
  TrendingUp,
  BookOpen,
  Edit3,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import profileAvatar from '@/assets/profile-avatar.jpg';

const Profile: React.FC = () => {
  const [activeStreak, setActiveStreak] = useState(15);
  
  const stats = [
    { label: "Lessons Completed", value: 42, icon: BookOpen, color: "text-neural-blue" },
    { label: "Current Streak", value: activeStreak, icon: Zap, color: "text-neural-orange" },
    { label: "Skill Points", value: 1250, icon: Star, color: "text-neural-cyan" },
    { label: "Certificates", value: 3, icon: Award, color: "text-neural-purple" }
  ];

  const achievements = [
    { title: "First Steps", description: "Completed your first lesson", earned: true, date: "2024-01-15" },
    { title: "Code Warrior", description: "Solved 25 coding challenges", earned: true, date: "2024-01-20" },
    { title: "Streak Master", description: "Maintained a 7-day learning streak", earned: true, date: "2024-01-25" },
    { title: "AI Whisperer", description: "Used AI tutor 50 times", earned: false, date: null },
    { title: "Knowledge Seeker", description: "Completed 100 lessons", earned: false, date: null }
  ];

  const skillProgress = [
    { skill: "JavaScript", progress: 85, level: "Advanced" },
    { skill: "React", progress: 70, level: "Intermediate" },
    { skill: "Python", progress: 60, level: "Intermediate" },
    { skill: "TypeScript", progress: 45, level: "Beginner" },
    { skill: "Node.js", progress: 30, level: "Beginner" }
  ];

  const recentActivity = [
    { type: "lesson", title: "Advanced React Patterns", date: "2 hours ago", points: 50 },
    { type: "achievement", title: "Earned 'Code Warrior' badge", date: "1 day ago", points: 100 },
    { type: "lesson", title: "TypeScript Fundamentals", date: "2 days ago", points: 40 },
    { type: "streak", title: "Extended learning streak to 15 days", date: "3 days ago", points: 25 }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Profile Header */}
          <Card className="card-gradient border-primary/20 mb-6">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-primary/20">
                    <AvatarImage src={profileAvatar} alt="Profile" />
                    <AvatarFallback className="text-2xl bg-primary/20">JD</AvatarFallback>
                  </Avatar>
                  <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 rounded-full p-2">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">John Doe</h1>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      Level 12
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Full-stack developer learning advanced React patterns and AI integration
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">JavaScript Expert</Badge>
                    <Badge variant="secondary">React Developer</Badge>
                    <Badge variant="secondary">Quick Learner</Badge>
                  </div>
                </div>
                
                <Button variant="outline" className="hover-glow">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-gradient hover-lift">
                  <CardContent className="p-6 text-center">
                    <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-2xl font-bold text-gradient-ai">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Learning Progress */}
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Progress</span>
                        <span>68%</span>
                      </div>
                      <Progress value={68} className="h-3 progress-neural" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>This Week</span>
                        <span>5 lessons completed</span>
                      </div>
                      <Progress value={83} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Goals */}
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Current Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div>
                        <p className="font-medium">Master React Hooks</p>
                        <p className="text-sm text-muted-foreground">7/10 lessons completed</p>
                      </div>
                      <Progress value={70} className="w-20 h-2" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div>
                        <p className="font-medium">Complete TypeScript Course</p>
                        <p className="text-sm text-muted-foreground">3/15 lessons completed</p>
                      </div>
                      <Progress value={20} className="w-20 h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`card-gradient hover-lift ${achievement.earned ? 'border-primary/30' : 'opacity-60'}`}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        achievement.earned ? 'bg-primary/20 text-primary' : 'bg-secondary/30 text-muted-foreground'
                      }`}>
                        <Trophy className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold mb-2">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                      {achievement.earned && (
                        <Badge variant="secondary" className="bg-success/20 text-success">
                          Earned {achievement.date}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle>Skill Progression</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {skillProgress.map((skill, index) => (
                    <motion.div
                      key={skill.skill}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{skill.skill}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              skill.level === 'Advanced' ? 'default' :
                              skill.level === 'Intermediate' ? 'secondary' : 'outline'
                            }>
                              {skill.level}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                          </div>
                        </div>
                        <Progress value={skill.progress} className="h-2" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'lesson' ? 'bg-neural-blue/20 text-neural-blue' :
                        activity.type === 'achievement' ? 'bg-neural-purple/20 text-neural-purple' :
                        'bg-neural-orange/20 text-neural-orange'
                      }`}>
                        {activity.type === 'lesson' && <BookOpen className="w-5 h-5" />}
                        {activity.type === 'achievement' && <Trophy className="w-5 h-5" />}
                        {activity.type === 'streak' && <Zap className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                      <Badge variant="secondary">+{activity.points} XP</Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;