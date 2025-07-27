import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Target, CheckCircle, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const StudyPlan: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayTasks = [
    { id: 1, title: 'Complete React Hooks Lesson', time: '9:00 AM', duration: '30 min', completed: true },
    { id: 2, title: 'Practice TypeScript Exercises', time: '2:00 PM', duration: '45 min', completed: false },
    { id: 3, title: 'Review Flashcards', time: '6:00 PM', duration: '15 min', completed: false },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gradient-ai mb-2">Study Plan</h1>
          <p className="text-muted-foreground">Your personalized learning schedule</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>This Week</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, index) => (
                    <div key={day} className="text-center p-3 rounded-lg hover:bg-secondary/30 cursor-pointer">
                      <div className="text-sm text-muted-foreground">{day}</div>
                      <div className="text-lg font-semibold">{15 + index}</div>
                      <div className="w-2 h-2 bg-primary rounded-full mx-auto mt-1"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      whileHover={{ x: 4 }}
                      className="flex items-center space-x-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-all"
                    >
                      <div className="flex-shrink-0">
                        {task.completed ? (
                          <CheckCircle className="h-6 w-6 text-success" />
                        ) : (
                          <Circle className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {task.time}
                          </span>
                          <Badge variant="secondary">{task.duration}</Badge>
                        </div>
                      </div>
                      {!task.completed && (
                        <Button size="sm" variant="outline">Start</Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Weekly Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Lessons Completed</span>
                      <span>3/5</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Study Time</span>
                      <span>4.5/7 hours</span>
                    </div>
                    <Progress value={64} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Streak Days</span>
                      <span>12 days</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">Add Study Session</Button>
                  <Button className="w-full" variant="outline">Reschedule Tasks</Button>
                  <Button className="w-full bg-primary hover:bg-primary/90">Generate New Plan</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;