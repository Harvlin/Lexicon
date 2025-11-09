import { useEffect, useMemo, useState } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LessonCard } from "@/components/dashboard/LessonCard";
import { mockLessons, categories } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { endpoints } from "@/lib/api";
import type { StudyVideoDTO } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import type { LessonDTO } from "@/lib/types";
import { useServerFirst } from "@/hooks/useServerFirst";

type SortOption = "recommended" | "newest" | "popular" | "duration";
type DifficultyFilter = "all" | "beginner" | "intermediate" | "advanced";

export default function Library() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  
  // Track completion changes to refresh the view
  const [completionRefresh, setCompletionRefresh] = useState(0);
  
  // Listen for localStorage changes to sync completion status
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'lexigrain:completedVideos') {
        setCompletionRefresh(prev => prev + 1);
      }
    };
    
    // Custom event for same-window localStorage changes
    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === 'lexigrain:completedVideos') {
        setCompletionRefresh(prev => prev + 1);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange' as any, handleCustomStorageChange as any);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange' as any, handleCustomStorageChange as any);
    };
  }, []);
  
  // Categories: show fallback immediately, then auto-upgrade to API
  const { data: categoryList } = useServerFirst<string[]>(
    categories,
    () => endpoints.categories.list().catch(() => categories),
    []
  );

  const { data: lessons } = useServerFirst<LessonDTO[]>(
    mockLessons,
    () => {
      const q: Record<string, string | number | boolean | undefined> = {
        search: searchQuery || undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        difficulty: difficultyFilter !== "all" ? difficultyFilter : undefined,
        sort: sortBy,
        page: 1,
        limit: 30,
      };
      return endpoints.lessons.list(q)
        .then(res => res.items)
        .catch(() => mockLessons);
    },
    [searchQuery, selectedCategory, difficultyFilter, sortBy]
  );

  // Study Materials Videos Integration
  const [videos, setVideos] = useState<StudyVideoDTO[] | null>(null);
  const [videosError, setVideosError] = useState<string | null>(null);
  const [videosLoading, setVideosLoading] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setVideos(null);
      setVideosError(null);
      setVideosLoading(false);
      return;
    }
    setVideosLoading(true);
    endpoints.studyMaterials.videos()
      .then(res => {
        if (cancelled) return;
        setVideos(res.videos);
        setVideosError(null);
      })
      .catch(err => {
        if (cancelled) return;
        setVideosError(err.message || 'Failed to load personalized videos');
      })
      .finally(() => !cancelled && setVideosLoading(false));
    return () => { cancelled = true; };
  }, [user]);

  // Helper functions for video mapping
  const toEmbedUrl = (videoId?: string, url?: string): string => {
    if (videoId && videoId.trim()) {
      return `https://www.youtube.com/embed/${videoId.trim()}?rel=0`;
    }
    if (!url) return '';
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtube.com')) {
        if (u.pathname.startsWith('/watch')) {
          const id = u.searchParams.get('v');
          if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
        }
        if (u.pathname.startsWith('/shorts/')) {
          const id = u.pathname.split('/')[2];
          if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
        }
        if (u.pathname.startsWith('/embed/')) return url;
      }
      if (u.hostname === 'youtu.be') {
        const id = u.pathname.replace('/', '');
        if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
      }
    } catch {}
    return url;
  };

  const mapDifficulty = (title: string): DifficultyFilter => {
    const t = title.toLowerCase();
    if (t.includes('advanced')) return 'advanced';
    if (t.includes('intermediate')) return 'intermediate';
    if (t.includes('beginner') || t.includes('basics') || t.includes('for beginners')) return 'beginner';
    return 'beginner';
  };

  // Derive display data: prefer API videos when available, otherwise use lessons
  const lessonsView = useMemo(() => {
    // Load completion status from localStorage
    const completedVideos = JSON.parse(localStorage.getItem('lexigrain:completedVideos') || '{}');
    
    if (videos && videos.length > 0) {
      return videos.map(v => {
        const lessonId = `api-video-${v.id}`;
        const isCompleted = !!completedVideos[lessonId];
        
        return {
          id: lessonId,
          title: v.title,
          description: v.channelTitle || v.topic || 'Video lesson',
          category: v.topic || 'Video',
          difficulty: mapDifficulty(v.title) as any,
          duration: v.duration || 60, // Use real duration from backend, fallback to 60
          progress: isCompleted ? 100 : 0,
          thumbnail: '',
          type: 'video' as const,
          tags: [v.channelTitle, v.topic].filter(Boolean) as string[],
          isFavorite: false,
          videoUrl: toEmbedUrl(v.videoId, v.videoUrl),
        };
      });
    }
    
    // For regular lessons, also check completion status
    return lessons.map(l => {
      const isCompleted = !!completedVideos[l.id];
      return {
        ...l,
        progress: isCompleted ? 100 : l.progress
      };
    });
  }, [videos, lessons, completionRefresh]); // Add completionRefresh as dependency

  // Track favorite state separately for optimistic updates
  const [favoriteOverrides, setFavoriteOverrides] = useState<Record<string, boolean>>({});

  const handleToggleFavorite = (id: string) => {
    const currentState = favoriteOverrides[id] ?? lessonsView.find(l => l.id === id)?.isFavorite ?? false;
    setFavoriteOverrides(prev => ({ ...prev, [id]: !currentState }));
    
    if (!id.startsWith('api-video-')) {
      endpoints.lessons.toggleFavorite(id).catch(() => {
        // Revert on failure
        setFavoriteOverrides(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      });
    }
  };

  // Apply favorite overrides to lessons
  const lessonsWithFavorites = useMemo(() => 
    lessonsView.map(l => ({
      ...l,
      isFavorite: favoriteOverrides[l.id] ?? l.isFavorite
    })),
    [lessonsView, favoriteOverrides]
  );

  // Filter lessons
  const filteredLessons = useMemo(() => lessonsWithFavorites.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All" || lesson.category === selectedCategory;

    const matchesDifficulty =
      difficultyFilter === "all" || lesson.difficulty === difficultyFilter;

    return matchesSearch && matchesCategory && matchesDifficulty;
  }), [lessonsWithFavorites, searchQuery, selectedCategory, difficultyFilter]);

  // Sort lessons
  const sortedLessons = useMemo(() => [...filteredLessons].sort((a, b) => {
    switch (sortBy) {
      case "duration":
        return a.duration - b.duration;
      case "newest":
        return b.id.localeCompare(a.id);
      case "popular":
        return (b.progress || 0) - (a.progress || 0);
      default:
        return 0;
    }
  }), [filteredLessons, sortBy]);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-heading font-bold">Course Library</h1>
        <p className="text-muted-foreground">
          Explore our comprehensive collection of courses and lessons
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search lessons, topics, or tags..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="duration">Shortest First</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={difficultyFilter}
            onValueChange={(v) => setDifficultyFilter(v as DifficultyFilter)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categoryList.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all hover:scale-105",
                selectedCategory === category &&
                  "bg-primary text-primary-foreground"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {sortedLessons.length} {sortedLessons.length === 1 ? "lesson" : "lessons"}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
        {videos && videos.length > 0 && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400">Showing personalized videos</span>
        )}
        {(searchQuery || selectedCategory !== "All" || difficultyFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setDifficultyFilter("all");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* API videos replace the lessons grid content; no separate section */}

      {/* Lessons Grid */}
      {sortedLessons.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-heading font-semibold mb-2">
            No lessons found
          </h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search query
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setDifficultyFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
