import React from "react";
import {
  Award,
  BadgeCheck,
  BookOpen,
  Bot,
  CheckSquare,
  Flame,
  Globe,
  Infinity,
  Layers,
  Moon,
  PlayCircle,
  Puzzle,
  Share2,
  Star,
  Sun,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

export function AchievementIconId({ id, className = "h-6 w-6 text-foreground" }: { id: string; className?: string }) {
  switch (id) {
    case "first-steps":
      return <Target className={className} />;
    case "dedicated-learner":
      return <BookOpen className={className} />;
    case "week-warrior":
      return <Flame className={className} />;
    case "knowledge-seeker":
      return <BookOpen className={className} />;
    case "quiz-master":
      return <CheckSquare className={className} />;
    case "perfect-score":
      return <BadgeCheck className={className} />;
    case "speed-learner":
      return <Zap className={className} />;
    case "master-level":
      return <Star className={className} />;
    case "century-club":
      return <Trophy className={className} />;
    case "polyglot":
      return <Globe className={className} />;
    case "unstoppable":
      return <Infinity className={className} />;
    case "ai-master":
      return <Bot className={className} />;
    case "flashcard-pro":
      return <Layers className={className} />;
    case "early-bird":
      return <Sun className={className} />;
    case "night-owl":
      return <Moon className={className} />;
    case "social-butterfly":
      return <Share2 className={className} />;
    default:
      return <Award className={className} />;
  }
}

export function BadgeIconByName({ name, className = "h-4 w-4 text-foreground" }: { name: string; className?: string }) {
  if (/quick/i.test(name)) return <Zap className={className} />;
  if (/(warrior|streak)/i.test(name)) return <Flame className={className} />;
  if (/(knowledge|seeker|learn)/i.test(name)) return <BookOpen className={className} />;
  return <Award className={className} />;
}

export function LessonTypeIcon({ type, className = "h-5 w-5 text-foreground" }: { type: string; className?: string }) {
  if (type === "video") return <PlayCircle className={className} />;
  if (type === "reading") return <BookOpen className={className} />;
  if (type === "interactive") return <Puzzle className={className} />;
  if (type === "quiz") return <CheckSquare className={className} />;
  return <BookOpen className={className} />;
}
