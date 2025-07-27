import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Star, PlayCircle, BookOpen, Brain, FileText, Zap, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { getLessonById } from '@/lib/mock-data';
import AILessonChat from '@/components/chat/AILessonChat';

const LessonViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('content');
  const [progress, setProgress] = useState(0);

  const lesson = getLessonById(id || '');

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson not found</h1>
          <Link to="/library">
            <Button>Back to Library</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4 mb-6"
        >
          <Link to="/library">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Button>
          </Link>
          <div className="h-6 w-px bg-border" />
          <Badge variant="secondary">{lesson.type}</Badge>
          <Badge className={`${lesson.difficulty === 'beginner' ? 'bg-success/10 text-success' : 
            lesson.difficulty === 'intermediate' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>
            {lesson.difficulty}
          </Badge>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Lesson Header */}
              <Card className="card-gradient">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
                      <p className="text-muted-foreground mb-4">{lesson.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {lesson.duration} minutes
                        </span>
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                          {lesson.rating}
                        </span>
                        <span>{lesson.views} views</span>
                      </div>
                    </div>
                    <img
                      src={lesson.thumbnail}
                      alt={lesson.title}
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                  </div>
                  
                  {lesson.progress !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Your Progress</span>
                        <span>{lesson.progress}%</span>
                      </div>
                      <Progress value={lesson.progress} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Content Tabs */}
              <Card className="card-gradient">
                <CardHeader>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="content">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Content
                      </TabsTrigger>
                      <TabsTrigger value="summary">
                        <FileText className="h-4 w-4 mr-2" />
                        Summary
                      </TabsTrigger>
                      <TabsTrigger value="quiz">
                        <Brain className="h-4 w-4 mr-2" />
                        Quiz
                      </TabsTrigger>
                      <TabsTrigger value="flashcards">
                        <Zap className="h-4 w-4 mr-2" />
                        Cards
                      </TabsTrigger>
                      <TabsTrigger value="chat">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        AI Chat
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsContent value="content" className="space-y-4">
                      {lesson.type === 'video' && (
                        <div className="aspect-video bg-secondary/20 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <PlayCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                            <p className="text-muted-foreground">Video content would load here</p>
                          </div>
                        </div>
                      )}
                      {lesson.type === 'code-lab' && lesson.code && (
                        <div className="bg-card border rounded-lg p-4">
                          <pre className="text-sm overflow-x-auto">
                            <code>{lesson.code}</code>
                          </pre>
                        </div>
                      )}
                      {lesson.type === 'text' && (
                        <div className="prose prose-invert max-w-none">
                          <p>This would contain the text-based lesson content with rich formatting, images, and interactive elements.</p>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="summary">
                      <div className="space-y-4">
                        <h3 className="font-semibold">AI-Generated Summary</h3>
                        <div className="bg-secondary/30 rounded-lg p-4">
                          <p className="text-sm">• Key concepts and takeaways from this lesson</p>
                          <p className="text-sm">• Important code patterns and best practices</p>
                          <p className="text-sm">• Next steps for continued learning</p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="quiz">
                      <div className="text-center py-8">
                        <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">Test Your Knowledge</h3>
                        <p className="text-muted-foreground mb-4">Take a quiz to reinforce your learning</p>
                        <Button>Start Quiz</Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="flashcards">
                      <div className="text-center py-8">
                        <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">Review Flashcards</h3>
                        <p className="text-muted-foreground mb-4">Practice key concepts with spaced repetition</p>
                        <Button>Start Review</Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="chat" className="h-[500px]">
                      <AILessonChat lessonTitle={lesson.title} lessonId={lesson.id} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle>Topics Covered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {lesson.topics.map((topic) => (
                    <Badge key={topic} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardHeader>
                <CardTitle>Related Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary/30 cursor-pointer">
                      <div className="w-12 h-8 bg-secondary rounded"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Related Lesson {i}</p>
                        <p className="text-xs text-muted-foreground">15 min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;