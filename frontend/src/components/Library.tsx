import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Play, 
  Clock, 
  Star, 
  BookOpen, 
  Code, 
  FileText,
  TrendingUp
} from "lucide-react";

// Mock data for lessons
const lessons = [
  {
    id: 1,
    title: "React Hooks Fundamentals",
    type: "video",
    duration: "12 min",
    category: "Frontend",
    level: "Intermediate",
    author: "Sarah Chen",
    rating: 4.8,
    students: "2.3k",
    thumbnail: "/api/placeholder/300/200",
    featured: true,
    trending: true
  },
  {
    id: 2,
    title: "Python Data Structures Deep Dive",
    type: "article",
    duration: "8 min",
    category: "Backend",
    level: "Advanced",
    author: "Mike Rodriguez",
    rating: 4.9,
    students: "1.8k",
    thumbnail: "/api/placeholder/300/200",
    featured: false,
    trending: true
  },
  {
    id: 3,
    title: "Interactive CSS Grid Lab",
    type: "lab",
    duration: "15 min",
    category: "Frontend",
    level: "Beginner",
    author: "Emma Watson",
    rating: 4.7,
    students: "3.1k",
    thumbnail: "/api/placeholder/300/200",
    featured: true,
    trending: false
  },
  {
    id: 4,
    title: "AWS Lambda Best Practices",
    type: "video",
    duration: "10 min",
    category: "Cloud",
    level: "Intermediate",
    author: "Alex Kumar",
    rating: 4.6,
    students: "1.5k",
    thumbnail: "/api/placeholder/300/200",
    featured: false,
    trending: true
  }
];

const categories = ["All", "Videos", "Articles", "Labs", "Trending"];

export const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = 
      selectedCategory === "All" || 
      (selectedCategory === "Videos" && lesson.type === "video") ||
      (selectedCategory === "Articles" && lesson.type === "article") ||
      (selectedCategory === "Labs" && lesson.type === "lab") ||
      (selectedCategory === "Trending" && lesson.trending);
    
    return matchesSearch && matchesCategory;
  });

  const featuredLessons = lessons.filter(lesson => lesson.featured);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Play className="h-4 w-4" />;
      case "article": return <FileText className="h-4 w-4" />;
      case "lab": return <Code className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const LessonCard = ({ lesson, featured = false }: { lesson: any, featured?: boolean }) => (
    <Card className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${featured ? 'border-accent/30' : ''}`}>
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <div className="h-48 bg-gradient-card flex items-center justify-center">
            <div className="text-6xl opacity-20">
              {getTypeIcon(lesson.type)}
            </div>
          </div>
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          
          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="capitalize">
              {getTypeIcon(lesson.type)}
              <span className="ml-1">{lesson.type}</span>
            </Badge>
          </div>
          
          {/* Duration */}
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-background/80">
              <Clock className="h-3 w-3 mr-1" />
              {lesson.duration}
            </Badge>
          </div>

          {/* Featured/Trending Badges */}
          {(lesson.featured || lesson.trending) && (
            <div className="absolute bottom-3 left-3 flex gap-2">
              {lesson.featured && (
                <Badge className="bg-accent/90 text-accent-foreground">
                  Featured
                </Badge>
              )}
              {lesson.trending && (
                <Badge className="bg-warning/90 text-warning-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold group-hover:text-accent transition-colors line-clamp-2">
            {lesson.title}
          </h3>
          <p className="text-sm text-muted-foreground">by {lesson.author}</p>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-warning fill-current" />
              <span className="ml-1">{lesson.rating}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{lesson.students} students</span>
          </div>
          
          <Badge variant="outline" className="text-xs">
            {lesson.level}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Explore Our Learning Library
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover thousands of bite-sized lessons designed to fit your schedule and learning style
          </p>
        </div>

        {/* Featured Carousel */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Featured Lessons</h3>
            <Button variant="outline">View All Featured</Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLessons.map(lesson => (
              <LessonCard key={lesson.id} lesson={lesson} featured />
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-card rounded-xl p-6 mb-8 border border-border/50">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search lessons, topics, or instructors..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select defaultValue="category">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category">All Categories</SelectItem>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="cloud">Cloud</SelectItem>
                  <SelectItem value="ai">AI/ML</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="level">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="level">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="duration">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="duration">Any Duration</SelectItem>
                  <SelectItem value="short">0-5 minutes</SelectItem>
                  <SelectItem value="medium">5-15 minutes</SelectItem>
                  <SelectItem value="long">15+ minutes</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="sort">
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sort">Popularity</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex border rounded-lg overflow-hidden">
                <Button 
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid grid-cols-5 w-full max-w-md mx-auto">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing {filteredLessons.length} results
            </p>
          </div>

          {/* Lessons Grid */}
          <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {filteredLessons.map(lesson => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center pt-8">
            <Button variant="outline" size="lg">
              Load More Lessons
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};