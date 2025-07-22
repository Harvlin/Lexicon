import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  BookOpen, 
  Trophy, 
  Target, 
  Star,
  Award,
  TrendingUp,
  Clock,
  Zap,
  Camera,
  Settings,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    bio: "Passionate learner exploring the world of technology and innovation.",
    location: "San Francisco, CA",
    joinDate: "January 2024"
  });
  const { toast } = useToast();

  const stats = {
    lessonsCompleted: 47,
    currentStreak: 12,
    totalXP: 2340,
    skillsLearned: 8,
    certificates: 3,
    totalHours: 156
  };

  const achievements = [
    { id: 1, title: "First Steps", description: "Complete your first lesson", earned: true, icon: "🎯" },
    { id: 2, title: "Week Warrior", description: "Maintain a 7-day streak", earned: true, icon: "🔥" },
    { id: 3, title: "Knowledge Seeker", description: "Complete 50 lessons", earned: false, icon: "📚" },
    { id: 4, title: "AI Master", description: "Use AI tools 100 times", earned: true, icon: "🤖" },
    { id: 5, title: "Speed Learner", description: "Complete 10 lessons in one day", earned: false, icon: "⚡" },
    { id: 6, title: "Consistent Learner", description: "Maintain a 30-day streak", earned: false, icon: "🏆" }
  ];

  const recentActivity = [
    { date: "Today", lessons: ["React Hooks Fundamentals", "JavaScript ES6 Features"] },
    { date: "Yesterday", lessons: ["CSS Grid Layout", "Responsive Design Principles"] },
    { date: "2 days ago", lessons: ["Node.js Basics", "Express.js Introduction"] }
  ];

  const certificates = [
    { id: 1, title: "Frontend Development Fundamentals", issueDate: "March 2024", verified: true },
    { id: 2, title: "JavaScript Mastery", issueDate: "February 2024", verified: true },
    { id: 3, title: "React Development", issueDate: "January 2024", verified: true }
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/api/placeholder/150/150" alt="Profile" />
                  <AvatarFallback className="text-2xl">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full"
                  onClick={() => toast({ title: "Photo upload", description: "Photo upload feature coming soon!" })}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">
                      {profileData.firstName} {profileData.lastName}
                    </h1>
                    <p className="text-muted-foreground mt-1">{profileData.bio}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {profileData.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Joined {profileData.joinDate}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4 sm:mt-0">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.lessonsCompleted}</p>
              <p className="text-xs text-muted-foreground">Lessons</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="h-6 w-6 text-warning mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.totalXP}</p>
              <p className="text-xs text-muted-foreground">XP Points</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.skillsLearned}</p>
              <p className="text-xs text-muted-foreground">Skills</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.certificates}</p>
              <p className="text-xs text-muted-foreground">Certificates</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.totalHours}</p>
              <p className="text-xs text-muted-foreground">Hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Frontend Development</span>
                      <Badge>85%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>JavaScript</span>
                      <Badge>72%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>React</span>
                      <Badge>68%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Node.js</span>
                      <Badge>45%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-accent/20 rounded-full flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">50 Lessons Completed</p>
                        <p className="text-sm text-muted-foreground">3 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">2 Week Streak</p>
                        <p className="text-sm text-muted-foreground">1 week ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>
                  Track your learning milestones and unlock new badges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id} 
                      className={`p-4 border rounded-lg text-center ${
                        achievement.earned ? 'bg-muted/30' : 'opacity-50'
                      }`}
                    >
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      {achievement.earned && (
                        <Badge className="mt-2" variant="secondary">Earned</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivity.map((day, index) => (
                    <div key={index}>
                      <h3 className="font-semibold mb-2">{day.date}</h3>
                      <div className="space-y-2">
                        {day.lessons.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                            <BookOpen className="h-4 w-4 text-accent" />
                            <span>{lesson}</span>
                          </div>
                        ))}
                      </div>
                      {index < recentActivity.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Certificates</CardTitle>
                <CardDescription>
                  Certificates you've earned through completing courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{cert.title}</h3>
                          <p className="text-sm text-muted-foreground">Issued {cert.issueDate}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {cert.verified && (
                            <Badge variant="secondary">
                              <Award className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Button size="sm" variant="outline">Download</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                      />
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full">
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.email}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Security</Label>
                      <Button variant="outline" className="w-full justify-start">
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}