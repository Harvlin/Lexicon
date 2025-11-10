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

// Colorful gradient tops - rotating between blue, orange, and red
const gradientVariants = [
  "bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500", // Blue-teal
  "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500", // Orange-yellow
  "bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500", // Red-orange
  "bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500", // Teal-green
  "bg-gradient-to-r from-amber-500 via-orange-600 to-red-500", // Warm gradient
];

// Icon background colors
const iconBgVariants = [
  "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
  "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400",
  "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400",
  "bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400",
  "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
];

// replaced emoji with unified lucide icons via LessonTypeIcon

export function LessonCard({ lesson, onToggleFavorite }: LessonCardProps) {
  const isCompleted = lesson.progress === 100;
  
  // Use lesson ID to consistently pick a gradient (each card gets same gradient every time)
  const gradientIndex = lesson.id.charCodeAt(0) % gradientVariants.length;
  const iconColorIndex = lesson.id.charCodeAt(1) % iconBgVariants.length;

  return (
    <Card className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-scale-in border-2">
      <div className={cn("h-2", gradientVariants[gradientIndex])} />
      
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={cn(
              "h-8 w-8 rounded-md border grid place-items-center transition-all duration-300 group-hover:scale-110",
              iconBgVariants[iconColorIndex]
            )}>
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
              lesson.isFavorite && "text-orange-500 hover:text-orange-600"
            )}
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite?.(lesson.id);
            }}
          >
            <Star
              className={cn(
                "h-4 w-4 transition-transform group-hover:scale-110",
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
          {lesson.tags.slice(0, 3).map((tag, idx) => {
            // Colorful tag variants
            const tagColors = [
              "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
              "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
              "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
            ];
            return (
              <Badge 
                key={tag} 
                variant="secondary" 
                className={cn("text-xs font-medium", tagColors[idx % tagColors.length])}
              >
                {tag}
              </Badge>
            );
          })}
        </div>

        {lesson.progress > 0 && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                {lesson.progress}%
              </span>
            </div>
            <Progress value={lesson.progress} className="h-2" />
          </div>
        )}
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">{lesson.category}</span>
          {lesson.duration && lesson.duration > 0 && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-orange-500" />
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
              "gap-1.5 transition-all duration-300",
              !isCompleted && "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg"
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
