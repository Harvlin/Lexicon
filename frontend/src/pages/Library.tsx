import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Clock,
  Star,
  Play,
  BookOpen,
  Code,
  Monitor,
  Gamepad2,
  Grid3X3,
  List,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { mockLessons, Lesson } from '@/lib/mock-data';

const Library: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get all unique topics
  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    mockLessons.forEach(lesson => {
      lesson.topics.forEach(topic => topics.add(topic));
    });
    return Array.from(topics);
  }, []);

  // Filter and sort lessons
  const filteredLessons = useMemo(() => {
    let filtered = mockLessons.filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lesson.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesDifficulty = selectedDifficulty === 'all' || lesson.difficulty === selectedDifficulty;
      const matchesType = selectedType === 'all' || lesson.type === selectedType;
      const matchesTopic = selectedTopic === 'all' || lesson.topics.includes(selectedTopic);

      return matchesSearch && matchesDifficulty && matchesType && matchesTopic;
    });

    // Sort lessons
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'duration':
          return a.duration - b.duration;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedDifficulty, selectedType, selectedTopic, sortBy]);

  const getTypeIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return Play;
      case 'text':
        return BookOpen;
      case 'code-lab':
        return Code;
      case 'interactive':
        return Gamepad2;
      default:
        return BookOpen;
    }
  };

  const getDifficultyColor = (difficulty: Lesson['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-success/10 text-success border-success/20';
      case 'intermediate':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'advanced':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-secondary';
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('all');
    setSelectedType('all');
    setSelectedTopic('all');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gradient-ai mb-2">Learning Library</h1>
            <p className="text-muted-foreground">
              Discover and learn from our comprehensive collection of lessons
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {filteredLessons.length} lessons
            </Badge>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <Card className="card-gradient">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search lessons, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="code-lab">Code Lab</SelectItem>
                    <SelectItem value="interactive">Interactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    {allTopics.map((topic) => (
                      <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={resetFilters}>
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>

                <div className="flex ml-auto space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson, index) => {
                const TypeIcon = getTypeIcon(lesson.type);
                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Link to={`/lesson/${lesson.id}`}>
                      <Card className="card-gradient hover-lift hover:border-primary/30 transition-all duration-300 h-full">
                        <div className="relative">
                          <img
                            src={lesson.thumbnail}
                            alt={lesson.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className={getDifficultyColor(lesson.difficulty)}>
                              {lesson.difficulty}
                            </Badge>
                          </div>
                          <div className="absolute top-3 right-3">
                            <div className="bg-black/50 text-white px-2 py-1 rounded-md text-sm flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {lesson.duration}m
                            </div>
                          </div>
                          <div className="absolute bottom-3 right-3">
                            <div className="bg-primary/90 text-white p-2 rounded-full">
                              <TypeIcon className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-2">{lesson.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                            {lesson.description}
                          </p>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{lesson.rating}</span>
                              <span className="text-sm text-muted-foreground">
                                ({lesson.views} views)
                              </span>
                            </div>
                          </div>

                          {lesson.progress !== undefined && (
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{lesson.progress}%</span>
                              </div>
                              <Progress value={lesson.progress} className="h-2" />
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1">
                            {lesson.topics.slice(0, 3).map((topic) => (
                              <Badge key={topic} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                            {lesson.topics.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{lesson.topics.length - 3}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLessons.map((lesson, index) => {
                const TypeIcon = getTypeIcon(lesson.type);
                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/lesson/${lesson.id}`}>
                      <Card className="card-gradient hover-lift hover:border-primary/30 transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={lesson.thumbnail}
                              alt={lesson.title}
                              className="w-24 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-lg">{lesson.title}</h3>
                                <div className="flex items-center space-x-2">
                                  <Badge className={getDifficultyColor(lesson.difficulty)}>
                                    {lesson.difficulty}
                                  </Badge>
                                  <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                    <TypeIcon className="h-4 w-4" />
                                  </div>
                                </div>
                              </div>
                              <p className="text-muted-foreground mb-3 line-clamp-2">
                                {lesson.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <span className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {lesson.duration} min
                                  </span>
                                  <span className="flex items-center">
                                    <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                                    {lesson.rating}
                                  </span>
                                  <span>{lesson.views} views</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {lesson.topics.slice(0, 2).map((topic) => (
                                    <Badge key={topic} variant="secondary" className="text-xs">
                                      {topic}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              {lesson.progress !== undefined && (
                                <div className="mt-3">
                                  <Progress value={lesson.progress} className="h-2" />
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {filteredLessons.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No lessons found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse all lessons
            </p>
            <Button onClick={resetFilters}>Clear Filters</Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Library;