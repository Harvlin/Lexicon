import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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
  Grid3X3, 
  List, 
  Play, 
  Clock, 
  Star, 
  BookOpen, 
  Code, 
  FileText,
  TrendingUp,
  Filter
} from "lucide-react";
import { MockAPI, type Lesson } from "@/utils/mockApi";

const LibraryPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    category: "All",
    level: "All",
    type: "All",
    sort: "popularity"
  });

  useEffect(() => {
    loadLessons();
  }, [filters]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await MockAPI.getLessons({
        category: filters.category !== "All" ? filters.category : undefined,
        level: filters.level !== "All" ? filters.level : undefined,
        type: filters.type !== "All" ? filters.type : undefined,
      });
      setLessons(data);
    } catch (error) {
      console.error("Failed to load lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
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

  const LessonCard = ({ lesson, featured = false }: { lesson: Lesson, featured?: boolean }) => (
    <Link to={`/lesson/${lesson.id}`} className="block">
      <Card className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${featured ? 'border-accent/30' : ''}`}>
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <div className="h-48 bg-gradient-card flex items-center justify-center">
            <div className="text-6xl opacity-20">
              {getTypeIcon(lesson.type)}
            </div>
          </div>
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="capitalize">
              {getTypeIcon(lesson.type)}
              <span className="ml-1">{lesson.type}</span>
            </Badge>
          </div>
          
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-background/80">
              <Clock className="h-3 w-3 mr-1" />
              {lesson.duration} min
            </Badge>
          </div>

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
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {lesson.description}
        </p>
        
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
  </Link>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-3xl md:text-4xl font-bold">
              Learning Library
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover thousands of bite-sized lessons designed to fit your schedule and learning style
            </p>
          </div>

          {/* Featured Section */}
          {featuredLessons.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Featured Lessons</h2>
                <Button variant="outline">View All Featured</Button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredLessons.map(lesson => (
                  <LessonCard key={lesson.id} lesson={lesson} featured />
                ))}
              </div>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="bg-card rounded-xl p-6 mb-8 border border-border/50">
            <div className="flex flex-col lg:flex-row gap-4">
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

              <div className="flex flex-wrap gap-3">
                <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Cloud">Cloud</SelectItem>
                    <SelectItem value="AI/ML">AI/ML</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.level} onValueChange={(value) => setFilters({...filters, level: value})}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

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
              {["All", "Videos", "Articles", "Labs", "Trending"].map(category => (
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

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg" />
                    <CardContent className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                {filteredLessons.map(lesson => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            )}

            {!loading && filteredLessons.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No lessons found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setFilters({
                    category: "All",
                    level: "All",
                    type: "All",
                    sort: "popularity"
                  });
                }}>
                  Clear Filters
                </Button>
              </div>
            )}

            {!loading && filteredLessons.length > 0 && (
              <div className="text-center pt-8">
                <Button variant="outline" size="lg">
                  Load More Lessons
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LibraryPage;