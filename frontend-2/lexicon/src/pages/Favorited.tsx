import { useEffect, useState } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LessonCard } from "@/components/dashboard/LessonCard";
import { endpoints } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { LessonDTO } from "@/lib/types";

export default function Favorited() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<LessonDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch favorited lessons from backend
    endpoints.lessons.favorited()
      .then((res) => {
        setLessons(res.items || []);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch favorited lessons:", err);
        setError("Failed to load your favorites. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleToggleFavorite = (id: string) => {
    // Optimistic update - remove from list
    setLessons((prev) => prev.filter((lesson) => lesson.id !== id));
    
    // Call backend to toggle
    endpoints.lessons.toggleFavorite(id).catch(() => {
      // Revert on error - refetch favorites
      endpoints.lessons.favorited()
        .then((res) => setLessons(res.items || []))
        .catch(() => {});
    });
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Heart className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-heading font-bold">Sign in to view favorites</h2>
        <p className="text-muted-foreground">You need to be signed in to save and view your favorite lessons.</p>
        <Link to="/signin">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading your favorites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Heart className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-heading font-bold">Oops!</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/library">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-500 fill-red-500" />
              My Favorites
            </h1>
            <p className="text-muted-foreground mt-1">
              Your collection of favorited lessons
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {lessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <Heart className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-heading font-bold">No favorites yet</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Start exploring lessons and click the heart icon to add them to your favorites!
          </p>
          <Link to="/library">
            <Button>Browse Lessons</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'} saved
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
