import { Link } from "react-router-dom";
import { Star, Check, Clock } from "lucide-react";
import { LessonTypeIcon } from "@/lib/iconMaps";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { LessonDTO } from "@/lib/types";

interface LessonCardProps {
  lesson: LessonDTO;
  onToggleFavorite?: (id: string) => void;
}

const difficultyColors = {
  beginner: "bg-success/20 text-success border-success/30",
  intermediate: "bg-warning/20 text-warning border-warning/30",
  advanced: "bg-destructive/20 text-destructive border-destructive/30",
};

// replaced emoji with unified lucide icons via LessonTypeIcon

export function LessonCard({ lesson, onToggleFavorite }: LessonCardProps) {
  const isCompleted = lesson.progress === 100;

  return (
    <Card className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-scale-in">
      <div className="h-2 bg-gradient-primary" />
      
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-md border bg-muted grid place-items-center">
              <LessonTypeIcon type={lesson.type} />
            </span>
            <Badge
              variant="outline"
              className={cn("text-xs", difficultyColors[lesson.difficulty])}
            >
              {lesson.difficulty}
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 transition-colors",
              lesson.isFavorite && "text-accent hover:text-accent"
            )}
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite?.(lesson.id);
            }}
          >
            <Star
              className={cn(
                "h-4 w-4",
                lesson.isFavorite && "fill-current"
              )}
            />
          </Button>
        </div>

        <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {lesson.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {lesson.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {lesson.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {lesson.progress > 0 && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-primary">{lesson.progress}%</span>
            </div>
            <Progress value={lesson.progress} className="h-2" />
          </div>
        )}
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{lesson.category}</span>
          {lesson.duration && lesson.duration > 0 && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {Math.floor(lesson.duration / 60) > 0 
                  ? `${Math.floor(lesson.duration / 60)}h${lesson.duration % 60 ? ` ${lesson.duration % 60}m` : ''}`
                  : `${lesson.duration}m`}
              </span>
            </>
          )}
        </div>

        <Link to={`/lesson/${lesson.id}`}>
          <Button
            size="sm"
            variant={isCompleted ? "secondary" : "default"}
            className={cn(
              "gap-1.5",
              !isCompleted && "bg-accent hover:bg-accent-hover text-accent-foreground"
            )}
          >
            {isCompleted ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Review
              </>
            ) : lesson.progress > 0 ? (
              "Continue"
            ) : (
              "Start"
            )}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
