import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Clock, 
  Play, 
  BookOpen, 
  Code, 
  Video, 
  FileText,
  Star,
  TrendingUp,
  Users,
  Grid3X3,
  List,
  SlidersHorizontal
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Library() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");

  // Mock data - replace with actual API calls
  const lessons = [
    {
      id: 1,
      title: "React Hooks Fundamentals",
      description: "Master the core hooks in React including useState, useEffect, and custom hooks",
      type: "video",
      duration: "14 min",
      difficulty: "Beginner",
      category: "Frontend",
      tags: ["React", "JavaScript", "Hooks"],
      rating: 4.8,
      students: 1234,
      thumbnail: "/api/placeholder/300/200",
      instructor: "Sarah Chen",
      lessonType: "video"
    },
    {
      id: 2,
      title: "Python Data Structures Deep Dive",
      description: "Comprehensive guide to lists, dictionaries, sets, and tuples in Python",
      type: "text",
      duration: "10 min",
      difficulty: "Intermediate",
      category: "Backend",
      tags: ["Python", "Data Structures"],
      rating: 4.7,
      students: 892,
      thumbnail: "/api/placeholder/300/200",
      instructor: "Mike Rodriguez",
      lessonType: "text"
    },
    {
      id: 3,
      title: "Docker Container Lab",
      description: "Hands-on practice with Docker containers, images, and orchestration",
      type: "lab",
      duration: "20 min",
      difficulty: "Advanced",
      category: "DevOps",
      tags: ["Docker", "Containers", "DevOps"],
      rating: 4.9,
      students: 567,
      thumbnail: "/api/placeholder/300/200",
      instructor: "Alex Thompson",
      lessonType: "lab"
    },
    {
      id: 4,
      title: "UI/UX Design Principles",
      description: "Learn the fundamental principles of user interface and experience design",
      type: "video",
      duration: "16 min",
      difficulty: "Beginner",
      category: "Design",
      tags: ["UI", "UX", "Design"],
      rating: 4.6,
      students: 2156,
      thumbnail: "/api/placeholder/300/200",
      instructor: "Emma Davis",
      lessonType: "video"
    },
    {
      id: 5,
      title: "SQL Query Optimization",
      description: "Advanced techniques for optimizing database queries and improving performance",
      type: "text",
      duration: "12 min",
      difficulty: "Advanced",
      category: "Database",
      tags: ["SQL", "Database", "Performance"],
      rating: 4.8,
      students: 789,
      thumbnail: "/api/placeholder/300/200",
      instructor: "John Smith",
      lessonType: "text"
    },
    {
      id: 6,
      title: "Machine Learning Basics",
      description: "Introduction to machine learning concepts and practical applications",
      type: "video",
      duration: "18 min",
      difficulty: "Beginner",
      category: "AI/ML",
      tags: ["Machine Learning", "Python", "AI"],
      rating: 4.7,
      students: 1567,
      thumbnail: "/api/placeholder/300/200",
      instructor: "Dr. Lisa Wang",
      lessonType: "video"
    }
  ];

  const categories = ["all", "Frontend", "Backend", "DevOps", "Design", "Database", "AI/ML"];
  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"];
  const durations = ["all", "5-10 min", "10-15 min", "15+ min"];

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

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || lesson.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || lesson.difficulty === selectedDifficulty;
    // For duration filter, you'd implement proper logic based on actual duration values
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const LessonCard = ({ lesson, compact = false }: { lesson: any, compact?: boolean }) => {
    const TypeIcon = getTypeIcon(lesson.type);
    
    if (compact) {
      return (
        <div className={`lesson-card lesson-${lesson.lessonType} group cursor-pointer`} onClick={() => navigate(`/lesson/${lesson.id}`)}>
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-lg bg-lesson-${lesson.lessonType}/10 flex items-center justify-center flex-shrink-0`}>
              <TypeIcon className={`h-8 w-8 text-lesson-${lesson.lessonType}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold group-hover:text-primary transition-colors truncate">{lesson.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{lesson.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {lesson.duration}
                </div>
                <div className="flex items-center">
                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                  {lesson.rating}
                </div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {lesson.students}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge variant="secondary" className={getDifficultyColor(lesson.difficulty)}>
                {lesson.difficulty}
              </Badge>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`lesson-card lesson-${lesson.lessonType} group cursor-pointer`} onClick={() => navigate(`/lesson/${lesson.id}`)}>
        <div className="aspect-video bg-muted rounded-lg mb-4 relative overflow-hidden">
          <div className={`absolute inset-0 bg-lesson-${lesson.lessonType}/20 flex items-center justify-center`}>
            <TypeIcon className={`h-12 w-12 text-lesson-${lesson.lessonType}`} />
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-background/80 text-foreground">
              {lesson.duration}
            </Badge>
          </div>
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="ghost" size="lg" className="text-white hover:bg-white/20">
              <Play className="h-8 w-8" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
              {lesson.title}
            </h3>
            <Badge variant="secondary" className={getDifficultyColor(lesson.difficulty)}>
              {lesson.difficulty}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">{lesson.description}</p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>by {lesson.instructor}</span>
            <div className="flex items-center space-x-2">
              <Star className="h-3 w-3 text-yellow-500" />
              <span>{lesson.rating}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {lesson.tags.slice(0, 3).map((tag: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Learning Library</h1>
            <p className="text-muted-foreground mt-1">Discover and learn from our curated collection</p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="lesson-card">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search lessons, topics, or technologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty === "all" ? "All Levels" : difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration} value={duration}>
                        {duration === "all" ? "Any Duration" : duration}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="all" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              All
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center">
              <Video className="h-4 w-4 mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="lab" className="flex items-center">
              <Code className="h-4 w-4 mr-2" />
              Labs
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                {filteredLessons.length} lessons found
              </p>
            </div>
            
            {viewMode === "grid" ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredLessons.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLessons.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} compact />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Other tab contents would filter by type */}
          <TabsContent value="video" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLessons.filter(l => l.type === "video").map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLessons.filter(l => l.type === "text").map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lab" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLessons.filter(l => l.type === "lab").map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLessons.slice(0, 8).map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
