import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Target, BookOpen, CheckCircle } from "lucide-react";

export default function StudyPlan() {
  const mockPlan = [
    { id: 1, title: "React Hooks Advanced", date: "Today", time: "9:00 AM", completed: true },
    { id: 2, title: "TypeScript Fundamentals", date: "Today", time: "2:00 PM", completed: false },
    { id: 3, title: "Database Design", date: "Tomorrow", time: "10:00 AM", completed: false },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Study Plan</h1>
          <p className="text-muted-foreground mt-1">Your personalized learning schedule</p>
        </div>

        <div className="space-y-4">
          {mockPlan.map((item) => (
            <Card key={item.id} className="lesson-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${item.completed ? 'bg-success' : 'bg-muted'}`} />
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.date} at {item.time}</p>
                    </div>
                  </div>
                  {item.completed ? (
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                    <Button variant="outline">Start Learning</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}